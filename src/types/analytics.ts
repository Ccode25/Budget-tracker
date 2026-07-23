export interface MonthlyData {
  month: string;   // "Jan", "Feb", ...
  year: number;
  income: number;
  expenses: number;
  savings: number;
  balance: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface CashFlowEntry {
  date: string;
  inflow: number;
  outflow: number;
  net: number;
  balance: number;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export type AnalyticsPeriod = "1m" | "3m" | "6m" | "1y";

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  avgMonthlyExpense: number;
  topCategory: string;
  transactionCount: number;
}
