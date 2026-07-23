-- Migration 0003: Create Transactions Table
-- Description: Financial ledger and transaction records.

CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL CHECK (amount >= 0),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'failed')),
    notes TEXT,
    tags TEXT,
    merchant TEXT,
    imported_from TEXT,
    is_imported BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);
