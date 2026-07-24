import type { Metadata } from "next";
import { TransactionsContent } from "@/features/transactions/components/TransactionsContent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { transactionRepository } from "@/repositories/transaction.repository";
import type { Transaction } from "@/types/transaction";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Transactions — BudgetTracker",
  description: "View, filter, search, and manage all your income and expense transactions.",
};

export default async function TransactionsPage() {
  const t0 = Date.now();
  const session = await getServerSession(authOptions);
  const sessionMs = Date.now() - t0;
  console.log(`[profile] tx session: ${sessionMs}ms`);

  const userId = (session?.user as any)?.id || session?.user?.email;

  let initialTransactions: Transaction[] = [];

  if (userId) {
    const t1 = Date.now();
    const { data } = await transactionRepository.findAll(userId);
    const dbMs = Date.now() - t1;
    console.log(`[profile] tx db findAll: ${dbMs}ms count=${data.length}`);
    initialTransactions = data;
  }

  const totalMs = Date.now() - t0;
  console.log(`[profile] tx total server work: ${totalMs}ms`);

  return <TransactionsContent initialTransactions={initialTransactions} />;
}
