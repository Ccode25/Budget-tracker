"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Transaction } from "@/types/transaction";
import type { Budget } from "@/types/budget";
import { MOCK_BUDGETS } from "@/features/budgets/mock/budgets";
import { SAVINGS_GOALS } from "@/features/analytics/mock/analytics";
import { DEMO_TRANSACTIONS } from "@/features/transactions/mock/transactions";
import { getCategoryName, getCategoryColor } from "@/features/categories/mock/categories";
import { calculateBudgetSummary } from "@/features/budgets/utils/budgetUtils";

export interface UseDashboardOptions {
  initialData?: {
    transactions: Transaction[];
    budgets: Budget[];
    goals: any[];
  };
}

export function useDashboard(options?: UseDashboardOptions) {
  const initial = options?.initialData;
  const isAuthenticated = initial !== undefined;

  const [dbData, setDbData] = useState<{
    transactions: Transaction[];
    budgets: Budget[];
    goals: any[];
  }>(() => {
    if (isAuthenticated) {
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
    if (!isAuthenticated) {
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
  }, [isAuthenticated]);

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
    
    // Chronological order running balance calculation
    const chronological = [...uniqueTransactions].sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      if (cmp !== 0) return cmp;
      return a.id.localeCompare(b.id);
    });
    let running = 0;
    const runningMap = new Map<string, number>();
    for (const t of chronological) {
      if (t.type === "income") running += t.amount;
      else if (t.type === "expense") running -= t.amount;
      runningMap.set(t.id, running);
    }

    const recentTransactions = sortedTx.slice(0, 10).map((t) => ({
      ...t,
      categoryName: getCategoryName(t.categoryId),
      categoryColor: getCategoryColor(t.categoryId),
      runningBalance: runningMap.get(t.id) ?? 0,
    }));

    const categorySpentMap: Record<string, number> = {};
    const dailyMap: Record<string, { income: number; expenses: number }> = {};
    for (const t of currentMonthTx) {
      if (!dailyMap[t.date]) {
        dailyMap[t.date] = { income: 0, expenses: 0 };
      }
      if (t.type === "expense") {
        categorySpentMap[t.categoryId] = (categorySpentMap[t.categoryId] || 0) + t.amount;
        dailyMap[t.date].expenses += t.amount;
      } else if (t.type === "income") {
        dailyMap[t.date].income += t.amount;
      }
    }

    const dailyExpenses = Object.keys(dailyMap)
      .sort()
      .map((d) => {
        const [y, m, day] = d.split("-");
        const monthLabel = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1).toLocaleString("en-US", { month: "short" });
        return {
          date: d,
          label: `${monthLabel} ${parseInt(day, 10)}`,
          expenses: Math.round(dailyMap[d].expenses),
          income: Math.round(dailyMap[d].income),
        };
      });

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
      const actualSpent = categorySpentMap[c.categoryId] ?? categorySpentMap[(c as any).id] ?? 0;
      calculatedTotalSpent += actualSpent;
      return {
        ...c,
        spent: actualSpent,
        name: getCategoryName(c.categoryId),
        color: getCategoryColor(c.categoryId),
        pct: c.limit > 0 ? Math.min((actualSpent / c.limit) * 100, 100) : 0,
      };
    });

    let activeBudgetSpent = calculatedTotalSpent;
    if (activeBudget) {
      const summary = calculateBudgetSummary(activeBudget, validTransactions);
      const periodExpenses = summary.totalExpenses;
      const dbSpent = activeBudget.totalSpent ?? activeBudget.totalExpenses ?? 0;
      activeBudgetSpent = Math.max(calculatedTotalSpent, periodExpenses, dbSpent, expenses);
    }

    const activeBudgetLimit = activeBudget ? (activeBudget.amount ?? activeBudget.totalLimit ?? 0) : 0;
    const unbudgetedIncome = Math.max(0, income - activeBudgetLimit);

    const dynamicActiveBudget = activeBudget
      ? {
          ...activeBudget,
          totalSpent: activeBudgetSpent,
          totalExpenses: activeBudgetSpent,
          totalIncome: income,
          unbudgetedIncome,
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
      dailyExpenses,
      budgetCategories,
      activeBudget: dynamicActiveBudget,
      unbudgetedIncome,
      goals: userGoals,
    };
  }, [allTransactions, isAuthenticated, dbData.budgets, dbData.goals]);
}

