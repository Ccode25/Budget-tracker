"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { MOCK_BUDGETS } from "../mock/budgets";
import { getCategoryName, getCategoryColor } from "@/features/categories/mock/categories";
import type { Budget } from "@/types/budget";
import type { Transaction } from "@/types/transaction";

export function useBudgets() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/dashboard")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            if (data.budgets) setBudgets(data.budgets);
            if (data.transactions) setTransactions(data.transactions);
          }
        })
        .catch((err) => console.error("Failed to fetch user budgets", err));
    } else if (typeof window !== "undefined") {
      const storedUser = window.localStorage.getItem("budget_tracker_user");
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u?.isDemo) setBudgets(MOCK_BUDGETS);
        } catch {
          setBudgets([]);
        }
      }
    }
  }, [isAuthenticated]);

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
        const categories = (b.categories || []).map((c) => {
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

  const addBudget = async (budget: Omit<Budget, "id">) => {
    if (isAuthenticated) {
      try {
        const res = await fetch("/api/budgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(budget),
        });
        if (res.ok) {
          const data = await res.json();
          setBudgets((prev) => [data.data, ...prev]);
        }
      } catch (err) {
        console.error("Failed to save budget to database:", err);
      }
      return;
    }
    const newBgt: Budget = {
      ...budget,
      id: `bgt-${Date.now()}`,
    };
    setBudgets((prev) => [newBgt, ...prev]);
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    if (isAuthenticated) {
      setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
      try {
        await fetch(`/api/budgets/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
      } catch (err) {
        console.error("Failed to update budget in database:", err);
      }
      return;
    }
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBudget = async (id: string) => {
    if (isAuthenticated) {
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      try {
        await fetch(`/api/budgets/${id}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Failed to delete budget from database:", err);
      }
      return;
    }
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const getEnrichedBudget = (id: string) => {
    const b = activeBudgets.find((b) => b.id === id) || budgets.find((b) => b.id === id);
    if (!b) return null;
    return {
      ...b,
      categories: (b.categories || []).map((c) => {
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
