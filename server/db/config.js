const { Pool } = require('pg');
const { neonConfig } = require('@neondatabase/serverless');

// Configure Neon for serverless environment
neonConfig.fetchConnectionCache = true;
neonConfig.webSocketConstructor = require('ws');

// Optimized Neon PostgreSQL connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Connection pool settings optimized for serverless
  max: 1,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
});

// Connection event handlers
pool.on('connect', () => {
  console.log('Connected to Neon PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = pool; 