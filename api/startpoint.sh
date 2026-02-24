#!/bin/sh
set -e

echo "Migrating database..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed

echo "Starting application..."
exec node dist/server.js
