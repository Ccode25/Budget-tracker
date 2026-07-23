import { NextRequest } from "next/server";
import { AuthController } from "@/features/auth/controllers/auth.controller";

export async function POST(req: NextRequest) {
  return AuthController.forgotPassword(req);
}
