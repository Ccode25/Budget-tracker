import type { Metadata } from "next";
import { TransactionsContent } from "@/features/transactions/components/TransactionsContent";

export const metadata: Metadata = {
  title: "Transactions — BudgetTracker",
  description: "View, filter, search, and manage all your income and expense transactions.",
};

export default function TransactionsPage() {
  return <TransactionsContent />;
}
