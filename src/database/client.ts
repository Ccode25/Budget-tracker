/**
 * Neon Database Client Provider
 * Manages Neon Serverless Postgres SQL connections and health checks via Pool.
 */

import { Pool } from "@neondatabase/serverless";
import { dbConfig } from "../config/db";

export interface DatabaseClient {
  isReady: boolean;
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<boolean>;
}

class NeonDatabaseClient implements DatabaseClient {
  public isReady = false;
  private pool: Pool | null = null;

  private getPool(): Pool {
    if (!this.pool) {
      if (!dbConfig.dbUrl) {
        throw new Error("DATABASE_URL is not defined in environment variables.");
      }
      this.pool = new Pool({ connectionString: dbConfig.dbUrl });
    }
    return this.pool;
  }

  async connect(): Promise<void> {
    try {
      if (dbConfig.dbUrl) {
        this.getPool();
        this.isReady = true;
        if (dbConfig.logging) {
          console.log("[Neon DB Client] Connected to Neon Serverless Postgres via Pool.");
        }
      }
    } catch (err) {
      console.error("[Neon DB Client Error] Failed to connect to Neon Postgres:", err);
      this.isReady = false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
    this.isReady = false;
    if (dbConfig.logging) {
      console.log("[Neon DB Client] Disconnected from Neon Serverless Postgres.");
    }
  }

  async query<T = any>(sqlQuery: string, params: any[] = []): Promise<T[]> {
    if (!dbConfig.dbUrl) {
      if (dbConfig.logging) {
        console.warn("[Neon DB Client] No DATABASE_URL set. Query skipped.");
      }
      return [];
    }

    try {
      const pool = this.getPool();
      const result = await pool.query(sqlQuery, params);
      return result.rows as T[];
    } catch (err) {
      console.error("[Neon DB Client Query Error]", err);
      throw err;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!dbConfig.dbUrl) return false;
      const pool = this.getPool();
      const res = await pool.query("SELECT 1 as alive");
      return Array.isArray(res.rows) && res.rows.length > 0;
    } catch {
      return false;
    }
  }
}

export const dbClient = new NeonDatabaseClient();
