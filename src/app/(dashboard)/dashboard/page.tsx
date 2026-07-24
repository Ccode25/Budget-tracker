import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { transactionRepository } from "@/repositories/transaction.repository";
import { budgetRepository } from "@/repositories/budget.repository";
import { goalRepository } from "@/repositories/goal.repository";
import { categoryRepository } from "@/repositories/category.repository";
import { DashboardContent } from "@/features/dashboard/components/DashboardContent";
import type { Transaction } from "@/types/transaction";
import type { Budget } from "@/types/budget";

export const metadata: Metadata = {
  title: "Overview — BudgetTracker",
  description: "Your financial dashboard summary.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id || session?.user?.email;

  let initialTransactions: Transaction[] = [];
  let initialBudgets: Budget[] = [];
  let initialGoals: any[] = [];

  if (userId) {
    const [transactions, goals] = await Promise.all([
      transactionRepository.findAllUserTransactions(userId),
      goalRepository.findAll(userId),
    ]);
    const budgets = await budgetRepository.findAll(userId, transactions);

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

  return (
    <DashboardContent
      initialTransactions={initialTransactions}
      initialBudgets={initialBudgets}
      initialGoals={initialGoals}
    />
  );
}
