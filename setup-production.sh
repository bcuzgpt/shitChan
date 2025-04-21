#!/bin/bash

# Exit on error
set -e

echo "Setting up shitChan production environment..."

# Install dependencies
echo "Installing server dependencies..."
cd server
npm install --production
cd ..

echo "Installing client dependencies..."
cd client
npm install --production
npm run build
cd ..

# Create uploads directory with proper permissions
echo "Creating uploads directory..."
mkdir -p server/uploads
chmod 755 server/uploads

# Set up environment variables
if [ ! -f .env ]; then
  echo "Creating .env file from .env.example..."
  cp .env.example .env
  echo "Please edit .env with your production values"
fi

# Set up database
echo "Setting up database..."
createdb shitchan || true
node server/db/migrate.js

# Set proper permissions
echo "Setting file permissions..."
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
chmod 755 setup-production.sh

echo "Production setup complete!"
echo "Please ensure you have:"
echo "1. Set up a reverse proxy (nginx/apache)"
echo "2. Configured SSL certificates"
echo "3. Set up proper firewall rules"
echo "4. Configured proper database backups"
echo "5. Set up monitoring and logging" 