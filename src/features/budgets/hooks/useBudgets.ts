"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { MOCK_BUDGETS } from "../mock/budgets";
import { getCategoryName, getCategoryColor } from "@/features/categories/mock/categories";
import type { Budget } from "@/types/budget";
import type { Transaction } from "@/types/transaction";
import { calculateBudgetSummary, checkBudgetOverlap } from "../utils/budgetUtils";

export interface UseBudgetsOptions {
  initialBudgets?: Budget[];
  initialTransactions?: Transaction[];
}

export function useBudgets(options?: UseBudgetsOptions) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const { initialBudgets, initialTransactions } = options ?? {};

  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets ?? []);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        if (data.budgets) setBudgets(data.budgets);
        if (data.transactions) setTransactions(data.transactions);
      }
    } catch (err) {
      console.error("Failed to fetch user budgets", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && initialBudgets === undefined && initialTransactions === undefined) {
      fetchUserData();
    } else if (!isAuthenticated && typeof window !== "undefined") {
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
  }, [isAuthenticated, initialBudgets, initialTransactions, fetchUserData]);

  const activeBudgets = useMemo(() => {
    return budgets
      .filter((b) => b.isActive !== false)
      .map((b) => {
        const summary = calculateBudgetSummary(b, transactions);
        const categories = (b.categories || []).map((c) => {
          const spent = transactions
            .filter(
              (t) =>
                t.status !== "failed" &&
                t.type === "expense" &&
                t.categoryId === c.categoryId &&
                t.date >= b.startDate &&
                t.date <= b.endDate
            )
            .reduce((sum, t) => sum + t.amount, 0);
          return { ...c, spent };
        });

        return {
          ...b,
          amount: summary.amount,
          totalLimit: summary.amount,
          totalSpent: summary.totalExpenses,
          totalExpenses: summary.totalExpenses,
          totalIncome: summary.totalIncome,
          remainingBudget: summary.remainingBudget,
          spentPercentage: summary.spentPercentage,
          remainingPercentage: summary.remainingPercentage,
          status: summary.status,
          transactions: summary.transactions,
          categories,
        };
      });
  }, [budgets, transactions]);

  const addBudget = async (budgetData: Partial<Budget> & { name: string; startDate: string; endDate: string; amount: number }): Promise<{ success: boolean; error?: string }> => {
    const amount = budgetData.amount ?? budgetData.totalLimit ?? 0;
    const newBudgetPayload = {
      name: budgetData.name,
      startDate: budgetData.startDate,
      endDate: budgetData.endDate,
      amount,
      totalLimit: amount,
      period: budgetData.period || "monthly",
      color: budgetData.color || "#7c3aed",
      isActive: budgetData.isActive ?? true,
      categories: budgetData.categories || [],
    };

    if (isAuthenticated) {
      try {
        const res = await fetch("/api/budgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBudgetPayload),
        });
        const data = await res.json();
        if (res.ok) {
          setBudgets((prev) => [data.data, ...prev]);
          toast.success("Budget created successfully");
          return { success: true };
        } else {
          toast.error(data.error || "Failed to create budget");
          return { success: false, error: data.error };
        }
      } catch (err: any) {
        console.error("Failed to save budget to database:", err);
        toast.error("Network error while creating budget");
        return { success: false, error: err.message };
      }
    }

    // Unauthenticated/Demo mode date overlap check
    const isOverlapping = budgets.some((b) =>
      checkBudgetOverlap(newBudgetPayload.startDate, newBudgetPayload.endDate, b.startDate, b.endDate)
    );
    if (isOverlapping) {
      const errMsg = "This budget overlaps an existing budget period.";
      toast.error(errMsg);
      return { success: false, error: errMsg };
    }

    const newBgt: Budget = {
      ...newBudgetPayload,
      id: `bgt-${Date.now()}`,
      totalSpent: 0,
      totalExpenses: 0,
      totalIncome: 0,
      remainingBudget: amount,
      spentPercentage: 0,
      remainingPercentage: 100,
      status: "Safe",
      transactions: [],
    };
    setBudgets((prev) => [newBgt, ...prev]);
    toast.success("Budget created successfully");
    return { success: true };
  };

  const updateBudget = async (id: string, updates: Partial<Budget>): Promise<{ success: boolean; error?: string }> => {
    if (isAuthenticated) {
      let previous: Budget[] = [];
      setBudgets((prev) => {
        previous = prev;
        return prev.map((b) => (b.id === id ? { ...b, ...updates } : b));
      });
      try {
        const res = await fetch(`/api/budgets/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (!res.ok) {
          setBudgets(previous);
          toast.error(data.error || "Failed to update budget");
          return { success: false, error: data.error };
        }
        setBudgets((prev) => prev.map((b) => (b.id === id ? data.data : b)));
        toast.success("Budget updated successfully");
        return { success: true };
      } catch (err: any) {
        setBudgets(previous);
        console.error("Failed to update budget in database:", err);
        toast.error("Network error while updating budget");
        return { success: false, error: err.message };
      }
    }

    const current = budgets.find((b) => b.id === id);
    if (current) {
      const newStart = updates.startDate || current.startDate;
      const newEnd = updates.endDate || current.endDate;
      const isOverlapping = budgets.filter((b) => b.id !== id).some((b) =>
        checkBudgetOverlap(newStart, newEnd, b.startDate, b.endDate)
      );
      if (isOverlapping) {
        const errMsg = "This budget overlaps an existing budget period.";
        toast.error(errMsg);
        return { success: false, error: errMsg };
      }
    }

    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    toast.success("Budget updated successfully");
    return { success: true };
  };

  const deleteBudget = async (id: string) => {
    if (isAuthenticated) {
      let previous: Budget[] = [];
      setBudgets((prev) => {
        previous = prev;
        return prev.filter((b) => b.id !== id);
      });
      if (selectedId === id) setSelectedId(null);
      try {
        const res = await fetch(`/api/budgets/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          setBudgets(previous);
          const data = await res.json().catch(() => ({}));
          toast.error(data.error || "Failed to delete budget");
        } else {
          toast.success("Budget deleted successfully");
        }
      } catch (err) {
        setBudgets(previous);
        console.error("Failed to delete budget from database:", err);
        toast.error("Network error while deleting budget");
      }
      return;
    }
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
    toast.success("Budget deleted successfully");
  };

  const selectedBudget = useMemo(() => {
    if (!selectedId) return null;
    return activeBudgets.find((b) => b.id === selectedId) || null;
  }, [activeBudgets, selectedId]);

  const getEnrichedBudget = (id: string) => {
    const b = activeBudgets.find((b) => b.id === id) || budgets.find((b) => b.id === id);
    if (!b) return null;
    return {
      ...b,
      categories: (b.categories || []).map((c) => {
        const spent = c.spent;
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
    transactions,
    setTransactions,
    selectedId,
    setSelectedId,
    selectedBudget,
    addBudget,
    updateBudget,
    deleteBudget,
    getEnrichedBudget,
    refetch: fetchUserData,
  };
}

