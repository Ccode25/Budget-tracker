/**
 * In-Memory Rate Limiter Guard for API Endpoints
 */

import { NextResponse } from "next/server";

interface RateLimitTracker {
  count: number;
  resetAt: number;
}

const ipMap = new Map<string, RateLimitTracker>();

export function checkRateLimit(ip: string, limit = 20, windowMs = 60 * 1000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const tracker = ipMap.get(ip);

  if (!tracker || tracker.resetAt <= now) {
    ipMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (tracker.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  tracker.count += 1;
  return { allowed: true, remaining: limit - tracker.count };
}

export function rateLimitMiddleware(req: Request, limit = 20, windowMs = 60 * 1000): NextResponse | null {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const { allowed } = checkRateLimit(ip, limit, windowMs);

  if (!allowed) {
    return NextResponse.json(
      {
        error: {
          message: "Too many requests. Please try again later.",
          code: "RATE_LIMIT_EXCEEDED",
          status: 429,
        },
      },
      { status: 429 }
    );
  }

  return null;
}
