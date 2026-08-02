#!/usr/bin/env bash
set -euo pipefail

COMPOSE=(docker compose -f docker-compose.yml -f docker-compose.prod.yml)
ENV_FILE="${ENV_FILE:-.env}"
BACKUP_DIR="${1:-}"
RESTORE_CONFIRM="${RESTORE_CONFIRM:-}"

die() {
  echo "ERRO: $*" >&2
  exit 1
}

get_env() {
  local key="$1"
  grep -E "^${key}=" "${ENV_FILE}" | tail -n 1 | cut -d= -f2-
}

[ -n "${BACKUP_DIR}" ] || die "uso: RESTORE_CONFIRM=YES bash deploy/scripts/restore-prod.sh /caminho/backup"
[ "${RESTORE_CONFIRM}" = "YES" ] || die "restauracao bloqueada. Defina RESTORE_CONFIRM=YES para confirmar sobrescrita."
[ -f "${ENV_FILE}" ] || die "${ENV_FILE} nao encontrado"
[ -f "${BACKUP_DIR}/usuarios_db.dump" ] || die "usuarios_db.dump nao encontrado"
[ -f "${BACKUP_DIR}/gerenciador_db.dump" ] || die "gerenciador_db.dump nao encontrado"

POSTGRES_USER="$(get_env POSTGRES_USER)"
POSTGRES_USER="${POSTGRES_USER:-rocker_prod}"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"

echo "Restauracao destrutiva confirmada. Criando backup preventivo antes de continuar."
bash deploy/scripts/backup-prod.sh

"${COMPOSE[@]}" stop frontend bff-pilates usuarios-service gerenciador-service

"${COMPOSE[@]}" exec -T postgres pg_restore -U "${POSTGRES_USER}" -d usuarios_db --clean --if-exists --no-owner < "${BACKUP_DIR}/usuarios_db.dump"
"${COMPOSE[@]}" exec -T postgres pg_restore -U "${POSTGRES_USER}" -d gerenciador_db --clean --if-exists --no-owner < "${BACKUP_DIR}/gerenciador_db.dump"

if [ -f "${BACKUP_DIR}/uploads.tar.gz" ]; then
  if [ -d uploads ]; then
    mv uploads "uploads.before-restore-${timestamp}"
  fi
  tar -xzf "${BACKUP_DIR}/uploads.tar.gz"
fi

"${COMPOSE[@]}" up -d
echo "Restauracao concluida. Valide login, CMS, depoimentos e midias."
