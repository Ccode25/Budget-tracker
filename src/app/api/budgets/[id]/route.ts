import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { budgetRepository } from "@/repositories/budget.repository";
import { checkBudgetOverlap } from "@/features/budgets/utils/budgetUtils";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id || session.user.email;
  const { id } = await params;

  try {
    const budget = await budgetRepository.findById(id, userId);
    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ data: budget });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch budget" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id || session.user.email;
  const { id } = await params;

  try {
    const body = await req.json();

    const existingBudgets = await budgetRepository.findAll(userId);
    const currentBudget = existingBudgets.find((b) => b.id === id);

    if (!currentBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    const newStart = body.startDate || currentBudget.startDate;
    const newEnd = body.endDate || currentBudget.endDate;

    if (newStart > newEnd) {
      return NextResponse.json(
        { error: "Start date must be before or equal to end date." },
        { status: 400 }
      );
    }

    // Revalidate date range overlap with other budgets (excluding current id)
    const otherBudgets = existingBudgets.filter((b) => b.id !== id);
    const isOverlapping = otherBudgets.some((b) =>
      checkBudgetOverlap(newStart, newEnd, b.startDate, b.endDate)
    );

    if (isOverlapping) {
      return NextResponse.json(
        { error: "This budget overlaps an existing budget period." },
        { status: 400 }
      );
    }

    const amount = body.amount ?? body.totalLimit;

    const updatedBudget = await budgetRepository.update(
      id,
      {
        ...body,
        startDate: newStart,
        endDate: newEnd,
        amount: amount !== undefined ? amount : currentBudget.amount,
        totalLimit: amount !== undefined ? amount : currentBudget.totalLimit,
      },
      userId
    );

    return NextResponse.json({ data: updatedBudget });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update budget" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id || session.user.email;
  const { id } = await params;

  try {
    const success = await budgetRepository.delete(id, userId);
    if (!success) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete budget" },
      { status: 500 }
    );
  }
}

