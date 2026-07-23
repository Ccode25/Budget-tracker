/**
 * Auth Middleware & Authorization Guards
 * Middleware functions for JWT extraction, verification, role checking, and ownership guards.
 */

import { JWTService, type JWTPayload } from "../services/jwt.service";

export interface AuthenticatedRequest {
  user?: JWTPayload;
  headers: Headers;
}

export class AuthMiddleware {
  /**
   * Extract & verify bearer JWT token from Authorization header or cookies
   */
  static async verifyAuth(req: Request): Promise<JWTPayload | null> {
    const authHeader = req.headers.get("Authorization");
    let token: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    if (!token) {
      // Fallback check cookies
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/access_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }

    if (!token) return null;
    return JWTService.verifyToken<JWTPayload>(token);
  }

  /**
   * Require Role (Phase 9: Role-Based Authorization)
   */
  static requireRole(user: JWTPayload | null, allowedRoles: string[]): boolean {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  }

  /**
   * Require Resource Ownership (Phase 9: Ownership Guard)
   */
  static requireOwnership(user: JWTPayload | null, resourceUserId: string): boolean {
    if (!user) return false;
    if (user.role === "admin") return true; // Admins bypass ownership checks
    return user.userId === resourceUserId;
  }
}
