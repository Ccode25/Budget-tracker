/**
 * Diagnostic page to test server-side fetch and session behavior
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      hasSession: !!session,
      sessionUser: session?.user ? {
        id: (session.user as any).id,
        email: session.user.email,
        name: session.user.name,
      } : null,
      cookies: {
        // We can't read cookies here directly in the response,
        // but we can test if getServerSession works
      },
      message: session?.user 
        ? "Session found! Check if user.id is the database ID (usr-...)." 
        : "No session found! This means the session cookie is missing or invalid.",
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
