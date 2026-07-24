"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Transaction } from "@/types/transaction";
import type { Budget } from "@/types/budget";
import { MOCK_BUDGETS } from "@/features/budgets/mock/budgets";
import { SAVINGS_GOALS } from "@/features/analytics/mock/analytics";
import { DEMO_TRANSACTIONS } from "@/features/transactions/mock/transactions";
import { getCategoryName, getCategoryColor } from "@/features/categories/mock/categories";

export interface UseDashboardOptions {
  initialData?: {
    transactions: Transaction[];
    budgets: Budget[];
    goals: any[];
  };
}

export function useDashboard(options?: UseDashboardOptions) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const initial = options?.initialData;
  const hasServerInitialData =
    (initial?.transactions?.length ?? 0) > 0 ||
    (initial?.budgets?.length ?? 0) > 0 ||
    (initial?.goals?.length ?? 0) > 0;

  const [dbData, setDbData] = useState<{
    transactions: Transaction[];
    budgets: Budget[];
    goals: any[];
  }>(() => {
    if (hasServerInitialData) {
      return {
        transactions: initial?.transactions ?? [],
        budgets: initial?.budgets ?? [],
        goals: initial?.goals ?? [],
      };
    }
    if (typeof window !== "undefined") {
      try {
        const cached = window.sessionStorage.getItem("cache_dashboard_data");
        if (cached) return JSON.parse(cached);
      } catch {
        // fallback
      }
    }
    return {
      transactions: [],
      budgets: [],
      goals: [],
    };
  });

  const [demoTransactions] = useLocalStorage<Transaction[]>(
    "budget_tracker_transactions",
    []
  );

  useEffect(() => {
    if (isAuthenticated && (dbData.transactions.length === 0 || !hasServerInitialData)) {
      fetch("/api/dashboard")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            const newData = {
              transactions: data.transactions || [],
              budgets: data.budgets || [],
              goals: data.goals || [],
            };
            setDbData(newData);
            if (typeof window !== "undefined") {
              try {
                window.sessionStorage.setItem("cache_dashboard_data", JSON.stringify(newData));
              } catch {}
            }
          }
        })
        .catch((err) => console.error("Failed to fetch authenticated dashboard data", err));
    }
  }, [isAuthenticated, hasServerInitialData, dbData.transactions.length]);

  // Determine active transactions: Server DB data if authenticated; Demo data only if in demo mode
  const allTransactions = useMemo(() => {
    if (isAuthenticated) return dbData.transactions;

    if (typeof window !== "undefined") {
      const storedUser = window.localStorage.getItem("budget_tracker_user");
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u?.isDemo) return demoTransactions.length > 0 ? demoTransactions : DEMO_TRANSACTIONS;
        } catch {
          // fallback
        }
      }
    }
    return [];
  }, [isAuthenticated, dbData.transactions, demoTransactions]);

  return useMemo(() => {
    const uniqueMap = new Map<string, Transaction>();
    for (const item of allTransactions) {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    }
    const uniqueTransactions = Array.from(uniqueMap.values());
    const validTransactions = uniqueTransactions.filter((t) => t.status !== "failed");

    const now = new Date();
    const currentYr = now.getFullYear();
    const currentMo = String(now.getMonth() + 1).padStart(2, "0");
    const currentMonthPrefix = `${currentYr}-${currentMo}`;

    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevYr = prevDate.getFullYear();
    const prevMo = String(prevDate.getMonth() + 1).padStart(2, "0");
    const prevMonthPrefix = `${prevYr}-${prevMo}`;

    const currentMonthTx = validTransactions.filter((t) => t.date.startsWith(currentMonthPrefix));
    const prevMonthTx = validTransactions.filter((t) => t.date.startsWith(prevMonthPrefix));

    const income = currentMonthTx
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const expenses = currentMonthTx
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    const prevIncome = prevMonthTx
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const prevExpenses = prevMonthTx
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const incomeTrend = prevIncome > 0 ? ((income - prevIncome) / prevIncome) * 100 : 0;
    const expenseTrend = prevExpenses > 0 ? ((expenses - prevExpenses) / prevExpenses) * 100 : 0;

    const totalAllTimeIncome = validTransactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const totalAllTimeExpenses = validTransactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const currentBalance = totalAllTimeIncome - totalAllTimeExpenses;

    const sortedTx = [...uniqueTransactions].sort((a, b) => b.date.localeCompare(a.date));
    const recentTransactions = sortedTx.slice(0, 10).map((t) => ({
      ...t,
      categoryName: getCategoryName(t.categoryId),
      categoryColor: getCategoryColor(t.categoryId),
    }));

    const categorySpentMap: Record<string, number> = {};
    for (const t of currentMonthTx) {
      if (t.type === "expense") {
        categorySpentMap[t.categoryId] = (categorySpentMap[t.categoryId] || 0) + t.amount;
      }
    }

    let userBudgets: typeof MOCK_BUDGETS = [];
    if (isAuthenticated) {
      userBudgets = dbData.budgets;
    } else if (typeof window !== "undefined") {
      const storedUserStr = window.localStorage.getItem("budget_tracker_user");
      if (storedUserStr) {
        try {
          const u = JSON.parse(storedUserStr);
          if (u?.isDemo) userBudgets = MOCK_BUDGETS;
        } catch {
          userBudgets = [];
        }
      }
    }

    const activeBudget = userBudgets.find((b) => b.isActive) || userBudgets[0] || null;
    let calculatedTotalSpent = 0;
    const budgetCategories = (activeBudget?.categories ?? []).map((c) => {
      const actualSpent = categorySpentMap[c.categoryId] ?? 0;
      calculatedTotalSpent += actualSpent;
      return {
        ...c,
        spent: actualSpent,
        name: getCategoryName(c.categoryId),
        color: getCategoryColor(c.categoryId),
        pct: c.limit > 0 ? Math.min((actualSpent / c.limit) * 100, 100) : 0,
      };
    });

    const dynamicActiveBudget = activeBudget
      ? {
          ...activeBudget,
          totalSpent: calculatedTotalSpent,
        }
      : null;

    let userGoals: any[] = [];
    if (isAuthenticated) {
      userGoals = dbData.goals;
    } else if (typeof window !== "undefined") {
      const storedUserStr = window.localStorage.getItem("budget_tracker_user");
      if (storedUserStr) {
        try {
          const u = JSON.parse(storedUserStr);
          if (u?.isDemo) userGoals = SAVINGS_GOALS;
        } catch {
          userGoals = [];
        }
      }
    }

    return {
      currentBalance,
      income,
      expenses,
      savings,
      savingsRate,
      incomeTrend,
      expenseTrend,
      recentTransactions,
      budgetCategories,
      activeBudget: dynamicActiveBudget,
      goals: userGoals,
    };
  }, [allTransactions, isAuthenticated, dbData.budgets, dbData.goals]);
}

