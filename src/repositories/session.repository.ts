/**
 * Session Repository
 * Encapsulates database operations for active user session management.
 */

import type { SessionSchema } from "@/database/schema";

export class SessionRepository {
  private static instance: SessionRepository;
  private sessions: SessionSchema[] = [];

  public static getInstance(): SessionRepository {
    if (!SessionRepository.instance) {
      SessionRepository.instance = new SessionRepository();
    }
    return SessionRepository.instance;
  }

  async findByToken(token: string): Promise<SessionSchema | null> {
    const session = this.sessions.find((s) => s.token === token);
    if (!session) return null;

    if (new Date(session.expiresAt) < new Date()) {
      await this.delete(session.id);
      return null;
    }

    return session;
  }

  async create(data: Omit<SessionSchema, "id" | "uuid" | "createdAt">): Promise<SessionSchema> {
    const newSession: SessionSchema = {
      ...data,
      id: `sess-${Date.now()}`,
      uuid: `sess-uuid-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.sessions.push(newSession);
    return newSession;
  }

  async delete(id: string): Promise<boolean> {
    const initialLen = this.sessions.length;
    this.sessions = this.sessions.filter((s) => s.id !== id);
    return this.sessions.length < initialLen;
  }

  async deleteByUserId(userId: string): Promise<void> {
    this.sessions = this.sessions.filter((s) => s.userId !== userId);
  }
}

export const sessionRepository = SessionRepository.getInstance();
