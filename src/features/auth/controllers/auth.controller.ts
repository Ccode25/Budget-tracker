/**
 * Auth Controller
 * Handles HTTP API routes for Google OAuth, token refresh, and logout.
 */

import { NextResponse } from "next/server";
import { authService } from "../services/auth.service";

export class AuthController {
  static async googleOAuth(req: Request) {
    try {
      const body = await req.json();
      const { googleId, email, name, avatarUrl } = body;

      if (!googleId || !email) {
        return NextResponse.json({ success: false, message: "Google OAuth data is required" }, { status: 400 });
      }

      const result = await authService.handleGoogleOAuth({ googleId, email, name, avatarUrl });

      const response = NextResponse.json({ success: true, user: result.user, accessToken: result.accessToken }, { status: 200 });

      response.cookies.set("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    } catch (err: any) {
      return NextResponse.json({ success: false, message: err.message || "Google OAuth failed" }, { status: 400 });
    }
  }

  static async refresh(req: Request) {
    try {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/refresh_token=([^;]+)/);
      const rawRefreshToken = match ? match[1] : null;

      if (!rawRefreshToken) {
        return NextResponse.json({ success: false, message: "Refresh token missing" }, { status: 401 });
      }

      const result = await authService.refresh(rawRefreshToken);
      const response = NextResponse.json({ success: true, accessToken: result.accessToken }, { status: 200 });

      response.cookies.set("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    } catch (err: any) {
      return NextResponse.json({ success: false, message: err.message || "Token refresh failed" }, { status: 401 });
    }
  }

  static async logout(req: Request) {
    try {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/refresh_token=([^;]+)/);
      const rawRefreshToken = match ? match[1] : null;

      if (rawRefreshToken) {
        await authService.logout(rawRefreshToken);
      }

      const response = NextResponse.json({ success: true, message: "Logged out successfully" });
      response.cookies.delete("refresh_token");
      return response;
    } catch (err: any) {
      return NextResponse.json({ success: false, message: err.message || "Logout failed" }, { status: 400 });
    }
  }
}
