import type { MonthlyData, CategoryBreakdown, CashFlowEntry } from "@/types/analytics";

export const MONTHLY_DATA: MonthlyData[] = [
  { month: "Jan", year: 2026, income: 7350,  expenses: 3124, savings: 4226, balance: 18450 },
  { month: "Feb", year: 2026, income: 8015,  expenses: 2891, savings: 5124, balance: 23574 },
  { month: "Mar", year: 2026, income: 7040,  expenses: 3340, savings: 3700, balance: 27274 },
  { month: "Apr", year: 2026, income: 8250,  expenses: 3187, savings: 5063, balance: 32337 },
  { month: "May", year: 2026, income: 7108,  expenses: 3398, savings: 3710, balance: 36047 },
  { month: "Jun", year: 2026, income: 8175,  expenses: 3012, savings: 5163, balance: 41210 },
  { month: "Jul", year: 2026, income: 6542,  expenses: 2848, savings: 3694, balance: 44904 },
];

export const CATEGORY_BREAKDOWN_JULY: CategoryBreakdown[] = [
  { categoryId: "cat-housing",       categoryName: "Housing",         color: "#7c3aed", amount: 1200.00, percentage: 42.2, transactionCount: 1  },
  { categoryId: "cat-food",          categoryName: "Food & Dining",   color: "#059669", amount:  459.80, percentage: 16.2, transactionCount: 7  },
  { categoryId: "cat-transport",     categoryName: "Transportation",  color: "#0ea5e9", amount:  247.60, percentage:  8.7, transactionCount: 4  },
  { categoryId: "cat-shopping",      categoryName: "Shopping",        color: "#f59e0b", amount:  311.74, percentage: 11.0, transactionCount: 5  },
  { categoryId: "cat-utilities",     categoryName: "Utilities",       color: "#6366f1", amount:  309.69, percentage: 10.9, transactionCount: 5  },
  { categoryId: "cat-health",        categoryName: "Health",          color: "#10b981", amount:  129.99, percentage:  4.6, transactionCount: 2  },
  { categoryId: "cat-entertainment", categoryName: "Entertainment",   color: "#ec4899", amount:   25.98, percentage:  0.9, transactionCount: 2  },
  { categoryId: "cat-subscriptions", categoryName: "Subscriptions",   color: "#d946ef", amount:   62.98, percentage:  2.2, transactionCount: 3  },
  { categoryId: "cat-other",         categoryName: "Other",           color: "#6b7280", amount:   99.83, percentage:  3.5, transactionCount: 3  },
];

export const CASH_FLOW: CashFlowEntry[] = [
  { date: "2026-01-15", inflow: 5250, outflow: 2100, net:  3150, balance: 18450 },
  { date: "2026-02-15", inflow: 7750, outflow: 2100, net:  5650, balance: 24100 },
  { date: "2026-03-15", inflow: 6850, outflow: 2900, net:  3950, balance: 28050 },
  { date: "2026-04-15", inflow: 8250, outflow: 3100, net:  5150, balance: 33200 },
  { date: "2026-05-15", inflow: 7108, outflow: 3400, net:  3708, balance: 36908 },
  { date: "2026-06-15", inflow: 7450, outflow: 2800, net:  4650, balance: 41558 },
  { date: "2026-07-15", inflow: 5550, outflow: 2100, net:  3450, balance: 45008 },
];

export const SAVINGS_GOALS = [
  { id: "goal-001", name: "Emergency Fund", target: 10000, saved: 8500, deadline: "2026-12-31", color: "#7c3aed", icon: "Shield" },
  { id: "goal-002", name: "New Car",        target: 25000, saved: 3200, deadline: "2028-06-30", color: "#0ea5e9", icon: "Car"    },
  { id: "goal-003", name: "Europe Trip",    target: 5000,  saved: 1800, deadline: "2027-05-01", color: "#f59e0b", icon: "Plane"  },
  { id: "goal-004", name: "Home Down Pay",  target: 60000, saved: 9000, deadline: "2029-01-01", color: "#059669", icon: "Home"   },
];
