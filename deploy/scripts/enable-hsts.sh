#!/usr/bin/env bash
set -euo pipefail

COMPOSE=(docker compose -f docker-compose.yml -f docker-compose.prod.yml)
ENV_FILE="${ENV_FILE:-.env}"

die() {
  echo "ERRO: $*" >&2
  exit 1
}

[ -f "${ENV_FILE}" ] || die "${ENV_FILE} nao encontrado"

if ! curl -fsSI https://rockerpilates.com >/dev/null; then
  die "HTTPS ainda nao respondeu em rockerpilates.com; nao ative HSTS antes disso"
fi

if grep -q '^APP_SECURITY_HSTS_ENABLED=' "${ENV_FILE}"; then
  sed -i 's/^APP_SECURITY_HSTS_ENABLED=.*/APP_SECURITY_HSTS_ENABLED=true/' "${ENV_FILE}"
else
  printf '%s=%s\n' "APP_SECURITY_HSTS_ENABLED" "true" >> "${ENV_FILE}"
fi

chmod 600 "${ENV_FILE}"
"${COMPOSE[@]}" up -d --build
echo "HSTS ativado e stack recriada."
