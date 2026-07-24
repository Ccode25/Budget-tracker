/**
 * Next.js Edge Middleware for Route Protection
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/transactions",
  "/budgets",
  "/goals",
  "/settings",
  "/analytics",
  "/import",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    const isDemoQuery = request.nextUrl.searchParams.get("demo") === "true";
    if (isDemoQuery) {
      return NextResponse.next();
    }

    // Check session cookies (Auth.js session token or custom access token)
    const sessionToken =
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value ||
      request.cookies.get("session_token")?.value;

    const accessToken = request.cookies.get("access_token")?.value;

    if (!sessionToken && !accessToken) {
      return NextResponse.redirect(new URL("/api/auth/signin/google", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transactions/:path*",
    "/budgets/:path*",
    "/goals/:path*",
    "/settings/:path*",
    "/analytics/:path*",
    "/import/:path*",
  ],
};
