-- Migration 0006: Performance Indexes
-- Description: Indexes for foreign keys, UUIDs, dates, lookup tokens, and soft delete state.

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
