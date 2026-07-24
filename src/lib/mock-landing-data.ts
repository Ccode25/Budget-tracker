export interface MockTransaction {
  id: string;
  description: string;
  category: string;
  categoryColor: string;
  amount: number;
  type: "expense" | "income";
  date: string;
  merchant: string;
}

export interface MockBudget {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  limit: number;
  spent: number;
  category: string;
  color: string;
}

export interface MockGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  icon: string;
}

export interface MockCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  budgetLimit: number;
  spent: number;
  transactionCount: number;
}

export const LANDING_MOCK_STATS = {
  totalBalance: 148500,
  monthlyIncome: 75000,
  monthlyExpenses: 32450,
  monthlyBudget: 50000,
  totalSaved: 24000,
  savingsRate: 42.5,
};

export const LANDING_MOCK_BUDGETS: MockBudget[] = [
  {
    id: "b1",
    name: "Food & Dining",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    limit: 15000,
    spent: 12450,
    category: "Food & Dining",
    color: "#f59e0b",
  },
  {
    id: "b2",
    name: "Utilities & Bills",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    limit: 10000,
    spent: 8200,
    category: "Utilities",
    color: "#3b82f6",
  },
  {
    id: "b3",
    name: "Transportation",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    limit: 6000,
    spent: 4500,
    category: "Transportation",
    color: "#10b981",
  },
  {
    id: "b4",
    name: "Entertainment & Leisure",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    limit: 5000,
    spent: 3850,
    category: "Entertainment",
    color: "#ec4899",
  },
  {
    id: "b5",
    name: "Shopping & Lifestyle",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    limit: 6000,
    spent: 3450,
    category: "Shopping",
    color: "#8b5cf6",
  },
];

export const LANDING_MOCK_TRANSACTIONS: MockTransaction[] = [
  {
    id: "t1",
    description: "Monthly Salary Deposit",
    category: "Income",
    categoryColor: "#10b981",
    amount: 75000,
    type: "income",
    date: "2026-07-01",
    merchant: "Tech Corp Inc.",
  },
  {
    id: "t2",
    description: "SM Supermarket Groceries",
    category: "Food & Dining",
    categoryColor: "#f59e0b",
    amount: 4320,
    type: "expense",
    date: "2026-07-05",
    merchant: "SM Supermarket",
  },
  {
    id: "t3",
    description: "Meralco Electricity Bill",
    category: "Utilities",
    categoryColor: "#3b82f6",
    amount: 4850,
    type: "expense",
    date: "2026-07-10",
    merchant: "Meralco",
  },
  {
    id: "t4",
    description: "Shell V-Power Gas Refill",
    category: "Transportation",
    categoryColor: "#10b981",
    amount: 2450,
    type: "expense",
    date: "2026-07-12",
    merchant: "Shell Station",
  },
  {
    id: "t5",
    description: "Netflix Premium 4K",
    category: "Entertainment",
    categoryColor: "#ec4899",
    amount: 549,
    type: "expense",
    date: "2026-07-15",
    merchant: "Netflix",
  },
  {
    id: "t6",
    description: "Starbucks Coffee & Pastry",
    category: "Food & Dining",
    categoryColor: "#f59e0b",
    amount: 480,
    type: "expense",
    date: "2026-07-18",
    merchant: "Starbucks",
  },
  {
    id: "t7",
    description: "Uniqlo Wardrobe Staples",
    category: "Shopping",
    categoryColor: "#8b5cf6",
    amount: 3450,
    type: "expense",
    date: "2026-07-20",
    merchant: "Uniqlo PH",
  },
  {
    id: "t8",
    description: "PLDT Home Fiber Internet",
    category: "Utilities",
    categoryColor: "#3b82f6",
    amount: 2399,
    type: "expense",
    date: "2026-07-22",
    merchant: "PLDT Telecom",
  },
];

