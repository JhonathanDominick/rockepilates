#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${DOMAIN:-rockerpilates.com}"
WWW_DOMAIN="${WWW_DOMAIN:-www.rockerpilates.com}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"
SKIP_DNS_CHECK="${SKIP_DNS_CHECK:-false}"

die() {
  echo "ERRO: $*" >&2
  exit 1
}

info() {
  echo "==> $*"
}

require_root() {
  if [ "$(id -u)" -ne 0 ]; then
    die "execute como root: sudo -E bash deploy/scripts/install-nginx-certbot.sh"
  fi
}

first_ipv4() {
  getent ahostsv4 "$1" | awk 'NR == 1 { print $1 }'
}

assert_dns_points_here() {
  if [ "${SKIP_DNS_CHECK}" = "true" ]; then
    info "Pulando checagem DNS por SKIP_DNS_CHECK=true"
    return
  fi

  local public_ip domain_ip www_ip
  public_ip="$(curl -fsS https://api.ipify.org)"
  domain_ip="$(first_ipv4 "${DOMAIN}")"
  www_ip="$(first_ipv4 "${WWW_DOMAIN}")"

  [ -n "${domain_ip}" ] || die "DNS de ${DOMAIN} ainda nao resolveu"
  [ -n "${www_ip}" ] || die "DNS de ${WWW_DOMAIN} ainda nao resolveu"
  [ "${domain_ip}" = "${public_ip}" ] || die "${DOMAIN} aponta para ${domain_ip}, mas esta VPS e ${public_ip}"
  [ "${www_ip}" = "${public_ip}" ] || die "${WWW_DOMAIN} aponta para ${www_ip}, mas esta VPS e ${public_ip}"
}

main() {
  require_root
  [ -n "${CERTBOT_EMAIL}" ] || die "defina CERTBOT_EMAIL antes de emitir HTTPS"
  [ -f deploy/nginx/rockerpilates.conf.example ] || die "execute a partir da raiz do repositorio"

  assert_dns_points_here

  info "Instalando configuracao Nginx inicial"
  cp deploy/nginx/rockerpilates.conf.example /etc/nginx/sites-available/rockerpilates
  ln -sfn /etc/nginx/sites-available/rockerpilates /etc/nginx/sites-enabled/rockerpilates
  rm -f /etc/nginx/sites-enabled/default
  nginx -t
  systemctl reload nginx

  info "Emitindo certificado HTTPS com Certbot"
  certbot --nginx \
    -d "${DOMAIN}" \
    -d "${WWW_DOMAIN}" \
    --redirect \
    --agree-tos \
    --no-eff-email \
    -m "${CERTBOT_EMAIL}"

  certbot renew --dry-run
  info "HTTPS configurado. Depois de validar no navegador, rode deploy/scripts/enable-hsts.sh."
}

main "$@"
