import type { Metadata } from "next";
import { AnalyticsContent } from "@/features/analytics/components/AnalyticsContent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { transactionRepository } from "@/repositories/transaction.repository";
import type { Transaction } from "@/types/transaction";

export const metadata: Metadata = {
  title: "Analytics — BudgetTracker",
  description: "Visual insights, cash flow trends, and category breakdown charts.",
};

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id || session?.user?.email;

  let initialTransactions: Transaction[] = [];

  if (userId) {
    const { data } = await transactionRepository.findAll(userId);
    initialTransactions = data;
  }

  return <AnalyticsContent initialTransactions={initialTransactions} />;
}
