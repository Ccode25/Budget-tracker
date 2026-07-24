import { dbClient } from "@/database/client";
import type { UserSchema } from "@/database/schema";

export class UserRepository {
  private static instance: UserRepository;
  private memoryStore: Map<string, UserSchema> = new Map();

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  private mapRow(row: any): UserSchema {
    return {
      id: row.id,
      uuid: row.uuid || row.id,
      email: row.email,
      name: row.name,
      avatarUrl: row.avatar_url || row.avatarUrl || undefined,
      role: row.role || "user",
      emailVerified: row.email_verified ?? row.emailVerified ?? true,
      googleId: row.google_id || row.googleId || undefined,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
      deletedAt: row.deleted_at ? new Date(row.deleted_at).toISOString() : null,
    };
  }

  async findById(id: string): Promise<UserSchema | null> {
    try {
      const rows = await dbClient.query("SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL LIMIT 1", [id]);
      if (rows.length > 0) return this.mapRow(rows[0]);
    } catch (err) {
      console.error("UserRepository findById query error:", err);
    }
    const mem = this.memoryStore.get(id);
    return mem && !mem.deletedAt ? mem : null;
  }

  async findByUuid(uuid: string): Promise<UserSchema | null> {
    try {
      const rows = await dbClient.query("SELECT * FROM users WHERE (uuid = $1 OR id = $1) AND deleted_at IS NULL LIMIT 1", [uuid]);
      if (rows.length > 0) return this.mapRow(rows[0]);
    } catch (err) {
      console.error("UserRepository findByUuid query error:", err);
    }
    for (const user of this.memoryStore.values()) {
      if ((user.uuid === uuid || user.id === uuid) && !user.deletedAt) return user;
    }
    return null;
  }

  async findByEmail(email: string): Promise<UserSchema | null> {
    try {
      const rows = await dbClient.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND deleted_at IS NULL LIMIT 1", [email]);
      if (rows.length > 0) return this.mapRow(rows[0]);
    } catch (err) {
      console.error("UserRepository findByEmail query error:", err);
    }
    const lower = email.toLowerCase();
    for (const user of this.memoryStore.values()) {
      if (user.email.toLowerCase() === lower && !user.deletedAt) return user;
    }
    return null;
  }

  async create(data: Omit<UserSchema, "id" | "uuid" | "createdAt" | "updatedAt">): Promise<UserSchema> {
    const id = `usr-${Date.now()}`;
    const uuid = `usr-uuid-${Date.now()}`;
    const timestamp = new Date();

    const createdUser: UserSchema = {
      id,
      uuid,
      email: data.email,
      name: data.name,
      avatarUrl: data.avatarUrl || undefined,
      role: data.role || "user",
      emailVerified: data.emailVerified ?? true,
      googleId: data.googleId || undefined,
      createdAt: timestamp.toISOString(),
      updatedAt: timestamp.toISOString(),
      deletedAt: null,
    };

    this.memoryStore.set(id, createdUser);

    try {
      const sql = `
        INSERT INTO users (id, uuid, email, name, avatar_url, role, email_verified, google_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const params = [
        id,
        uuid,
        data.email,
        data.name,
        data.avatarUrl || null,
        data.role || "user",
        data.emailVerified ?? true,
        data.googleId || null,
        timestamp,
        timestamp,
      ];

      const rows = await dbClient.query(sql, params);
      if (rows && rows.length > 0) {
        const dbUser = this.mapRow(rows[0]);
        this.memoryStore.set(dbUser.id, dbUser);
        return dbUser;
      }
    } catch (err) {
      console.error("UserRepository create query error:", err);
    }

    return createdUser;
  }

  async update(id: string, updates: Partial<UserSchema>): Promise<UserSchema | null> {
    const current = await this.findById(id);
    if (current) {
      const updated: UserSchema = {
        ...current,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.memoryStore.set(id, updated);
    }

    try {
      const fields: string[] = [];
      const params: any[] = [id];
      let index = 2;

      if (updates.name !== undefined) { fields.push(`name = $${index++}`); params.push(updates.name); }
      if (updates.avatarUrl !== undefined) { fields.push(`avatar_url = $${index++}`); params.push(updates.avatarUrl); }
      if (updates.role !== undefined) { fields.push(`role = $${index++}`); params.push(updates.role); }
      if (updates.emailVerified !== undefined) { fields.push(`email_verified = $${index++}`); params.push(updates.emailVerified); }
      if (updates.googleId !== undefined) { fields.push(`google_id = $${index++}`); params.push(updates.googleId); }

      fields.push(`updated_at = $${index++}`);
      params.push(new Date());

      if (fields.length > 1) {
        const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = $1 RETURNING *`;
        const rows = await dbClient.query(sql, params);
        if (rows.length > 0) return this.mapRow(rows[0]);
      }
    } catch (err) {
      console.error("UserRepository update query error:", err);
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const mem = this.memoryStore.get(id);
    if (mem) {
      mem.deletedAt = new Date().toISOString();
    }
    try {
      const rows = await dbClient.query("UPDATE users SET deleted_at = $2 WHERE id = $1 RETURNING id", [id, new Date()]);
      return rows.length > 0;
    } catch {
      return !!mem;
    }
  }
}

export const userRepository = UserRepository.getInstance();
