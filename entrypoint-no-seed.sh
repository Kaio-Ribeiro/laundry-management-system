#!/bin/sh

cd /app

echo "Starting application with database migration only..."

# Run migrations to ensure database schema is up to date
echo "Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Start the application
echo "Starting the application..."
exec node server.js