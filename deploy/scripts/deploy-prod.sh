#!/usr/bin/env bash
set -euo pipefail

COMPOSE=(docker compose -f docker-compose.yml -f docker-compose.prod.yml)
ENV_FILE="${ENV_FILE:-.env}"

die() {
  echo "ERRO: $*" >&2
  exit 1
}

info() {
  echo "==> $*"
}

get_env() {
  local key="$1"
  grep -E "^${key}=" "${ENV_FILE}" | tail -n 1 | cut -d= -f2-
}

require_env() {
  local key="$1"
  if ! grep -qE "^${key}=.+" "${ENV_FILE}"; then
    die "variavel obrigatoria ausente ou vazia no ${ENV_FILE}: ${key}"
  fi
}

assert_secure_env() {
  [ -f "${ENV_FILE}" ] || die "crie ${ENV_FILE} antes do deploy"
  chmod 600 "${ENV_FILE}"

  require_env "DB_PASSWORD"
  require_env "JWT_SECRET"
  require_env "JWT_ALUNO_SECRET"
  require_env "INTERNAL_SERVICE_TOKEN"
  require_env "NEXT_PUBLIC_BFF_URL"
  require_env "APP_COOKIE_SECURE"
  require_env "APP_CORS_ALLOWED_ORIGINS"

  [ "$(get_env APP_COOKIE_SECURE)" = "true" ] || die "APP_COOKIE_SECURE precisa ser true em producao"

  local bff_url cors
  bff_url="$(get_env NEXT_PUBLIC_BFF_URL)"
  cors="$(get_env APP_CORS_ALLOWED_ORIGINS)"

  case "${bff_url}" in
    https://rockerpilates.com|https://www.rockerpilates.com) ;;
    *) die "NEXT_PUBLIC_BFF_URL deve usar HTTPS e dominio real do RockerPilates" ;;
  esac

  if echo "${cors}" | grep -Eq 'localhost|127\.0\.0\.1|\*'; then
    die "APP_CORS_ALLOWED_ORIGINS nao pode conter localhost, 127.0.0.1 ou * em producao"
  fi
}

wait_for() {
  local label="$1"
  local command="$2"
  local retries="${3:-30}"

  info "Aguardando ${label}"
  for _ in $(seq 1 "${retries}"); do
    if bash -lc "${command}" >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done
  die "${label} nao respondeu dentro do tempo esperado"
}

main() {
  if [ "$(id -u)" -eq 0 ]; then
    die "nao execute deploy como root; use o usuario de deploy"
  fi

  assert_secure_env

  info "Validando docker compose"
  "${COMPOSE[@]}" config --quiet

  info "Subindo stack de producao"
  "${COMPOSE[@]}" up -d --build

  wait_for "frontend local" "curl -fsSI http://127.0.0.1:3000"
  wait_for "BFF health local" "curl -fsS http://127.0.0.1:8080/bff/health | grep -q 'UP'"

  "${COMPOSE[@]}" ps
  info "Deploy concluido localmente. Nginx/HTTPS ainda precisam estar configurados para acesso publico."
}

main "$@"
