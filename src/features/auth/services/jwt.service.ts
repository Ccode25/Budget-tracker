/**
 * JWT Service
 * Handles Access & Refresh Token generation, verification, hashing, and rotation using jose Web Crypto.
 */

import { SignJWT, jwtVerify } from "jose";
import { createHash } from "crypto";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "budget_tracker_super_secret_jwt_key_32_bytes_min!"
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export class JWTService {
  /**
   * Generates a short-lived Access Token (15 minutes)
   */
  static async generateAccessToken(payload: JWTPayload): Promise<string> {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(JWT_SECRET);
  }

  /**
   * Generates a long-lived Refresh Token (7 days)
   */
  static async generateRefreshToken(payload: JWTPayload & { familyId: string }): Promise<string> {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);
  }

  /**
   * Verifies and decodes a JWT token
   */
  static async verifyToken<T = JWTPayload>(token: string): Promise<T | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload as unknown as T;
    } catch {
      return null;
    }
  }

  /**
   * Computes SHA-256 hash of refresh token for DB storage & comparison
   */
  static hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
