-- Migration 0004: Create Budgets Table
-- Description: Spending limits and category budget allocations.

CREATE TABLE IF NOT EXISTS budgets (
    id TEXT PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    period TEXT NOT NULL CHECK (period IN ('monthly', 'annual', 'weekly', 'custom')),
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    categories TEXT NOT NULL, -- JSON string
    total_limit REAL NOT NULL DEFAULT 0 CHECK (total_limit >= 0),
    total_spent REAL NOT NULL DEFAULT 0 CHECK (total_spent >= 0),
    color TEXT NOT NULL DEFAULT '#7c3aed',
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);
