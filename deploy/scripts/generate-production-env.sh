#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-.env}"

die() {
  echo "ERRO: $*" >&2
  exit 1
}

append_secret() {
  local key="$1"
  local value
  value="$(openssl rand -hex 32)"
  printf '%s=%s\n' "${key}" "${value}" >> "${ENV_FILE}"
}

if [ -e "${ENV_FILE}" ]; then
  die "${ENV_FILE} ja existe. Nao sobrescrevo arquivo de producao."
fi

if [ ! -f deploy/env.production.example ]; then
  die "execute a partir da raiz do repositorio"
fi

cp deploy/env.production.example "${ENV_FILE}"
{
  echo
  echo "# Secrets reais gerados localmente no servidor. Nao commitar este arquivo."
} >> "${ENV_FILE}"

append_secret "DB_PASSWORD"
append_secret "JWT_SECRET"
append_secret "JWT_ALUNO_SECRET"
append_secret "INTERNAL_SERVICE_TOKEN"

chmod 600 "${ENV_FILE}"
echo "${ENV_FILE} criado com permissoes 600. Revise dominio, usuario do banco e flags antes do deploy."
