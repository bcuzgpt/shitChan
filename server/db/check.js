require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkDatabase() {
  try {
    // Check tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in database:', tables.rows.map(r => r.table_name));

    // Check boards
    const boards = await pool.query('SELECT * FROM boards');
    console.log('\nBoards:', boards.rows);

    // Check threads
    const threads = await pool.query('SELECT * FROM threads');
    console.log('\nThreads:', threads.rows);

    // Check replies
    const replies = await pool.query('SELECT * FROM replies');
    console.log('\nReplies:', replies.rows);

  } catch (err) {
    console.error('Error checking database:', err);
  } finally {
    await pool.end();
  }
}

checkDatabase(); 