/**
 * Neon Database Client Provider
 * Manages Neon Serverless Postgres SQL connections and health checks.
 */

import { neon, neonConfig, Pool } from "@neondatabase/serverless";
import { dbConfig } from "@/config/db";

// Enable fetch connection pooling for serverless environments
neonConfig.fetchConnectionCache = true;

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

  private getSql() {
    if (!dbConfig.dbUrl) {
      throw new Error("DATABASE_URL is not defined in environment variables.");
    }
    return neon(dbConfig.dbUrl);
  }

  async connect(): Promise<void> {
    try {
      if (dbConfig.dbUrl) {
        this.pool = new Pool({ connectionString: dbConfig.dbUrl });
        this.isReady = true;
        if (dbConfig.logging) {
          console.log("[Neon DB Client] Connected to Neon Serverless Postgres.");
        }
      } else {
        console.warn("[Neon DB Client] Warning: DATABASE_URL environment variable is missing.");
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
      const sql = this.getSql();
      const result = await sql(sqlQuery, params);
      return result as T[];
    } catch (err) {
      console.error("[Neon DB Client Query Error]", err);
      throw err;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!dbConfig.dbUrl) return false;
      const sql = this.getSql();
      const res = await sql`SELECT 1 as alive`;
      return Array.isArray(res) && res.length > 0;
    } catch {
      return false;
    }
  }
}

export const dbClient = new NeonDatabaseClient();
