#!/bin/sh

cd /app

# Initialize database if it doesn't exist
if [ ! -f "/app/prisma/dev.db" ]; then
  echo "Database not found, running initial migration..."
  npx prisma migrate deploy
  echo "Running database seed..."
  npx prisma db seed
else
  echo "Database found, checking for pending migrations..."
  npx prisma migrate deploy
fi

# Generate Prisma client (in case it's needed)
npx prisma generate

# Start the application
echo "Starting the application..."
exec node server.js