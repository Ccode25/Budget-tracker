/**
 * Auth Service
 * Google Authentication only — single sign-on via Google OAuth.
 */

import { authRepository } from "../repositories/auth.repository";
import { JWTService } from "./jwt.service";
import { onboardingService } from "@/features/onboarding/onboarding.service";
import type { UserSchema } from "../../../database/schema";

export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async handleGoogleOAuth(googleUser: { googleId: string; email: string; name: string; avatarUrl?: string }): Promise<{ user: Partial<UserSchema>; accessToken: string; refreshToken: string }> {
    let user = await authRepository.findUserByEmail(googleUser.email);
    let isNewUser = false;

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
      isNewUser = true;
    } else if (!user.googleId) {
      await authRepository.updateUser(user.id, { googleId: googleUser.googleId, emailVerified: true });
      user.googleId = googleUser.googleId;
    }

    // Run shared onboarding pipeline for newly created users only
    if (isNewUser) {
      await onboardingService.initializeNewUser(user.id);
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

    const safeUser = user as any;

    return { user: safeUser, accessToken, refreshToken };
  }

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

    if (storedToken.isRevoked) {
      await authRepository.revokeTokenFamily(storedToken.familyId);
      throw new Error("Security Alert: Refresh token reuse detected. Revoking session.");
    }

    await authRepository.revokeRefreshToken(storedToken.id);

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
}

export const authService = AuthService.getInstance();
