import type { Metadata } from "next";
import { TransactionsContent } from "@/features/transactions/components/TransactionsContent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { transactionRepository } from "@/repositories/transaction.repository";
import type { Transaction } from "@/types/transaction";

export const metadata: Metadata = {
  title: "Transactions — BudgetTracker",
  description: "View, filter, search, and manage all your income and expense transactions.",
};

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id || session?.user?.email;

  let initialTransactions: Transaction[] = [];

  if (userId) {
    const { data } = await transactionRepository.findAll(userId);
    initialTransactions = data;
  }

  return <TransactionsContent initialTransactions={initialTransactions} />;
}
