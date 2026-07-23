export type BudgetPeriod = "monthly" | "annual" | "weekly" | "custom";

export interface BudgetCategoryAllocation {
  categoryId: string;
  limit: number;
  spent: number;
}

export interface Budget {
  id: string;
  name: string;
  period: BudgetPeriod;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  categories: BudgetCategoryAllocation[];
  totalLimit: number; // sum of category limits
  totalSpent: number; // sum of category spent
  color: string;      // accent color for card
  isActive: boolean;
}
