import type { Metadata } from "next";
import { BudgetContent } from "@/features/budgets/components/BudgetContent";

export const metadata: Metadata = {
  title: "Budgets — BudgetTracker",
  description: "Set, monitor, and manage your monthly category budget limits.",
};

export default function BudgetPage() {
  return <BudgetContent />;
}
