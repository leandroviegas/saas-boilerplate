#!/bin/sh
set -e

echo "Checking database connectivity..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed

echo "Starting application..."
exec node dist/server.js