export const LANDING_MOCK_GOALS: MockGoal[] = [
  {
    id: "g1",
    title: "Emergency Safety Net Fund",
    targetAmount: 100000,
    currentAmount: 78500,
    targetDate: "2026-12-31",
    category: "Savings",
    icon: "ShieldCheck",
  },
  {
    id: "g2",
    title: "Japan Autumn Vacation 2026",
    targetAmount: 80000,
    currentAmount: 52000,
    targetDate: "2026-10-15",
    category: "Travel",
    icon: "Plane",
  },
  {
    id: "g3",
    title: "M3 MacBook Pro Upgrade",
    targetAmount: 120000,
    currentAmount: 108000,
    targetDate: "2026-08-30",
    category: "Gadgets",
    icon: "Laptop",
  },
];

export const LANDING_MOCK_CATEGORIES: MockCategory[] = [
  { id: "c1", name: "Food & Dining", color: "#f59e0b", icon: "Utensils", budgetLimit: 15000, spent: 12450, transactionCount: 14 },
  { id: "c2", name: "Utilities", color: "#3b82f6", icon: "Zap", budgetLimit: 10000, spent: 8200, transactionCount: 6 },
  { id: "c3", name: "Transportation", color: "#10b981", icon: "Car", budgetLimit: 6000, spent: 4500, transactionCount: 8 },
  { id: "c4", name: "Entertainment", color: "#ec4899", icon: "Tv", budgetLimit: 5000, spent: 3850, transactionCount: 5 },
  { id: "c5", name: "Shopping", color: "#8b5cf6", icon: "ShoppingBag", budgetLimit: 6000, spent: 3450, transactionCount: 7 },
  { id: "c6", name: "Healthcare", color: "#ef4444", icon: "HeartPulse", budgetLimit: 5000, spent: 1200, transactionCount: 2 },
];

export const LANDING_MOCK_MONTHLY_TRENDS = [
  { month: "Feb", income: 68000, expenses: 31000, savings: 37000 },
  { month: "Mar", income: 70000, expenses: 34000, savings: 36000 },
  { month: "Apr", income: 72000, expenses: 29500, savings: 42500 },
  { month: "May", income: 75000, expenses: 35000, savings: 40000 },
  { month: "Jun", income: 75000, expenses: 30800, savings: 44200 },
  { month: "Jul", income: 75000, expenses: 32450, savings: 42550 },
];

export const LANDING_MOCK_TESTIMONIALS = [
  {
    quote: "BudgetTracker completely changed how I manage my monthly salary. The non-overlapping budget dates mean zero confusion when paydays roll around!",
    author: "Samantha Cruz",
    role: "Senior UX Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    rating: 5,
  },
  {
    quote: "The bank statement CSV importer saved me hours of manual data entry every month. It parsed 80+ transactions flawlessly in seconds.",
    author: "Marcus Vance",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    rating: 5,
  },
  {
    quote: "Finally a finance app that looks like Revolut but gives me full control over custom PHP/Peso budgets and savings goal milestones.",
    author: "Elena Rostova",
    role: "Financial Analyst",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    rating: 5,
  },
];

export const LANDING_MOCK_FAQS = [
  {
    question: "Do I need a credit card or subscription to start?",
    answer: "No! You can log in instantly with your Google account. All core features including budget tracking, analytics, and CSV bank statement imports are completely free.",
  },
  {
    question: "How does the monthly budget date-range validation work?",
    answer: "BudgetTracker enforces strict non-overlapping budget periods. If you create a budget for July 1–31, creating another budget7381 spanning July 15–August 15 will be automatically validated and prevented, avoiding double-counting.",
  },
  {
    question: "How are my transactions assigned to monthly budgets?",
    answer: "Transactions are automatically assigned to their respective budget period based on their transaction date. No manual linking or tagging is required.",
  },
  {
    question: "Can I import bank statements from BDO, BPI, UnionBank, or GCash?",
    answer: "Yes! Our CSV & XLSX statement importer features a smart column mapper allowing you to upload CSV/XLSX files from any bank or e-wallet.",
  },
  {
    question: "Is my financial data secure?",
    answer: "Absolutely. We utilize Google OAuth 2.0 for single sign-on with 256-bit SSL encryption and serverless PostgreSQL database isolation.",
  },
  {
    question: "Is there multi-currency support?",
    answer: "Yes, BudgetTracker natively supports Philippine Peso (₱) along with USD ($), EUR (€), GBP (£), and JPY (¥).",
  },
];
