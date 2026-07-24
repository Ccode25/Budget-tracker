import type { Metadata } from "next";
import { BudgetContent } from "@/features/budgets/components/BudgetContent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { transactionRepository } from "@/repositories/transaction.repository";
import { budgetRepository } from "@/repositories/budget.repository";
import type { Transaction } from "@/types/transaction";
import type { Budget } from "@/types/budget";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Budgets — BudgetTracker",
  description: "Set, monitor, and manage your monthly category budget limits.",
};

export default async function BudgetPage() {
  const t0 = Date.now();
  const session = await getServerSession(authOptions);
  const sessionMs = Date.now() - t0;
  console.log(`[profile] budget session: ${sessionMs}ms`);

  const userId = (session?.user as any)?.id || session?.user?.email;

  let initialBudgets: Budget[] = [];
  let initialTransactions: Transaction[] = [];

  if (userId) {
    const t1 = Date.now();
    const [{ data } = { data: [] }, budgets] = await Promise.all([
      transactionRepository.findAll(userId),
      budgetRepository.findAll(userId),
    ]);
    const dbMs = Date.now() - t1;
    console.log(`[profile] budget parallel db reads: ${dbMs}ms tx=${data.length} budgets=${budgets.length}`);

    initialTransactions = data;
    initialBudgets = budgets;
  }

  const totalMs = Date.now() - t0;
  console.log(`[profile] budget total server work: ${totalMs}ms`);

  return <BudgetContent initialBudgets={initialBudgets} initialTransactions={initialTransactions} />;
}
