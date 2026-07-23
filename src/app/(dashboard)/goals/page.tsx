import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Savings Goals — BudgetTracker",
  description: "Track and achieve your savings targets.",
};

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Savings Goals
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Monitor your progress toward financial milestones.
        </p>
      </div>
    </div>
  );
}
