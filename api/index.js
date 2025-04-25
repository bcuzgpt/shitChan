require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../server/db/config');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads with optimized settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'server', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
    }
  }
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'server', 'uploads'), {
  setHeaders: (res, path) => {
    const ext = path.split('.').pop().toLowerCase();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };
    if (mimeTypes[ext]) {
      res.set('Content-Type', mimeTypes[ext]);
    }
  }
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api/boards/:board/threads', async (req, res) => {
  try {
    const { board } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [countResult, threadsResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM threads WHERE board = $1', [board]),
      pool.query(
        'SELECT t.*, t.board as board_name FROM threads t WHERE t.board = $1 ORDER BY t.bumped_at DESC LIMIT $2 OFFSET $3',
        [board, limit, offset]
      )
    ]);

    res.json({
      threads: threadsResult.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit
    });
  } catch (err) {
    console.error('Error fetching threads:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/boards/:board/threads', upload.single('image'), async (req, res) => {
  try {
    const { board } = req.params;
    const { name, subject, comment, sage } = req.body;
    
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      'INSERT INTO threads (board, name, title, content, image_url, sage) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [board, name || 'Anonymous', subject, comment, imageUrl, sage === 'true']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating thread:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/threads/:threadId', async (req, res) => {
  try {
    const { threadId } = req.params;
    
    const [threadResult, repliesResult] = await Promise.all([
      pool.query('SELECT t.*, t.board as board_name FROM threads t WHERE t.id = $1', [threadId]),
      pool.query('SELECT * FROM replies WHERE thread_id = $1 ORDER BY created_at ASC', [threadId])
    ]);

    if (threadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    res.json({
      ...threadResult.rows[0],
      replies: repliesResult.rows
    });
  } catch (err) {
    console.error('Error fetching thread:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/threads/:threadId/replies', upload.single('image'), async (req, res) => {
  try {
    const { threadId } = req.params;
    const { name, comment, sage } = req.body;
    
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const replyResult = await pool.query(
      'INSERT INTO replies (thread_id, name, content, image_url, sage) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [threadId, name || 'Anonymous', comment, imageUrl, sage === 'true']
    );

    if (sage !== 'true') {
      await pool.query(
        'UPDATE threads SET bumped_at = CURRENT_TIMESTAMP, reply_count = reply_count + 1 WHERE id = $1',
        [threadId]
      );
    } else {
      await pool.query(
        'UPDATE threads SET reply_count = reply_count + 1 WHERE id = $1',
        [threadId]
      );
    }

    res.status(201).json(replyResult.rows[0]);
  } catch (err) {
    console.error('Error creating reply:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle client-side routing - this should be the last route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// For Vercel
module.exports = app; 