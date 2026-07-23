-- Migration 0002: Create Categories Table
-- Description: Transaction categories and taxonomy schema.

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#7c3aed',
    icon TEXT NOT NULL DEFAULT 'Tag',
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer', 'both')),
    is_default BOOLEAN NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);
