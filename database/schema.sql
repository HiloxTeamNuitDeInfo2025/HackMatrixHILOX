-- XSSHILOX Database Schema
-- SQLite Database for XSS CTF Platform

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    current_step INTEGER DEFAULT 1,
    total_score INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Flags table (captured flags)
CREATE TABLE IF NOT EXISTS captured_flags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    flag_text TEXT NOT NULL,
    step_number INTEGER NOT NULL,
    points_earned INTEGER NOT NULL,
    captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Leaderboard view
CREATE VIEW IF NOT EXISTS leaderboard AS
SELECT 
    u.username,
    p.total_score,
    p.current_step,
    COUNT(cf.id) as flags_captured,
    p.completed,
    MAX(cf.captured_at) as last_flag_time
FROM users u
LEFT JOIN progress p ON u.id = p.user_id
LEFT JOIN captured_flags cf ON u.id = cf.user_id
GROUP BY u.id
ORDER BY p.total_score DESC, last_flag_time ASC;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_flags_user ON captured_flags(user_id);
CREATE INDEX IF NOT EXISTS idx_flags_step ON captured_flags(step_number);
