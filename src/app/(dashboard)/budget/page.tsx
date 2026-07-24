import type { Metadata } from "next";
import { BudgetContent } from "@/features/budgets/components/BudgetContent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { transactionRepository } from "@/repositories/transaction.repository";
import { budgetRepository } from "@/repositories/budget.repository";
import type { Transaction } from "@/types/transaction";
import type { Budget } from "@/types/budget";

export const metadata: Metadata = {
  title: "Budgets — BudgetTracker",
  description: "Set, monitor, and manage your monthly category budget limits.",
};

export default async function BudgetPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id || session?.user?.email;

  let initialBudgets: Budget[] = [];
  let initialTransactions: Transaction[] = [];

  if (userId) {
    const [{ data } = { data: [] }, budgets] = await Promise.all([
      transactionRepository.findAll(userId),
      budgetRepository.findAll(userId),
    ]);

    initialTransactions = data;
    initialBudgets = budgets;
  }

  return <BudgetContent initialBudgets={initialBudgets} initialTransactions={initialTransactions} />;
}
