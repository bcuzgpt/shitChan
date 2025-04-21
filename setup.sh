#!/bin/bash

# Install server dependencies
echo "Installing server dependencies..."
npm install

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cp .env.example .env
fi

# Create PostgreSQL database
echo "Creating PostgreSQL database..."
createdb shitchan || true

# Run database migrations
echo "Running database migrations..."
node server/db/migrate.js

# Start development servers
echo "Starting development servers..."
npm run dev 