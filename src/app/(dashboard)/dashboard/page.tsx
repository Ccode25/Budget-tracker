import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { transactionRepository } from "@/repositories/transaction.repository";
import { budgetRepository } from "@/repositories/budget.repository";
import { goalRepository } from "@/repositories/goal.repository";
import { categoryRepository } from "@/repositories/category.repository";
import { settingsRepository } from "@/repositories/settings.repository";
import { DashboardContent } from "@/features/dashboard/components/DashboardContent";
import type { Transaction } from "@/types/transaction";
import type { Budget } from "@/types/budget";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const t0 = Date.now();
  const session = await getServerSession(authOptions);
  const sessionMs = Date.now() - t0;
  console.log(`[profile] dashboard session: ${sessionMs}ms`);

  const userId = (session?.user as any)?.id || session?.user?.email;

  let initialTransactions: Transaction[] = [];
  let initialBudgets: Budget[] = [];
  let initialGoals: any[] = [];

  if (userId) {
    const t1 = Date.now();
    const [transactions, goals, categories, settings] = await Promise.all([
      transactionRepository.findAllUserTransactions(userId),
      goalRepository.findAll(userId),
      categoryRepository.findAll(userId),
      settingsRepository.getByUserId(userId),
    ]);
    const dbMs = Date.now() - t1;
    console.log(`[profile] dashboard parallel db reads: ${dbMs}ms`);

    const t2 = Date.now();
    const budgets = await budgetRepository.findAll(userId, transactions);
    const budgetCalcMs = Date.now() - t2;
    console.log(`[profile] dashboard budget calc: ${budgetCalcMs}ms`);

    initialTransactions = transactions;
    initialBudgets = budgets;
    initialGoals = goals.map((g) => ({
      id: g.id,
      name: g.name,
      target: g.targetAmount,
      saved: g.savedAmount,
      deadline: g.deadline,
      color: g.color || "#7c3aed",
      icon: g.icon || "Target",
    }));
  }

  const totalMs = Date.now() - t0;
  console.log(`[profile] dashboard total server work: ${totalMs}ms`);

  return (
    <DashboardContent
      initialTransactions={initialTransactions}
      initialBudgets={initialBudgets}
      initialGoals={initialGoals}
    />
  );
}
