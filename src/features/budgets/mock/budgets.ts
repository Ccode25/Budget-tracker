import type { Budget } from "@/types/budget";

export const MOCK_BUDGETS: Budget[] = [
  {
    id: "bgt-001",
    name: "Monthly Living",
    period: "monthly",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    totalLimit: 4000,
    totalSpent: 2847.61,
    color: "#7c3aed",
    isActive: true,
    categories: [
      { categoryId: "cat-housing",       limit: 1500, spent: 1200.00 },
      { categoryId: "cat-food",          limit: 600,  spent: 459.80  },
      { categoryId: "cat-transport",     limit: 300,  spent: 247.60  },
      { categoryId: "cat-utilities",     limit: 350,  spent: 309.69  },
      { categoryId: "cat-health",        limit: 200,  spent: 129.99  },
      { categoryId: "cat-entertainment", limit: 150,  spent: 25.98   },
      { categoryId: "cat-personal",      limit: 100,  spent: 0       },
      { categoryId: "cat-shopping",      limit: 400,  spent: 311.74  },
      { categoryId: "cat-subscriptions", limit: 100,  spent: 62.98   },
      { categoryId: "cat-other",         limit: 300,  spent: 99.83   },
    ],
  },
  {
    id: "bgt-002",
    name: "Emergency Fund Build",
    period: "annual",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    totalLimit: 10000,
    totalSpent: 5800,
    color: "#059669",
    isActive: true,
    categories: [
      { categoryId: "cat-other", limit: 10000, spent: 5800 },
    ],
  },
  {
    id: "bgt-003",
    name: "Travel Fund",
    period: "custom",
    startDate: "2026-05-01",
    endDate: "2026-09-30",
    totalLimit: 3000,
    totalSpent: 800,
    color: "#06b6d4",
    isActive: true,
    categories: [
      { categoryId: "cat-travel", limit: 3000, spent: 800 },
    ],
  },
  {
    id: "bgt-004",
    name: "Tech & Tools",
    period: "monthly",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    totalLimit: 300,
    totalSpent: 149.49,
    color: "#f59e0b",
    isActive: true,
    categories: [
      { categoryId: "cat-subscriptions", limit: 150, spent: 64.98   },
      { categoryId: "cat-utilities",     limit: 150, spent: 134.50  },
    ],
  },
  {
    id: "bgt-005",
    name: "Investment Goal",
    period: "annual",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    totalLimit: 15000,
    totalSpent: 9200,
    color: "#10b981",
    isActive: false,
    categories: [
      { categoryId: "cat-investment", limit: 15000, spent: 9200 },
    ],
  },
];

export const getBudgetById = (id: string) =>
  MOCK_BUDGETS.find((b) => b.id === id);

export const ACTIVE_BUDGETS = MOCK_BUDGETS.filter((b) => b.isActive);
