-- Migration 0007: Neon PostgreSQL Schema Initialization
-- Description: PostgreSQL compatible DDLs for Neon Serverless Postgres.

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(255) PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('checking', 'savings', 'credit_card', 'investment', 'cash')),
    balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'PHP',
    account_number_masked VARCHAR(50),
    color VARCHAR(50) DEFAULT '#7c3aed',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(255) PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50) NOT NULL DEFAULT '#7c3aed',
    icon VARCHAR(100) NOT NULL DEFAULT 'Tag',
    type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense', 'transfer', 'both')),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 4. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(255) PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id VARCHAR(255) REFERENCES accounts(id) ON DELETE SET NULL,
    category_id VARCHAR(255) NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    date VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
    type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('completed', 'pending', 'failed')),
    notes TEXT,
    tags JSONB,
    merchant VARCHAR(255),
    imported_from VARCHAR(255),
    is_imported BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 5. Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
    id VARCHAR(255) PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    period VARCHAR(50) NOT NULL CHECK (period IN ('monthly', 'annual', 'weekly', 'custom')),
    start_date VARCHAR(50) NOT NULL,
    end_date VARCHAR(50) NOT NULL,
    categories JSONB NOT NULL,
    total_limit NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_limit >= 0),
    total_spent NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_spent >= 0),
    color VARCHAR(50) NOT NULL DEFAULT '#7c3aed',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 6. Goals Table
CREATE TABLE IF NOT EXISTS goals (
    id VARCHAR(255) PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_amount NUMERIC(14, 2) NOT NULL CHECK (target_amount >= 0),
    saved_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (saved_amount >= 0),
    deadline VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL DEFAULT '#10b981',
    icon VARCHAR(100) DEFAULT 'Target',
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 7. Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id VARCHAR(255) PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(255) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    currency VARCHAR(10) NOT NULL DEFAULT 'PHP',
    currency_symbol VARCHAR(10) NOT NULL DEFAULT '₱',
    language VARCHAR(20) NOT NULL DEFAULT 'en-PH',
    date_format VARCHAR(50) NOT NULL DEFAULT 'MM/dd/yyyy',
    number_format VARCHAR(20) NOT NULL CHECK (number_format IN ('comma', 'period')),
    import_preferences JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 8. Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance and lookup
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
