require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const pool = require('./db/config');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads with optimized settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
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

// Helper functions
const generateTripcode = (tripcode) => {
  if (!tripcode) return null;
  
  let name = null;
  let trip = tripcode;
  
  if (tripcode.includes('#')) {
    const parts = tripcode.split('#');
    name = parts[0];
    trip = parts[1];
  }
  
  const hash = crypto.createHash('sha256').update(trip).digest('hex').substring(0, 10);
  return { name, tripcode: hash };
};

const hashPassword = (password) => {
  if (!password) return null;
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
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

app.use(express.static(path.join(__dirname, '../client/build')));

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
    const { name, subject, comment, tripcode, password, sage } = req.body;
    
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const tripcodeData = tripcode ? generateTripcode(tripcode) : null;
    const passwordHash = password ? hashPassword(password) : null;

    const result = await pool.query(
      'INSERT INTO threads (board, name, title, content, image_url, tripcode, password_hash, sage) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [board, name || 'Anonymous', subject, comment, imageUrl, tripcodeData ? JSON.stringify(tripcodeData) : null, passwordHash, sage === 'true']
    );

    const thread = result.rows[0];
    delete thread.password_hash;
    res.status(201).json(thread);
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
    const { name, comment, tripcode, password, sage } = req.body;
    
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const tripcodeData = tripcode ? generateTripcode(tripcode) : null;
    const passwordHash = password ? hashPassword(password) : null;

    const replyResult = await pool.query(
      'INSERT INTO replies (thread_id, name, content, image_url, tripcode, password_hash, sage) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [threadId, name || 'Anonymous', comment, imageUrl, tripcodeData ? JSON.stringify(tripcodeData) : null, passwordHash, sage === 'true']
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

    const reply = replyResult.rows[0];
    delete reply.password_hash;
    res.status(201).json(reply);
  } catch (err) {
    console.error('Error creating reply:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/threads/:threadId/delete', async (req, res) => {
  try {
    const { threadId } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required for deletion' });
    }
    
    const passwordHash = hashPassword(password);
    const threadResult = await pool.query(
      'SELECT * FROM threads WHERE id = $1 AND password_hash = $2',
      [threadId, passwordHash]
    );
    
    if (threadResult.rows.length === 0) {
      return res.status(403).json({ error: 'Invalid password or thread not found' });
    }
    
    await Promise.all([
      pool.query('DELETE FROM replies WHERE thread_id = $1', [threadId]),
      pool.query('DELETE FROM threads WHERE id = $1', [threadId])
    ]);
    
    res.json({ success: true, message: 'Thread deleted successfully' });
  } catch (err) {
    console.error('Error deleting thread:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/replies/:replyId/delete', async (req, res) => {
  try {
    const { replyId } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required for deletion' });
    }
    
    const passwordHash = hashPassword(password);
    const replyResult = await pool.query(
      'SELECT * FROM replies WHERE id = $1 AND password_hash = $2',
      [replyId, passwordHash]
    );
    
    if (replyResult.rows.length === 0) {
      return res.status(403).json({ error: 'Invalid password or reply not found' });
    }
    
    const threadId = replyResult.rows[0].thread_id;
    await Promise.all([
      pool.query('DELETE FROM replies WHERE id = $1', [replyId]),
      pool.query('UPDATE threads SET reply_count = reply_count - 1 WHERE id = $1', [threadId])
    ]);
    
    res.json({ success: true, message: 'Reply deleted successfully' });
  } catch (err) {
    console.error('Error deleting reply:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

module.exports = app; 