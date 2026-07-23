import type { Metadata } from "next";
import { GoalsContent } from "@/features/goals/components/GoalsContent";

export const metadata: Metadata = {
  title: "Savings Goals — BudgetTracker",
  description: "Track and achieve your savings targets.",
};

export default function GoalsPage() {
  return <GoalsContent />;
}
