const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all boards
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM boards');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get threads from a specific board
router.get('/:boardName/threads', async (req, res) => {
  try {
    const { boardName } = req.params;
    
    // Validate the board exists
    const boardResult = await pool.query(
      'SELECT id FROM boards WHERE name = $1',
      [boardName]
    );
    
    if (boardResult.rows.length === 0) {
      return res.status(404).json({ error: 'Board not found' });
    }
    
    const boardId = boardResult.rows[0].id;
    
    // Get threads with their reply count
    const { rows } = await pool.query(
      `SELECT t.id, t.subject, t.name, t.comment, t.created_at, t.image_url,
       COUNT(r.id) as reply_count
       FROM threads t
       LEFT JOIN replies r ON t.id = r.thread_id
       WHERE t.board_id = $1
       GROUP BY t.id
       ORDER BY t.created_at DESC
       LIMIT 20`,
      [boardId]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching threads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific thread with its replies
router.get('/:boardName/threads/:threadId', async (req, res) => {
  try {
    const { boardName, threadId } = req.params;
    
    // Validate the board exists
    const boardResult = await pool.query(
      'SELECT id FROM boards WHERE name = $1',
      [boardName]
    );
    
    if (boardResult.rows.length === 0) {
      return res.status(404).json({ error: 'Board not found' });
    }
    
    // Get thread details
    const threadResult = await pool.query(
      `SELECT t.id, t.subject, t.name, t.comment, t.created_at, t.image_url
       FROM threads t
       WHERE t.id = $1`,
      [threadId]
    );
    
    if (threadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    
    // Get thread replies
    const repliesResult = await pool.query(
      `SELECT id, name, comment, created_at, image_url
       FROM replies
       WHERE thread_id = $1
       ORDER BY created_at ASC`,
      [threadId]
    );
    
    const thread = threadResult.rows[0];
    thread.replies = repliesResult.rows;
    
    res.json(thread);
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new thread
router.post('/:boardName/threads', upload.single('image'), async (req, res) => {
  try {
    const { boardName } = req.params;
    const { subject, name, comment } = req.body;
    
    // Validate required fields
    if (!comment) {
      return res.status(400).json({ error: 'Comment is required' });
    }
    
    // Validate the board exists
    const boardResult = await pool.query(
      'SELECT id FROM boards WHERE name = $1',
      [boardName]
    );
    
    if (boardResult.rows.length === 0) {
      return res.status(404).json({ error: 'Board not found' });
    }
    
    const boardId = boardResult.rows[0].id;
    
    // Handle image if uploaded
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    
    // Create thread
    const { rows } = await pool.query(
      `INSERT INTO threads (board_id, subject, name, comment, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, subject, name, comment, created_at, image_url`,
      [boardId, subject || null, name || 'Anonymous', comment, imageUrl]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a reply to a thread
router.post('/:boardName/threads/:threadId/replies', upload.single('image'), async (req, res) => {
  try {
    const { threadId } = req.params;
    const { name, comment } = req.body;
    
    // Validate required fields
    if (!comment) {
      return res.status(400).json({ error: 'Comment is required' });
    }
    
    // Check if thread exists
    const threadResult = await pool.query(
      'SELECT id FROM threads WHERE id = $1',
      [threadId]
    );
    
    if (threadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    
    // Handle image if uploaded
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    
    // Create reply
    const { rows } = await pool.query(
      `INSERT INTO replies (thread_id, name, comment, image_url)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, comment, created_at, image_url`,
      [threadId, name || 'Anonymous', comment, imageUrl]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 