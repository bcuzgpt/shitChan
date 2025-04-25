require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory data store
const db = {
  boards: [
    { id: 1, name: 'b', description: 'Random' },
    { id: 2, name: 'g', description: 'Technology' },
    { id: 3, name: 'a', description: 'Anime & Manga' },
    { id: 4, name: 'v', description: 'Video Games' },
  ],
  threads: [
    {
      id: 1,
      board: 'b',
      title: 'Welcome to shitChan',
      content: 'This is a sample thread in the random board.',
      image_url: 'https://via.placeholder.com/250',
      created_at: new Date().toISOString(),
      bumped_at: new Date().toISOString(),
      reply_count: 2,
      name: 'Anonymous'
    },
    {
      id: 2,
      board: 'g',
      title: 'Technology Thread',
      content: 'Discuss latest tech news here.',
      image_url: 'https://via.placeholder.com/250',
      created_at: new Date().toISOString(),
      bumped_at: new Date().toISOString(),
      reply_count: 1,
      name: 'Anonymous'
    }
  ],
  replies: [
    {
      id: 1,
      thread_id: 1,
      content: 'First reply to welcome thread',
      created_at: new Date().toISOString(),
      image_url: null,
      name: 'Anonymous'
    },
    {
      id: 2,
      thread_id: 1,
      content: 'Second reply to welcome thread',
      created_at: new Date().toISOString(),
      image_url: 'https://via.placeholder.com/150',
      name: 'Anonymous'
    },
    {
      id: 3,
      thread_id: 2,
      content: 'Reply to tech thread',
      created_at: new Date().toISOString(),
      image_url: null,
      name: 'Anonymous'
    }
  ]
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
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
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/api/boards', (req, res) => {
  res.json(db.boards);
});

app.get('/api/boards/:board/threads', (req, res) => {
  const { board } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // Filter threads by board
  const filteredThreads = db.threads
    .filter(thread => thread.board === board)
    .sort((a, b) => new Date(b.bumped_at).getTime() - new Date(a.bumped_at).getTime());
  
  // Calculate pagination
  const total = filteredThreads.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  // Get paginated threads
  const threads = filteredThreads.slice(startIndex, endIndex);
  
  res.json({
    threads,
    pagination: {
      total,
      page,
      limit,
      totalPages
    }
  });
});

app.get('/api/threads/:threadId', (req, res) => {
  const { threadId } = req.params;
  const thread = db.threads.find(t => t.id === parseInt(threadId));
  
  if (!thread) {
    return res.status(404).json({ error: 'Thread not found' });
  }
  
  // Get thread replies
  const replies = db.replies
    .filter(reply => reply.thread_id === parseInt(threadId))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  
  res.json({
    ...thread,
    replies
  });
});

app.post('/api/boards/:board/threads', upload.single('image'), (req, res) => {
  const { board } = req.params;
  const { name, subject, comment } = req.body;
  
  // Check if board exists
  const boardExists = db.boards.some(b => b.name === board);
  if (!boardExists) {
    return res.status(404).json({ error: 'Board not found' });
  }
  
  // Create new thread
  const newThread = {
    id: db.threads.length + 1,
    board,
    title: subject || 'No Subject',
    content: comment,
    image_url: req.file ? `/uploads/${req.file.filename}` : null,
    created_at: new Date().toISOString(),
    bumped_at: new Date().toISOString(),
    reply_count: 0,
    name: name || 'Anonymous'
  };
  
  db.threads.push(newThread);
  
  res.status(201).json(newThread);
});

app.post('/api/threads/:threadId/replies', upload.single('image'), (req, res) => {
  const { threadId } = req.params;
  const { name, comment } = req.body;
  
  // Check if thread exists
  const threadIndex = db.threads.findIndex(t => t.id === parseInt(threadId));
  if (threadIndex === -1) {
    return res.status(404).json({ error: 'Thread not found' });
  }
  
  // Create new reply
  const newReply = {
    id: db.replies.length + 1,
    thread_id: parseInt(threadId),
    content: comment,
    image_url: req.file ? `/uploads/${req.file.filename}` : null,
    created_at: new Date().toISOString(),
    name: name || 'Anonymous'
  };
  
  db.replies.push(newReply);
  
  // Update thread
  db.threads[threadIndex].reply_count += 1;
  db.threads[threadIndex].bumped_at = new Date().toISOString();
  
  res.status(201).json(newReply);
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
}); 