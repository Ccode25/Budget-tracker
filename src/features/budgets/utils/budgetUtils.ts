import type { BudgetStatus } from "@/types/budget";
import type { Transaction } from "@/types/transaction";

/**
 * Checks if two date ranges [startA, endA] and [startB, endB] overlap.
 * Assumes dates are strings in YYYY-MM-DD or comparable ISO formats.
 */
export function checkBudgetOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return startA <= endB && endA >= startB;
}

export interface ComputedBudgetSummary {
  amount: number;
  totalExpenses: number;
  totalIncome: number;
  remainingBudget: number;
  spentPercentage: number;
  remainingPercentage: number;
  status: BudgetStatus;
  transactions: Transaction[];
}

/**
 * Dynamically computes summary metrics and filters period transactions for a budget.
 * NEVER stores computed values in the database.
 */
export function calculateBudgetSummary(
  budget: { amount?: number; totalLimit?: number; startDate: string; endDate: string },
  transactions: Transaction[]
): ComputedBudgetSummary {
  const amount = budget.amount ?? budget.totalLimit ?? 0;

  const periodTransactions = transactions.filter(
    (t) =>
      t.status !== "failed" &&
      t.date >= budget.startDate &&
      t.date <= budget.endDate
  );

  const totalExpenses = periodTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = periodTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingBudget = amount - totalExpenses;
  const spentPercentage = amount > 0 ? (totalExpenses / amount) * 100 : 0;
  const remainingPercentage = amount > 0 ? (remainingBudget / amount) * 100 : 0;

  let status: BudgetStatus = "Safe";
  if (spentPercentage > 100) {
    status = "Over Budget";
  } else if (spentPercentage > 80) {
    status = "Warning";
  }

  return {
    amount,
    totalExpenses,
    totalIncome,
    remainingBudget,
    spentPercentage,
    remainingPercentage,
    status,
    transactions: periodTransactions,
  };
}
