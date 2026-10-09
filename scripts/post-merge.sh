#!/bin/bash
set -e
pnpm install --frozen-lockfile

# Only push schema changes when explicitly requested.
# Running drizzle-kit push unconditionally can be destructive in production.
if [ "${ALLOW_DB_PUSH}" = "true" ]; then
  pnpm --filter db push
else
  echo "Skipping db push (set ALLOW_DB_PUSH=true to enable)"
fi
