/**
 * Standardized Secure Error Handler
 * Masks sensitive internal stack traces, DB errors, and environment variables.
 */

import { NextResponse } from "next/server";

export interface StandardErrorResponse {
  error: {
    message: string;
    code: string;
    status: number;
  };
}

export function handleApiError(error: unknown, defaultMessage = "An internal server error occurred."): NextResponse<StandardErrorResponse> {
  console.error("[API Error Safeguard]:", error);

  // Default internal server error payload (sanitized)
  let status = 500;
  let code = "INTERNAL_SERVER_ERROR";
  let message = defaultMessage;

  if (error instanceof Error) {
    if (error.message.includes("401") || error.message.toLowerCase().includes("unauthorized")) {
      status = 401;
      code = "UNAUTHORIZED";
      message = "Authentication required. Please log in.";
    } else if (error.message.includes("403") || error.message.toLowerCase().includes("forbidden")) {
      status = 403;
      code = "FORBIDDEN";
      message = "Forbidden. You do not have permission to access this resource.";
    }
  }

  return NextResponse.json(
    {
      error: {
        message,
        code,
        status,
      },
    },
    { status }
  );
}
