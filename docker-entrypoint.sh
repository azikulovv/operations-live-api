#!/bin/sh
set -e

case "$DATABASE_URL" in
  file:*)
    DB_FILE=${DATABASE_URL#file:}
    mkdir -p "$(dirname "$DB_FILE")"
    touch "$DB_FILE"
    ;;
esac

npx prisma migrate deploy

exec "$@"
