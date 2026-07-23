"use client";

import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { MOCK_BUDGETS } from "../mock/budgets";
import { getCategoryName, getCategoryColor } from "@/features/categories/mock/categories";
import type { Budget } from "@/types/budget";
import type { Transaction } from "@/types/transaction";

function getInitialBudgets(): Budget[] {
  if (typeof window === "undefined") return [];

  const storedBudgets = window.localStorage.getItem("budget_tracker_budgets");
  if (storedBudgets) {
    try {
      return JSON.parse(storedBudgets);
    } catch {
      // Fallback
    }
  }

  const storedUserStr = window.localStorage.getItem("budget_tracker_user");
  if (storedUserStr) {
    try {
      const u = JSON.parse(storedUserStr);
      if (u?.isDemo) return MOCK_BUDGETS;
    } catch {
      // Fallback
    }
  }

  // Real logged-in user starts with empty budgets list []
  return [];
}

export function useBudgets() {
  const [transactions] = useLocalStorage<Transaction[]>(
    "budget_tracker_transactions",
    []
  );
  const [budgets, setBudgets] = useState<Budget[]>(getInitialBudgets);

  // Sync to localStorage
  const updateBudgetsState = (newBudgets: Budget[] | ((prev: Budget[]) => Budget[])) => {
    setBudgets((prev) => {
      const next = typeof newBudgets === "function" ? newBudgets(prev) : newBudgets;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("budget_tracker_budgets", JSON.stringify(next));
      }
      return next;
    });
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Compute category spending from transactions for current month
  const categorySpentMap = useMemo(() => {
    const map: Record<string, number> = {};
    const valid = transactions.filter((t) => t.status !== "failed" && t.type === "expense");
    for (const t of valid) {
      map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
    }
    return map;
  }, [transactions]);

  const activeBudgets = useMemo(() => {
    return budgets
      .filter((b) => b.isActive)
      .map((b) => {
        let totalSpent = 0;
        const categories = b.categories.map((c) => {
          const spent = categorySpentMap[c.categoryId] ?? 0;
          totalSpent += spent;
          return { ...c, spent };
        });
        return {
          ...b,
          totalSpent,
          categories,
        };
      });
  }, [budgets, categorySpentMap]);

  const addBudget = (budget: Omit<Budget, "id">) => {
    const newBgt: Budget = {
      ...budget,
      id: `bgt-${Date.now()}`,
    };
    updateBudgetsState((prev) => [newBgt, ...prev]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    updateBudgetsState((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBudget = (id: string) => {
    updateBudgetsState((prev) => prev.filter((b) => b.id !== id));
  };

  const getEnrichedBudget = (id: string) => {
    const b = activeBudgets.find((b) => b.id === id) || budgets.find((b) => b.id === id);
    if (!b) return null;
    return {
      ...b,
      categories: b.categories.map((c) => {
        const spent = categorySpentMap[c.categoryId] ?? c.spent;
        return {
          ...c,
          spent,
          name: getCategoryName(c.categoryId),
          color: getCategoryColor(c.categoryId),
          pct: c.limit > 0 ? (spent / c.limit) * 100 : 0,
        };
      }),
    };
  };

  return {
    budgets,
    activeBudgets,
    selectedId,
    setSelectedId,
    addBudget,
    updateBudget,
    deleteBudget,
    getEnrichedBudget,
  };
}
