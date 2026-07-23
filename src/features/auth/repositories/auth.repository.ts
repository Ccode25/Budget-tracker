/**
 * Auth Repository
 * Encapsulates PostgreSQL database operations for authentication entities.
 */

import { dbClient } from "../../../database/client";
import type { UserSchema, RefreshTokenSchema } from "../../../database/schema";

export class AuthRepository {
  private static instance: AuthRepository;

  public static getInstance(): AuthRepository {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository();
    }
    return AuthRepository.instance;
  }

  async findUserByEmail(email: string): Promise<UserSchema | null> {
    const rows = await dbClient.query<UserSchema>(
      `SELECT id, uuid, email, name, avatar_url as "avatarUrl", password_hash as "passwordHash", 
              role, email_verified as "emailVerified", google_id as "googleId", 
              created_at as "createdAt", updated_at as "updatedAt"
       FROM users 
       WHERE LOWER(email) = LOWER($1) AND deleted_at IS NULL 
       LIMIT 1`,
      [email]
    );
    return rows[0] ?? null;
  }

  async findUserById(id: string): Promise<UserSchema | null> {
    const rows = await dbClient.query<UserSchema>(
      `SELECT id, uuid, email, name, avatar_url as "avatarUrl", password_hash as "passwordHash", 
              role, email_verified as "emailVerified", google_id as "googleId", 
              created_at as "createdAt", updated_at as "updatedAt"
       FROM users 
       WHERE id = $1 AND deleted_at IS NULL 
       LIMIT 1`,
      [id]
    );
    return rows[0] ?? null;
  }

  async createUser(data: {
    id: string;
    uuid: string;
    email: string;
    name: string;
    passwordHash?: string;
    googleId?: string;
    emailVerified?: boolean;
  }): Promise<UserSchema> {
    const rows = await dbClient.query<UserSchema>(
      `INSERT INTO users (id, uuid, email, name, password_hash, google_id, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, uuid, email, name, avatar_url as "avatarUrl", role, email_verified as "emailVerified", created_at as "createdAt"`,
      [
        data.id,
        data.uuid,
        data.email.toLowerCase(),
        data.name,
        data.passwordHash || null,
        data.googleId || null,
        data.emailVerified ?? false,
      ]
    );
    return rows[0];
  }

  async storeRefreshToken(data: {
    id: string;
    uuid: string;
    userId: string;
    tokenHash: string;
    familyId: string;
    expiresAt: string;
  }): Promise<RefreshTokenSchema> {
    const rows = await dbClient.query<RefreshTokenSchema>(
      `INSERT INTO refresh_tokens (id, uuid, user_id, token_hash, family_id, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, uuid, user_id as "userId", token_hash as "tokenHash", family_id as "familyId", is_revoked as "isRevoked", expires_at as "expiresAt"`,
      [data.id, data.uuid, data.userId, data.tokenHash, data.familyId, data.expiresAt]
    );
    return rows[0];
  }

  async findRefreshToken(tokenHash: string): Promise<RefreshTokenSchema | null> {
    const rows = await dbClient.query<RefreshTokenSchema>(
      `SELECT id, uuid, user_id as "userId", token_hash as "tokenHash", family_id as "familyId", 
              is_revoked as "isRevoked", expires_at as "expiresAt", created_at as "createdAt"
       FROM refresh_tokens 
       WHERE token_hash = $1 
       LIMIT 1`,
      [tokenHash]
    );
    return rows[0] ?? null;
  }

  async revokeRefreshToken(id: string): Promise<void> {
    await dbClient.query(`UPDATE refresh_tokens SET is_revoked = TRUE WHERE id = $1`, [id]);
  }

  async revokeTokenFamily(familyId: string): Promise<void> {
    await dbClient.query(`UPDATE refresh_tokens SET is_revoked = TRUE WHERE family_id = $1`, [familyId]);
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await dbClient.query(`UPDATE refresh_tokens SET is_revoked = TRUE WHERE user_id = $1`, [userId]);
  }

  async saveResetToken(userId: string, resetTokenHash: string, expiresAt: string): Promise<void> {
    await dbClient.query(
      `UPDATE users SET reset_token_hash = $1, reset_token_expires = $2 WHERE id = $3`,
      [resetTokenHash, expiresAt, userId]
    );
  }

  async updateUserPassword(userId: string, passwordHash: string): Promise<void> {
    await dbClient.query(
      `UPDATE users SET password_hash = $1, reset_token_hash = NULL, reset_token_expires = NULL WHERE id = $2`,
      [passwordHash, userId]
    );
  }
}

export const authRepository = AuthRepository.getInstance();
