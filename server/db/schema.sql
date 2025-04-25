-- Create tables for the image board

-- Boards table
CREATE TABLE IF NOT EXISTS boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Threads table
CREATE TABLE IF NOT EXISTS threads (
    id SERIAL PRIMARY KEY,
    board VARCHAR(10) NOT NULL REFERENCES boards(name) ON DELETE CASCADE,
    name VARCHAR(50) DEFAULT 'Anonymous',
    title VARCHAR(200),
    content TEXT NOT NULL,
    image_url TEXT,
    tripcode JSONB,
    password_hash TEXT,
    sage BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    bumped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reply_count INTEGER DEFAULT 0
);

-- Replies table
CREATE TABLE IF NOT EXISTS replies (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
    name VARCHAR(50) DEFAULT 'Anonymous',
    content TEXT NOT NULL,
    image_url TEXT,
    tripcode JSONB,
    password_hash TEXT,
    sage BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_threads_board ON threads(board);
CREATE INDEX IF NOT EXISTS idx_threads_bumped_at ON threads(bumped_at);
CREATE INDEX IF NOT EXISTS idx_replies_thread_id ON replies(thread_id);

-- Insert default boards
INSERT INTO boards (name, title, description) VALUES
    ('b', 'Random', 'The place for random discussion'),
    ('g', 'Technology', 'Technology and gadgets'),
    ('a', 'Anime', 'Anime and manga discussion'),
    ('v', 'Video Games', 'Video games discussion'),
    ('pol', 'Politics', 'Political discussions'),
    ('sci', 'Science', 'Science and math discussions')
ON CONFLICT (name) DO NOTHING; 