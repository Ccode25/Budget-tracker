import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { goalRepository } from "@/repositories/goal.repository";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id || session.user.email;

  try {
    const body = await req.json();
    const newGoal = await goalRepository.create(body, userId);
    return NextResponse.json({ data: newGoal }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create goal" },
      { status: 500 }
    );
  }
}