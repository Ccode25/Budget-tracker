/**
 * Session Repository
 * Encapsulates database operations for active user session management on Neon PostgreSQL.
 */

import type { SessionSchema } from "@/database/schema";
import { dbClient } from "../database/client";

export class SessionRepository {
  private static instance: SessionRepository;

  public static getInstance(): SessionRepository {
    if (!SessionRepository.instance) {
      SessionRepository.instance = new SessionRepository();
    }
    return SessionRepository.instance;
  }

  private mapRow(r: any): SessionSchema {
    return {
      id: r.id,
      uuid: r.uuid || r.id,
      userId: r.user_id || r.userId,
      token: r.token,
      expiresAt: r.expires_at ? new Date(r.expires_at).toISOString() : new Date().toISOString(),
      userAgent: r.user_agent || r.userAgent || null,
      ipAddress: r.ip_address || r.ipAddress || null,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    };
  }

  async findByToken(token: string): Promise<SessionSchema | null> {
    try {
      const rows = await dbClient.query<any>(
        "SELECT * FROM sessions WHERE token = $1 LIMIT 1",
        [token]
      );
      if (rows.length === 0) return null;

      const session = this.mapRow(rows[0]);
      if (new Date(session.expiresAt) < new Date()) {
        await this.delete(session.id);
        return null;
      }

      return session;
    } catch (err) {
      console.error("SessionRepository Neon findByToken error:", err);
      return null;
    }
  }

  async create(data: Omit<SessionSchema, "id" | "uuid" | "createdAt">): Promise<SessionSchema> {
    const id = `sess-${Date.now()}`;
    const uuid = `sess-uuid-${Date.now()}`;

    const sql = `
      INSERT INTO sessions (id, uuid, user_id, token, expires_at, user_agent, ip_address, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;

    const params = [
      id,
      uuid,
      data.userId,
      data.token,
      data.expiresAt,
      data.userAgent || null,
      data.ipAddress || null,
    ];

    const rows = await dbClient.query<any>(sql, params);
    return this.mapRow(rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    try {
      const rows = await dbClient.query<any>("DELETE FROM sessions WHERE id = $1 RETURNING id", [id]);
      return rows.length > 0;
    } catch (err) {
      console.error("SessionRepository Neon delete error:", err);
      return false;
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    try {
      await dbClient.query("DELETE FROM sessions WHERE user_id = $1", [userId]);
    } catch (err) {
      console.error("SessionRepository Neon deleteByUserId error:", err);
    }
  }
}

export const sessionRepository = SessionRepository.getInstance();
