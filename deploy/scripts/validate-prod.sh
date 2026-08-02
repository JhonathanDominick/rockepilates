#!/usr/bin/env bash
set -euo pipefail

COMPOSE=(docker compose -f docker-compose.yml -f docker-compose.prod.yml)
ENV_FILE="${ENV_FILE:-.env}"

die() {
  echo "ERRO: $*" >&2
  exit 1
}

get_env() {
  local key="$1"
  grep -E "^${key}=" "${ENV_FILE}" | tail -n 1 | cut -d= -f2-
}

[ -f "${ENV_FILE}" ] || die "${ENV_FILE} nao encontrado"

"${COMPOSE[@]}" config --quiet
"${COMPOSE[@]}" ps

curl -fsSI http://127.0.0.1:3000 >/dev/null
curl -fsS http://127.0.0.1:8080/bff/health | grep -q 'UP'

cors="$(get_env APP_CORS_ALLOWED_ORIGINS)"
[ "$(get_env APP_COOKIE_SECURE)" = "true" ] || die "APP_COOKIE_SECURE nao esta true"

if echo "${cors}" | grep -Eq 'localhost|127\.0\.0\.1|\*'; then
  die "CORS de producao contem origem insegura: ${cors}"
fi

if ss -ltn | grep -Eq '(^|[[:space:]])(0\.0\.0\.0|\[::\]):(5432|8080|8081|8082)[[:space:]]'; then
  ss -ltn
  die "porta interna publicada em interface publica"
fi

echo "Validacao local de producao concluida."
echo "Ainda valide externamente HTTPS, DNS, firewall do provedor e restauracao de backup."
