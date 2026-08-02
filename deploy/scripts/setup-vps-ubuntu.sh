#!/usr/bin/env bash
set -euo pipefail

DEPLOY_USER="${DEPLOY_USER:-rocker}"
SSH_PORT="${SSH_PORT:-22}"
AUTHORIZED_KEY="${AUTHORIZED_KEY:-}"
SWAP_SIZE="${SWAP_SIZE:-2G}"
BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/rockerpilates}"

die() {
  echo "ERRO: $*" >&2
  exit 1
}

info() {
  echo "==> $*"
}

require_root() {
  if [ "$(id -u)" -ne 0 ]; then
    die "execute como root: sudo -E bash deploy/scripts/setup-vps-ubuntu.sh"
  fi
}

install_authorized_key() {
  local home_dir
  home_dir="$(eval echo "~${DEPLOY_USER}")"
  mkdir -p "${home_dir}/.ssh"
  chmod 700 "${home_dir}/.ssh"

  if [ -n "${AUTHORIZED_KEY}" ]; then
    grep -qxF "${AUTHORIZED_KEY}" "${home_dir}/.ssh/authorized_keys" 2>/dev/null \
      || echo "${AUTHORIZED_KEY}" >> "${home_dir}/.ssh/authorized_keys"
  fi

  if [ ! -s "${home_dir}/.ssh/authorized_keys" ]; then
    die "nenhuma chave SSH encontrada para ${DEPLOY_USER}. Rode com AUTHORIZED_KEY='ssh-ed25519 ...' para evitar acesso por senha."
  fi

  chmod 600 "${home_dir}/.ssh/authorized_keys"
  chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${home_dir}/.ssh"
}

install_docker() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    info "Docker e Compose ja instalados"
    return
  fi

  info "Instalando Docker pelo repositorio oficial"
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  . /etc/os-release
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list

  apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y \
    docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  systemctl enable --now docker
}

configure_swap() {
  if swapon --show | grep -q '^'; then
    info "Swap ja configurado"
    return
  fi

  info "Configurando swap de ${SWAP_SIZE}"
  if ! fallocate -l "${SWAP_SIZE}" /swapfile; then
    dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress
  fi
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
}

configure_ssh() {
  info "Aplicando hardening SSH"
  mkdir -p /etc/ssh/sshd_config.d
  cat > /etc/ssh/sshd_config.d/99-rockerpilates.conf <<EOF
Port ${SSH_PORT}
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
X11Forwarding no
AllowUsers ${DEPLOY_USER}
EOF

  sshd -t
  systemctl reload ssh 2>/dev/null || systemctl reload sshd
}

configure_firewall() {
  info "Configurando firewall UFW"
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow "${SSH_PORT}/tcp"
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable
}

configure_fail2ban() {
  info "Configurando fail2ban para SSH"
  cat > /etc/fail2ban/jail.d/rockerpilates-sshd.local <<EOF
[sshd]
enabled = true
port = ${SSH_PORT}
maxretry = 5
findtime = 10m
bantime = 1h
EOF
  systemctl enable --now fail2ban
  systemctl restart fail2ban
}

configure_unattended_upgrades() {
  info "Ativando atualizacoes automaticas de seguranca"
  cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
  systemctl enable --now unattended-upgrades
}

main() {
  require_root

  if ! grep -qi '^ID=ubuntu' /etc/os-release; then
    die "script preparado para Ubuntu 24.04 LTS"
  fi

  info "Atualizando pacotes base"
  apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y \
    ca-certificates curl gnupg git nginx certbot python3-certbot-nginx \
    ufw fail2ban unattended-upgrades rsync tar gzip openssl lsb-release

  if ! id "${DEPLOY_USER}" >/dev/null 2>&1; then
    info "Criando usuario de deploy ${DEPLOY_USER}"
    adduser --disabled-password --gecos "" "${DEPLOY_USER}"
  fi

  usermod -aG sudo "${DEPLOY_USER}"
  install_authorized_key

  install_docker
  usermod -aG docker "${DEPLOY_USER}"

  mkdir -p "${BACKUP_ROOT}"
  chown "${DEPLOY_USER}:${DEPLOY_USER}" "${BACKUP_ROOT}"
  chmod 700 "${BACKUP_ROOT}"

  configure_swap
  configure_firewall
  configure_fail2ban
  configure_unattended_upgrades
  configure_ssh

  systemctl enable --now nginx

  info "VPS preparada. Abra uma nova sessao SSH com o usuario ${DEPLOY_USER} antes de continuar."
  info "Portas liberadas: ${SSH_PORT}, 80, 443. Docker daemon, PostgreSQL e servicos internos nao foram expostos."
}

main "$@"
