-- Create boards table
CREATE TABLE IF NOT EXISTS boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create threads table
CREATE TABLE IF NOT EXISTS threads (
    id SERIAL PRIMARY KEY,
    board VARCHAR(10) NOT NULL,
    name VARCHAR(50) DEFAULT 'Anonymous',
    title VARCHAR(100),
    content TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bumped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reply_count INTEGER DEFAULT 0
);

-- Create replies table
CREATE TABLE IF NOT EXISTS replies (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER REFERENCES threads(id) ON DELETE CASCADE,
    name VARCHAR(50) DEFAULT 'Anonymous',
    content TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default boards
INSERT INTO boards (name, description) VALUES
    ('b', 'Random'),
    ('g', 'Technology'),
    ('a', 'Anime'),
    ('v', 'Video Games')
ON CONFLICT (name) DO NOTHING;

-- Create index for faster thread listing
CREATE INDEX IF NOT EXISTS idx_threads_board ON threads(board);
CREATE INDEX IF NOT EXISTS idx_threads_bumped_at ON threads(bumped_at DESC);
CREATE INDEX IF NOT EXISTS idx_replies_thread_id ON replies(thread_id); 