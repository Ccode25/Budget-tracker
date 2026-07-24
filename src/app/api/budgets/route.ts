import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { budgetRepository } from "@/repositories/budget.repository";
import { checkBudgetOverlap } from "@/features/budgets/utils/budgetUtils";

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
    const { startDate, endDate, name, amount, totalLimit } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required." },
        { status: 400 }
      );
    }

    if (startDate > endDate) {
      return NextResponse.json(
        { error: "Start date must be before or equal to end date." },
        { status: 400 }
      );
    }

    // Check existing budget periods for date range overlap
    const existingBudgets = await budgetRepository.findAll(userId);
    const isOverlapping = existingBudgets.some((b) =>
      checkBudgetOverlap(startDate, endDate, b.startDate, b.endDate)
    );

    if (isOverlapping) {
      return NextResponse.json(
        { error: "This budget overlaps an existing budget period." },
        { status: 400 }
      );
    }

    const newBudget = await budgetRepository.create(
      {
        ...body,
        amount: amount ?? totalLimit ?? 0,
        totalLimit: amount ?? totalLimit ?? 0,
      },
      userId
    );
    return NextResponse.json({ data: newBudget }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create budget" }, { status: 500 });
  }
}

