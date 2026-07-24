import { describe, it, expect, afterEach } from "vitest";
import { authService } from "@/features/auth/services/auth.service";
import { authRepository } from "@/features/auth/repositories/auth.repository";
import { dbClient } from "@/database/client";

describe("Auth Flow — Final Testing Suite", () => {
  const testGoogleUser = {
    googleId: "google-test-" + Date.now(),
    email: "google-test-" + Date.now() + "@example.com",
    name: "Test Google User",
    avatarUrl: "https://example.com/avatar.jpg",
  };

  const testExistingGoogleUser = {
    googleId: "google-existing-" + Date.now(),
    email: "google-existing-" + Date.now() + "@example.com",
    name: "Existing Google User",
  };

  afterEach(async () => {
    try {
      await dbClient.query("DELETE FROM refresh_tokens WHERE user_id IN (SELECT id FROM users WHERE email = $1)", [testGoogleUser.email]);
      await dbClient.query("DELETE FROM settings WHERE user_id IN (SELECT id FROM users WHERE email = $1)", [testGoogleUser.email]);
      await dbClient.query("DELETE FROM categories WHERE user_id IN (SELECT id FROM users WHERE email = $1)", [testGoogleUser.email]);
      await dbClient.query("DELETE FROM users WHERE email = $1", [testGoogleUser.email]);

      await dbClient.query("DELETE FROM refresh_tokens WHERE user_id IN (SELECT id FROM users WHERE email = $1)", [testExistingGoogleUser.email]);
      await dbClient.query("DELETE FROM settings WHERE user_id IN (SELECT id FROM users WHERE email = $1)", [testExistingGoogleUser.email]);
      await dbClient.query("DELETE FROM categories WHERE user_id IN (SELECT id FROM users WHERE email = $1)", [testExistingGoogleUser.email]);
      await dbClient.query("DELETE FROM users WHERE email = $1", [testExistingGoogleUser.email]);
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("1. New Google User Sign-In", () => {
    it("creates a new user account with Google OAuth", async () => {
      const result = await authService.handleGoogleOAuth(testGoogleUser);

      expect(result.user.email).toBe(testGoogleUser.email);
      expect(result.user.name).toBe(testGoogleUser.name);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });

  describe("2. Existing Google User Sign-In", () => {
    it("logs in existing Google user without re-creating data", async () => {
      const firstResult = await authService.handleGoogleOAuth(testExistingGoogleUser);
      expect(firstResult.user.email).toBe(testExistingGoogleUser.email);

      const secondResult = await authService.handleGoogleOAuth(testExistingGoogleUser);
      expect(secondResult.user.email).toBe(testExistingGoogleUser.email);
      expect(secondResult.user.id).toBe(firstResult.user.id);
    });
  });

  describe("3. Token Rotation", () => {
    it("generates new tokens on refresh", async () => {
      const result = await authService.handleGoogleOAuth(testGoogleUser);
      const oldRefreshToken = result.refreshToken;

      const rotated = await authService.refresh(oldRefreshToken);
      expect(rotated.accessToken).toBeDefined();
      expect(rotated.refreshToken).toBeDefined();
      expect(rotated.refreshToken).not.toBe(oldRefreshToken);
    });

    it("rejects invalid refresh tokens", async () => {
      await expect(authService.refresh("invalid-token")).rejects.toThrow();
    });
  });
});
