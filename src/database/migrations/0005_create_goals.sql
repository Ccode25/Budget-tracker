-- Migration 0005: Create Goals Table
-- Description: Financial savings goals and progress targets.

CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount REAL NOT NULL CHECK (target_amount >= 0),
    saved_amount REAL NOT NULL DEFAULT 0 CHECK (saved_amount >= 0),
    deadline TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#10b981',
    icon TEXT DEFAULT 'Target',
    is_completed BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);
