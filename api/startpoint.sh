#!/bin/sh
set -e

echo "Migrating database..."
npx prisma migrate dev

echo "Starting application..."
exec node dist/server.js
