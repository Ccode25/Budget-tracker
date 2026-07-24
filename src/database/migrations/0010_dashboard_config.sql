-- Migration 0010: Dashboard Config Table Creation
-- Description: DDL for dashboard configuration table in Neon PostgreSQL.

CREATE TABLE IF NOT EXISTS dashboard_config (
    id VARCHAR(255) PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(255) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    layout JSONB NOT NULL DEFAULT '{"columns": 2, "layout": "default"}',
    widgets JSONB NOT NULL DEFAULT '["budgetOverview", "recentTransactions", "goals", "categories"]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dashboard_config_uuid ON dashboard_config(uuid);
CREATE INDEX IF NOT EXISTS idx_dashboard_config_user ON dashboard_config(user_id);
