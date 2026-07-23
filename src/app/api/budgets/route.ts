import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { budgetRepository } from "@/repositories/budget.repository";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id || session.user.email;

  try {
    const budgets = await budgetRepository.findAll(userId);
    return NextResponse.json({ data: budgets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id || session.user.email;

  try {
    const body = await req.json();
    const newBudget = await budgetRepository.create(body, userId);
    return NextResponse.json({ data: newBudget }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create budget" }, { status: 500 });
  }
}
