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
    const [transactions, goals, categories] = await Promise.all([
      transactionRepository.findAllUserTransactions(userId),
      goalRepository.findAll(userId),
      categoryRepository.findAll(userId),
    ]);

    const budgets = await budgetRepository.findAll(userId, transactions);

    if (categories.length === 0) {
      categoryRepository.seedDefaultCategories(userId).catch(() => {});
    }

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
      totalTransactions: transactions.length,
      budgets,
      goals: formattedGoals,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch user data" }, { status: 500 });
  }
}
