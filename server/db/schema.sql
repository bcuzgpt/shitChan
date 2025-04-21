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
    board VARCHAR(50) REFERENCES boards(name),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bumped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reply_count INTEGER DEFAULT 0
);

-- Create replies table
CREATE TABLE IF NOT EXISTS replies (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER REFERENCES threads(id),
    content TEXT NOT NULL,
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