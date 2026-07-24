import type { Transaction } from "./transaction";

export type BudgetPeriod = "monthly" | "annual" | "weekly" | "custom";
export type BudgetStatus = "Safe" | "Warning" | "Over Budget";

export interface BudgetCategoryAllocation {
  categoryId: string;
  limit: number;
  spent: number;
}

export interface Budget {
  id: string;
  name: string;
  period?: BudgetPeriod;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  amount?: number;    // budget amount / totalLimit
  totalLimit?: number; // alias for amount for backward compatibility
  totalSpent?: number; // sum of category spent or total expenses
  categories?: BudgetCategoryAllocation[];
  color?: string;      // accent color for card
  isActive?: boolean;

  // Dynamically computed fields (never stored in DB)
  totalExpenses?: number;
  totalIncome?: number;
  remainingBudget?: number;
  spentPercentage?: number;
  remainingPercentage?: number;
  status?: BudgetStatus;
  transactions?: Transaction[];
}


