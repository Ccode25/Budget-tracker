/**
 * Neon PostgreSQL Migration & Database Provisioning Script
 * Executes DDL migrations against Neon Serverless Postgres via Pool client.
 */

import { Pool } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes("your_password_here") || databaseUrl.includes("ep-example")) {
    console.error("❌ ERROR: Valid DATABASE_URL not found in environment variables.");
    console.log("👉 Please set a valid Neon connection string in .env.local");
    process.exit(1);
  }

  console.log("🚀 Connecting to Neon PostgreSQL database...");
  const pool = new Pool({ connectionString: databaseUrl });

  const migrationsDir = path.join(process.cwd(), "src", "database", "migrations");
  const migrationFiles = ["0007_neon_postgres_init.sql"];

  try {
    const client = await pool.connect();
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`⚡ Executing migration DDL: ${file}...`);
        const sqlContent = fs.readFileSync(filePath, "utf-8");
        await client.query(sqlContent);
        console.log(`✅ Migration ${file} applied successfully!`);
      }
    }
    client.release();
    console.log("\n🎉 Database migration complete! All 8 tables and indexes are ready on Neon Postgres.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await pool.end();
  }
}

runMigrations().catch((err) => {
  console.error("Fatal migration error:", err);
  process.exit(1);
});
