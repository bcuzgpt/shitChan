/**
 * Database Backup Script
 * 
 * Run this script to create a backup of the database
 * Schedule with cron for regular backups
 */

require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const DATABASE_NAME = process.env.DB_NAME || 'shitchan';
const DATABASE_USER = process.env.DB_USER || 'postgres';
const MAX_BACKUPS = 10; // Keep only the 10 most recent backups

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log(`Created backup directory: ${BACKUP_DIR}`);
}

// Generate backup filename with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(BACKUP_DIR, `${DATABASE_NAME}_${timestamp}.sql`);

// Execute pg_dump command
const pgDumpCommand = `pg_dump -U ${DATABASE_USER} -d ${DATABASE_NAME} -f ${backupFile}`;

console.log(`Starting database backup to ${backupFile}`);
exec(pgDumpCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error during backup: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`pg_dump stderr: ${stderr}`);
    return;
  }
  
  console.log(`Backup completed successfully`);
  
  // Clean up old backups
  cleanupOldBackups();
});

// Function to remove older backups
function cleanupOldBackups() {
  fs.readdir(BACKUP_DIR, (err, files) => {
    if (err) {
      console.error(`Error reading backup directory: ${err.message}`);
      return;
    }
    
    // Filter SQL backup files
    const backups = files
      .filter(file => file.endsWith('.sql'))
      .map(file => ({
        name: file,
        path: path.join(BACKUP_DIR, file),
        time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time); // Sort by timestamp (newest first)
    
    // Keep only the MAX_BACKUPS most recent backups
    if (backups.length > MAX_BACKUPS) {
      const backupsToDelete = backups.slice(MAX_BACKUPS);
      
      backupsToDelete.forEach(backup => {
        fs.unlink(backup.path, err => {
          if (err) {
            console.error(`Error deleting old backup ${backup.name}: ${err.message}`);
          } else {
            console.log(`Deleted old backup: ${backup.name}`);
          }
        });
      });
    }
  });
} 