/**
 * Auth Controller
 * Handles HTTP API routes for registration, login, refresh, logout, password reset, and OAuth.
 */

import { NextResponse } from "next/server";
import { authService } from "../services/auth.service";
import { RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from "../validation/auth.validation";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class AuthController {
  static async register(req: Request) {
    try {
      const body = await req.json();
      const input = RegisterSchema.parse(body);
      const result = await authService.register(input);

      const response = NextResponse.json({ success: true, user: result.user, accessToken: result.accessToken }, { status: 201 });
      
      // Set secure HTTP-only refresh_token cookie (Phase 10: Security)
      response.cookies.set("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      return response;
    } catch (err: any) {
      return NextResponse.json({ success: false, message: err.message || "Registration failed" }, { status: 400 });
    }
  }

  static async login(req: Request) {
    try {
      const body = await req.json();
      const input = LoginSchema.parse(body);
      const result = await authService.login(input);

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
      return NextResponse.json({ success: false, message: err.message || "Invalid credentials" }, { status: 401 });
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

  static async forgotPassword(req: Request) {
    try {
      const body = await req.json();
      const input = ForgotPasswordSchema.parse(body);
      const result = await authService.forgotPassword(input.email);
      return NextResponse.json({ success: true, message: "If account exists, password reset instructions have been dispatched.", resetToken: result.resetToken });
    } catch (err: any) {
      return NextResponse.json({ success: false, message: err.message || "Forgot password request failed" }, { status: 400 });
    }
  }

  static async resetPassword(req: Request) {
    try {
      const body = await req.json();
      const input = ResetPasswordSchema.parse(body);
      await authService.resetPassword(input);
      return NextResponse.json({ success: true, message: "Password reset successfully. Please log in with your new password." });
    } catch (err: any) {
      return NextResponse.json({ success: false, message: err.message || "Reset password failed" }, { status: 400 });
    }
  }
}
