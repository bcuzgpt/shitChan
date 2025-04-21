#!/bin/bash

# Exit on error
set -e

# Configuration
BACKUP_DIR="/var/backups/shitchan"
DB_NAME="shitchan"
DB_USER="your_db_user"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/shitchan_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
echo "Creating database backup..."
pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

# Compress backup
echo "Compressing backup..."
gzip $BACKUP_FILE

# Remove backups older than 30 days
echo "Cleaning up old backups..."
find $BACKUP_DIR -name "shitchan_*.sql.gz" -mtime +30 -delete

echo "Backup completed successfully!" 