import { describe, it, expect, beforeAll } from "vitest";
import { authService } from "./services/auth.service";
import { JWTService } from "./services/jwt.service";
import { AuthMiddleware } from "./middleware/auth.middleware";

describe("Phase 11: Enterprise Authentication & Authorization Test Suite", () => {
  const testUser = {
    name: "Auth Tester",
    email: `test-${Date.now()}@example.com`,
    password: "Password123",
  };

  let registeredAccessToken = "";
  let registeredRefreshToken = "";

  // ── Phase 3 & Phase 10: Registration & Password Hashing ────────────────────
  describe("Phase 3: User Registration & Validation", () => {
    it("registers new user and returns JWT access + refresh tokens", async () => {
      const res = await authService.register(testUser);
      expect(res.user.email).toBe(testUser.email.toLowerCase());
      expect(res.accessToken).toBeDefined();
      expect(res.refreshToken).toBeDefined();
      registeredAccessToken = res.accessToken;
      registeredRefreshToken = res.refreshToken;
    });

    it("rejects duplicate email registration attempt", async () => {
      await expect(authService.register(testUser)).rejects.toThrow("Email is already registered.");
    });
  });

  // ── Phase 4 & Phase 10: Login & Security ────────────────────────────────────
  describe("Phase 4: Login & Credential Verification", () => {
    it("logs in successfully with valid credentials", async () => {
      const res = await authService.login({
        email: testUser.email,
        password: testUser.password,
      });
      expect(res.user.email).toBe(testUser.email.toLowerCase());
      expect(res.accessToken).toBeDefined();
      expect(res.refreshToken).toBeDefined();
    });

    it("rejects invalid password", async () => {
      await expect(
        authService.login({
          email: testUser.email,
          password: "WrongPassword123",
        })
      ).rejects.toThrow("Invalid email or password.");
    });
  });

  // ── Phase 5: JWT Token Verification ──────────────────────────────────────────
  describe("Phase 5: JWT Verification & Claims", () => {
    it("verifies valid access token and extracts payload", async () => {
      const payload = await JWTService.verifyToken(registeredAccessToken);
      expect(payload).not.toBeNull();
      expect(payload?.email).toBe(testUser.email.toLowerCase());
      expect(payload?.role).toBe("user");
    });

    it("returns null for malformed or invalid JWT token", async () => {
      const payload = await JWTService.verifyToken("invalid.jwt.token");
      expect(payload).toBeNull();
    });
  });

  // ── Phase 6: Refresh Token Rotation & Reuse Revocation ──────────────────────
  describe("Phase 6: Refresh Token Rotation & Revocation", () => {
    it("rotates refresh token and returns new token pair", async () => {
      const rotated = await authService.refresh(registeredRefreshToken);
      expect(rotated.accessToken).toBeDefined();
      expect(rotated.refreshToken).toBeDefined();

      // Theft Detection: Reusing old revoked token must trigger security alert
      await expect(authService.refresh(registeredRefreshToken)).rejects.toThrow(
        "Security Alert: Refresh token reuse detected. Revoking session."
      );
    });
  });

  // ── Phase 7: Password Reset ──────────────────────────────────────────────────
  describe("Phase 7: Password Reset Flow", () => {
    it("generates password reset token and updates password", async () => {
      const resetUser = {
        name: "Reset Tester",
        email: `reset-${Date.now()}@example.com`,
        password: "OldPassword123",
      };
      await authService.register(resetUser);

      const { resetToken } = await authService.forgotPassword(resetUser.email);
      expect(resetToken).toBeDefined();

      const newPassword = "NewPassword456";
      await authService.resetPassword({
        token: resetToken,
        newPassword,
      });

      // Login with new password must succeed
      const loginRes = await authService.login({
        email: resetUser.email,
        password: newPassword,
      });
      expect(loginRes.user.email).toBe(resetUser.email.toLowerCase());
    });
  });

  // ── Phase 8: Google OAuth ────────────────────────────────────────────────────
  describe("Phase 8: Google OAuth Integration", () => {
    it("auto-registers new Google user or links account", async () => {
      const googleUser = {
        googleId: `google-id-${Date.now()}`,
        email: `google-${Date.now()}@example.com`,
        name: "Google User",
      };

      const oauthRes = await authService.handleGoogleOAuth(googleUser);
      expect(oauthRes.user.email).toBe(googleUser.email);
      expect(oauthRes.accessToken).toBeDefined();
    });
  });

  // ── Phase 9: Authorization & Ownership Guards ──────────────────────────────
  describe("Phase 9: Role-Based Authorization & Ownership Checks", () => {
    it("grants access to matching resource owner", () => {
      const userPayload = { userId: "usr-123", email: "user@example.com", role: "user" };
      expect(AuthMiddleware.requireOwnership(userPayload, "usr-123")).toBe(true);
      expect(AuthMiddleware.requireOwnership(userPayload, "usr-999")).toBe(false);
    });

    it("allows admin user to bypass ownership checks", () => {
      const adminPayload = { userId: "usr-admin", email: "admin@example.com", role: "admin" };
      expect(AuthMiddleware.requireOwnership(adminPayload, "usr-999")).toBe(true);
      expect(AuthMiddleware.requireRole(adminPayload, ["admin"])).toBe(true);
    });
  });
});
