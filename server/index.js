require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const { sanitizeInput, validateFileUpload, generateSecureFilename } = require('./middleware/security');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:", "https://*.amazonaws.com"],
      connectSrc: ["'self'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json());
app.use(sanitizeInput);

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// AWS S3 setup
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE)
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(',');
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Routes
app.get('/api/boards', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM boards');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/boards/:board/threads', async (req, res) => {
  try {
    const { board } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM threads WHERE board = $1',
      [board]
    );
    const total = parseInt(countResult.rows[0].count);

    // Get threads
    const result = await pool.query(
      'SELECT * FROM threads WHERE board = $1 ORDER BY bumped_at DESC LIMIT $2 OFFSET $3',
      [board, limit, offset]
    );

    res.json({
      threads: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/boards/:board/threads', upload.single('image'), async (req, res) => {
  try {
    const { board } = req.params;
    const { title, content } = req.body;
    let imageUrl = null;

    if (req.file) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${Date.now()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const uploaded = await s3.upload(params).promise();
      imageUrl = uploaded.Location;
    }

    const result = await pool.query(
      'INSERT INTO threads (board, title, content, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [board, title, content, imageUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get thread details with replies
app.get('/api/threads/:threadId', async (req, res) => {
  try {
    const { threadId } = req.params;
    const threadResult = await pool.query(
      'SELECT * FROM threads WHERE id = $1',
      [threadId]
    );

    if (threadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const repliesResult = await pool.query(
      'SELECT * FROM replies WHERE thread_id = $1 ORDER BY created_at ASC',
      [threadId]
    );

    const thread = {
      ...threadResult.rows[0],
      replies: repliesResult.rows,
    };

    res.json(thread);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a reply
app.post('/api/threads/:threadId/replies', upload.single('image'), async (req, res) => {
  try {
    const { threadId } = req.params;
    const { content } = req.body;
    let imageUrl = null;

    // Check if thread exists
    const threadResult = await pool.query(
      'SELECT * FROM threads WHERE id = $1',
      [threadId]
    );

    if (threadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    if (req.file) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${Date.now()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const uploaded = await s3.upload(params).promise();
      imageUrl = uploaded.Location;
    }

    // Insert reply
    const replyResult = await pool.query(
      'INSERT INTO replies (thread_id, content, image_url) VALUES ($1, $2, $3) RETURNING *',
      [threadId, content, imageUrl]
    );

    // Update thread's bumped_at and reply_count
    await pool.query(
      'UPDATE threads SET bumped_at = CURRENT_TIMESTAMP, reply_count = reply_count + 1 WHERE id = $1',
      [threadId]
    );

    res.status(201).json(replyResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a thread
app.delete('/api/threads/:threadId', async (req, res) => {
  try {
    const { threadId } = req.params;

    // Check if thread exists
    const threadResult = await pool.query(
      'SELECT * FROM threads WHERE id = $1',
      [threadId]
    );

    if (threadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    // Delete thread and its replies
    await pool.query('DELETE FROM replies WHERE thread_id = $1', [threadId]);
    await pool.query('DELETE FROM threads WHERE id = $1', [threadId]);

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// For error tracking in serverless environment
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
};

// Apply error handler middleware
app.use(errorHandler);

// For Vercel serverless environment
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export for serverless functions
module.exports = app; 