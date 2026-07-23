import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { transactionRepository } from "@/repositories/transaction.repository";
import { budgetRepository } from "@/repositories/budget.repository";
import { goalRepository } from "@/repositories/goal.repository";
import { categoryRepository } from "@/repositories/category.repository";
import { settingsRepository } from "@/repositories/settings.repository";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id || session.user.email;

  try {
    let categories = await categoryRepository.findAll(userId);
    if (categories.length === 0) {
      await categoryRepository.seedDefaultCategories(userId);
      categories = await categoryRepository.findAll(userId);
    }

    const [{ data: transactions, total }, budgets, goals, settings] = await Promise.all([
      transactionRepository.findAll(userId),
      budgetRepository.findAll(userId),
      goalRepository.findAll(userId),
      settingsRepository.getByUserId(userId),
    ]);

    const formattedGoals = goals.map((g) => {
      const target = parseFloat((g.targetAmount ?? (g as any).target_amount ?? (g as any).target ?? 0).toString());
      const saved = parseFloat((g.savedAmount ?? (g as any).saved_amount ?? (g as any).saved ?? 0).toString());
      return {
        ...g,
        target,
        saved,
        targetAmount: target,
        savedAmount: saved,
      };
    });

    return NextResponse.json({
      user: session.user,
      userId,
      transactions,
      totalTransactions: total,
      budgets,
      goals: formattedGoals,
      categories,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch user data" }, { status: 500 });
  }
}
