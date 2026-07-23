/**
 * Database Configuration for Neon PostgreSQL
 * Centralized settings for Neon serverless database connection.
 */

export const dbConfig = {
  // Neon PostgreSQL connection string (from process.env.DATABASE_URL)
  dbUrl: process.env.DATABASE_URL || "",
  
  // Neon pool / connection configuration
  ssl: true,
  maxConnections: Number(process.env.DB_MAX_CONNECTIONS || 10),
  
  // Logging settings
  logging: process.env.NODE_ENV !== "production",
  
  // Table prefix
  tablePrefix: "bt_",
};
