#!/usr/bin/env bash
set -euo pipefail

COMPOSE=(docker compose -f docker-compose.yml -f docker-compose.prod.yml)
ENV_FILE="${ENV_FILE:-.env}"
BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/rockerpilates}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

die() {
  echo "ERRO: $*" >&2
  exit 1
}

get_env() {
  local key="$1"
  grep -E "^${key}=" "${ENV_FILE}" | tail -n 1 | cut -d= -f2-
}

[ -f "${ENV_FILE}" ] || die "${ENV_FILE} nao encontrado"
POSTGRES_USER="$(get_env POSTGRES_USER)"
POSTGRES_USER="${POSTGRES_USER:-rocker_prod}"

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_dir="${BACKUP_ROOT}/${timestamp}"

mkdir -p "${backup_dir}"
chmod 700 "${BACKUP_ROOT}" "${backup_dir}"

"${COMPOSE[@]}" exec -T postgres pg_dump -U "${POSTGRES_USER}" -Fc usuarios_db > "${backup_dir}/usuarios_db.dump"
"${COMPOSE[@]}" exec -T postgres pg_dump -U "${POSTGRES_USER}" -Fc gerenciador_db > "${backup_dir}/gerenciador_db.dump"

if [ -d uploads ]; then
  tar -czf "${backup_dir}/uploads.tar.gz" uploads/
else
  echo "uploads/ nao existe neste ambiente" > "${backup_dir}/uploads.NOT_FOUND.txt"
fi

sha256sum "${backup_dir}"/* > "${backup_dir}/SHA256SUMS"
find "${BACKUP_ROOT}" -mindepth 1 -maxdepth 1 -type d -mtime +"${RETENTION_DAYS}" -exec rm -rf {} +

echo "Backup criado em ${backup_dir}"
echo "Copie este diretorio para storage externo seguro."
