import type { Category } from "@/types/category";

export const MOCK_CATEGORIES: Category[] = [
  // ── Expense Categories ──────────────────────────────────────────────────
  { id: "cat-housing",       name: "Housing",         color: "#7c3aed", icon: "Home",          type: "expense", isDefault: true,  isActive: true },
  { id: "cat-food",          name: "Food & Dining",   color: "#059669", icon: "UtensilsCrossed", type: "expense", isDefault: true,  isActive: true },
  { id: "cat-transport",     name: "Transportation",  color: "#0ea5e9", icon: "Car",            type: "expense", isDefault: true,  isActive: true },
  { id: "cat-shopping",      name: "Shopping",        color: "#f59e0b", icon: "ShoppingBag",    type: "expense", isDefault: true,  isActive: true },
  { id: "cat-utilities",     name: "Utilities",       color: "#6366f1", icon: "Zap",            type: "expense", isDefault: true,  isActive: true },
  { id: "cat-entertainment", name: "Entertainment",   color: "#ec4899", icon: "Tv",             type: "expense", isDefault: true,  isActive: true },
  { id: "cat-health",        name: "Health",          color: "#10b981", icon: "Heart",          type: "expense", isDefault: true,  isActive: true },
  { id: "cat-education",     name: "Education",       color: "#8b5cf6", icon: "GraduationCap",  type: "expense", isDefault: false, isActive: true },
  { id: "cat-travel",        name: "Travel",          color: "#06b6d4", icon: "Plane",          type: "expense", isDefault: false, isActive: true },
  { id: "cat-insurance",     name: "Insurance",       color: "#64748b", icon: "Shield",         type: "expense", isDefault: false, isActive: true },
  { id: "cat-subscriptions", name: "Subscriptions",   color: "#d946ef", icon: "RefreshCw",      type: "expense", isDefault: false, isActive: true },
  { id: "cat-personal",      name: "Personal Care",   color: "#fb7185", icon: "Sparkles",       type: "expense", isDefault: false, isActive: true },
  { id: "cat-gifts",         name: "Gifts & Charity", color: "#f43f5e", icon: "Gift",           type: "expense", isDefault: false, isActive: true },
  { id: "cat-pets",          name: "Pets",            color: "#a78bfa", icon: "PawPrint",       type: "expense", isDefault: false, isActive: true },
  // ── Income Categories ───────────────────────────────────────────────────
  { id: "cat-salary",        name: "Salary",          color: "#22c55e", icon: "Briefcase",      type: "income",  isDefault: true,  isActive: true },
  { id: "cat-freelance",     name: "Freelance",       color: "#16a34a", icon: "Laptop",         type: "income",  isDefault: false, isActive: true },
  { id: "cat-investment",    name: "Investment",      color: "#15803d", icon: "TrendingUp",     type: "income",  isDefault: false, isActive: true },
  { id: "cat-rental",        name: "Rental Income",   color: "#166534", icon: "Building2",      type: "income",  isDefault: false, isActive: true },
  // ── Transfer / Other ────────────────────────────────────────────────────
  { id: "cat-transfer",      name: "Transfer",        color: "#94a3b8", icon: "ArrowLeftRight", type: "both",    isDefault: false, isActive: true },
  { id: "cat-other",         name: "Other",           color: "#6b7280", icon: "MoreHorizontal", type: "both",    isDefault: true,  isActive: true },
];

export const getCategoryById = (id: string): Category | undefined =>
  MOCK_CATEGORIES.find((c) => c.id === id);

export const getCategoryColor = (id: string): string =>
  getCategoryById(id)?.color ?? "#6b7280";

export const getCategoryName = (id: string): string =>
  getCategoryById(id)?.name ?? "Other";
