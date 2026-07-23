import type { Metadata } from "next";
import { BudgetContent } from "@/features/budgets/components/BudgetContent";

export const metadata: Metadata = {
  title: "Budget — BudgetTracker",
  description: "Set, track, and manage your spending limits.",
};

export default function BudgetPage() {
  return <BudgetContent />;
}
