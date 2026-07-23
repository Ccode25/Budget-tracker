-- Initial Migration: Comprehensive BudgetTracker Database Schema
-- Incorporating: id, uuid, created_at, updated_at, deleted_at, FK constraints, and indexes.

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- 2. Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'credit_card', 'investment', 'cash')),
    balance REAL NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'PHP',
    account_number_masked TEXT,
    color TEXT DEFAULT '#7c3aed',
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- 3. Categories Table
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

-- 4. Transactions Table
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

-- 5. Budgets Table
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

-- 6. Goals Table
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

-- 7. Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    currency TEXT NOT NULL DEFAULT 'PHP',
    currency_symbol TEXT NOT NULL DEFAULT '₱',
    language TEXT NOT NULL DEFAULT 'en-PH',
    date_format TEXT NOT NULL DEFAULT 'MM/dd/yyyy',
    number_format TEXT NOT NULL CHECK (number_format IN ('comma', 'period')),
    import_preferences TEXT NOT NULL, -- JSON string
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- 8. Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    user_agent TEXT,
    ip_address TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance and quick query lookup
CREATE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE INDEX IF NOT EXISTS idx_accounts_uuid ON accounts(uuid);
CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_deleted ON accounts(deleted_at);

CREATE INDEX IF NOT EXISTS idx_categories_uuid ON categories(uuid);
CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_uuid ON transactions(uuid);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_deleted ON transactions(deleted_at);

CREATE INDEX IF NOT EXISTS idx_budgets_uuid ON budgets(uuid);
CREATE INDEX IF NOT EXISTS idx_budgets_user ON budgets(user_id);

CREATE INDEX IF NOT EXISTS idx_goals_uuid ON goals(uuid);
CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);

CREATE INDEX IF NOT EXISTS idx_settings_uuid ON settings(uuid);
CREATE INDEX IF NOT EXISTS idx_settings_user ON settings(user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_uuid ON sessions(uuid);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
