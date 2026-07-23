/**
 * Auth Service
 * Business logic implementation for Registration, Login, Token Rotation, Password Reset, and OAuth.
 */

import bcrypt from "bcryptjs";
import { authRepository } from "../repositories/auth.repository";
import { JWTService } from "./jwt.service";
import type { RegisterInput, LoginInput, ResetPasswordInput } from "../validation/auth.validation";
import type { UserSchema } from "../../../database/schema";
import { dbClient } from "../../../database/client";

export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Phase 3: Registration
   * Duplicate email check, password hashing, user creation & JWT issuance.
   */
  async register(input: RegisterInput): Promise<{ user: Partial<UserSchema>; accessToken: string; refreshToken: string }> {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) {
      throw new Error("Email is already registered.");
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const userId = `usr-${Date.now()}`;
    const userUuid = `usr-uuid-${Date.now()}`;

    const user = await authRepository.createUser({
      id: userId,
      uuid: userUuid,
      email: input.email,
      name: input.name,
      passwordHash,
      emailVerified: false,
    });

    const familyId = `fam-${Date.now()}`;
    const payload = { userId: user.id, email: user.email, role: user.role };

    const accessToken = await JWTService.generateAccessToken(payload);
    const refreshToken = await JWTService.generateRefreshToken({ ...payload, familyId });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await authRepository.storeRefreshToken({
      id: `rt-${Date.now()}`,
      uuid: `rt-uuid-${Date.now()}`,
      userId: user.id,
      tokenHash: JWTService.hashToken(refreshToken),
      familyId,
      expiresAt,
    });

    const { passwordHash: _, ...safeUser } = user as any;
    return { user: safeUser, accessToken, refreshToken };
  }

  /**
   * Phase 4: Login
   * Credential verification, Access + Refresh Token issuance.
   */
  async login(input: LoginInput): Promise<{ user: Partial<UserSchema>; accessToken: string; refreshToken: string }> {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user || !user.passwordHash) {
      throw new Error("Invalid email or password.");
    }

    const validPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!validPassword) {
      throw new Error("Invalid email or password.");
    }

    const familyId = `fam-${Date.now()}`;
    const payload = { userId: user.id, email: user.email, role: user.role };

    const accessToken = await JWTService.generateAccessToken(payload);
    const refreshToken = await JWTService.generateRefreshToken({ ...payload, familyId });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await authRepository.storeRefreshToken({
      id: `rt-${Date.now()}`,
      uuid: `rt-uuid-${Date.now()}`,
      userId: user.id,
      tokenHash: JWTService.hashToken(refreshToken),
      familyId,
      expiresAt,
    });

    const { passwordHash: _, ...safeUser } = user as any;
    return { user: safeUser, accessToken, refreshToken };
  }

  /**
   * Phase 6: Refresh Token Rotation & Theft Detection
   */
  async refresh(rawRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = await JWTService.verifyToken<{ userId: string; email: string; role: string; familyId: string }>(rawRefreshToken);
    if (!payload || !payload.familyId) {
      throw new Error("Invalid or expired refresh token.");
    }

    const tokenHash = JWTService.hashToken(rawRefreshToken);
    const storedToken = await authRepository.findRefreshToken(tokenHash);

    if (!storedToken) {
      throw new Error("Refresh token record not found.");
    }

    // Reuse Detection: If token is already revoked, invalidate entire token family!
    if (storedToken.isRevoked) {
      await authRepository.revokeTokenFamily(storedToken.familyId);
      throw new Error("Security Alert: Refresh token reuse detected. Revoking session.");
    }

    // Revoke old refresh token
    await authRepository.revokeRefreshToken(storedToken.id);

    // Issue new token pair
    const tokenPayload = { userId: payload.userId, email: payload.email, role: payload.role };
    const newAccessToken = await JWTService.generateAccessToken(tokenPayload);
    const newRefreshToken = await JWTService.generateRefreshToken({ ...tokenPayload, familyId: storedToken.familyId });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await authRepository.storeRefreshToken({
      id: `rt-${Date.now()}`,
      uuid: `rt-uuid-${Date.now()}`,
      userId: payload.userId,
      tokenHash: JWTService.hashToken(newRefreshToken),
      familyId: storedToken.familyId,
      expiresAt,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * Phase 6: Logout Single Device & Logout All
   */
  async logout(rawRefreshToken: string): Promise<void> {
    const tokenHash = JWTService.hashToken(rawRefreshToken);
    const stored = await authRepository.findRefreshToken(tokenHash);
    if (stored) {
      await authRepository.revokeRefreshToken(stored.id);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await authRepository.revokeAllUserTokens(userId);
  }

  /**
   * Phase 7: Forgot Password & Password Reset
   */
  async forgotPassword(email: string): Promise<{ resetToken: string }> {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      // Return dummy success to prevent email enumeration
      return { resetToken: "dummy-token-sent" };
    }

    const resetToken = `reset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const resetHash = JWTService.hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    await authRepository.saveResetToken(user.id, resetHash, expiresAt);
    return { resetToken };
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const resetHash = JWTService.hashToken(input.token);
    const user = await dbClient.query<UserSchema>(
      `SELECT id, reset_token_expires as "resetTokenExpires" 
       FROM users WHERE reset_token_hash = $1 LIMIT 1`,
      [resetHash]
    );

    if (!user[0] || !user[0].resetTokenExpires || new Date(user[0].resetTokenExpires) < new Date()) {
      throw new Error("Invalid or expired password reset token.");
    }

    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(input.newPassword, salt);

    await authRepository.updateUserPassword(user[0].id, newHash);
    await authRepository.revokeAllUserTokens(user[0].id);
  }

  /**
   * Phase 8: Google OAuth Integration & Account Linking
   */
  async handleGoogleOAuth(googleUser: { googleId: string; email: string; name: string; avatarUrl?: string }): Promise<{ user: Partial<UserSchema>; accessToken: string; refreshToken: string }> {
    let user = await authRepository.findUserByEmail(googleUser.email);

    if (!user) {
      const userId = `usr-${Date.now()}`;
      const userUuid = `usr-uuid-${Date.now()}`;
      user = await authRepository.createUser({
        id: userId,
        uuid: userUuid,
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.googleId,
        emailVerified: true,
      });
    } else if (!user.googleId) {
      // Link Google ID to existing account
      await dbClient.query(`UPDATE users SET google_id = $1, email_verified = TRUE WHERE id = $2`, [googleUser.googleId, user.id]);
      user.googleId = googleUser.googleId;
    }

    const familyId = `fam-${Date.now()}`;
    const payload = { userId: user.id, email: user.email, role: user.role };

    const accessToken = await JWTService.generateAccessToken(payload);
    const refreshToken = await JWTService.generateRefreshToken({ ...payload, familyId });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await authRepository.storeRefreshToken({
      id: `rt-${Date.now()}`,
      uuid: `rt-uuid-${Date.now()}`,
      userId: user.id,
      tokenHash: JWTService.hashToken(refreshToken),
      familyId,
      expiresAt,
    });

    const { passwordHash: _, ...safeUser } = user as any;
    return { user: safeUser, accessToken, refreshToken };
  }
}

export const authService = AuthService.getInstance();
