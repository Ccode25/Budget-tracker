"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DEMO_TRANSACTIONS } from "@/features/transactions/mock/transactions";
import { MOCK_CATEGORIES, getCategoryName, getCategoryColor } from "@/features/categories/mock/categories";
import type { Transaction } from "@/types/transaction";
import type { MonthlyData, CategoryBreakdown } from "@/types/analytics";

export interface UseAnalyticsOptions {
  initialTransactions?: Transaction[];
}

export function useAnalytics(options?: UseAnalyticsOptions) {
  const { initialTransactions } = options ?? {};
  const isAuthenticated = initialTransactions !== undefined;

  const [dbTransactions, setDbTransactions] = useState<Transaction[]>(
    initialTransactions ?? []
  );
  const [demoTransactions] = useLocalStorage<Transaction[]>(
    "budget_tracker_transactions",
    []
  );

  useEffect(() => {
    if (initialTransactions && initialTransactions.length > 0) {
      setDbTransactions(initialTransactions);
    }
  }, [initialTransactions]);

  useEffect(() => {
    if (isAuthenticated && initialTransactions === undefined) {
      fetch("/api/transactions")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.data) {
            setDbTransactions(data.data);
          }
        })
        .catch((err) => console.error("Failed to fetch analytics transactions", err));
    }
  }, [isAuthenticated, initialTransactions]);

  const activeTransactions = useMemo(() => {
    if (isAuthenticated) return dbTransactions;

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
  }, [isAuthenticated, dbTransactions, demoTransactions]);

  return useMemo(() => {
    const valid = activeTransactions.filter((t) => t.status !== "failed");

    // Get current YYYY-MM prefix dynamically
    const now = new Date();
    const currentYr = now.getFullYear();
    const currentMo = String(now.getMonth() + 1).padStart(2, "0");
    const currentMonthPrefix = `${currentYr}-${currentMo}`;

    // Group transactions by YYYY-MM
    const monthlyMap: Record<string, { income: number; expenses: number }> = {};
    const categoryMap: Record<string, { amount: number; count: number }> = {};

    let totalIncome = 0;
    let totalExpenses = 0;

    for (const t of valid) {
      const yearMonth = t.date.slice(0, 7); // e.g. "2026-07"
      if (!monthlyMap[yearMonth]) {
        monthlyMap[yearMonth] = { income: 0, expenses: 0 };
      }

      if (t.type === "income") {
        monthlyMap[yearMonth].income += t.amount;
        totalIncome += t.amount;
      } else if (t.type === "expense") {
        monthlyMap[yearMonth].expenses += t.amount;
        totalExpenses += t.amount;

        // Current month category breakdown
        if (t.date.startsWith(currentMonthPrefix)) {
          if (!categoryMap[t.categoryId]) {
            categoryMap[t.categoryId] = { amount: 0, count: 0 };
          }
          categoryMap[t.categoryId].amount += t.amount;
          categoryMap[t.categoryId].count += 1;
        }
      }
    }

    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyMap).sort();
    let runningBalance = 0;
    const monthlyTrends: MonthlyData[] = sortedMonths.map((ym) => {
      const [yearStr, monthStr] = ym.split("-");
      const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
      const monthLabel = dateObj.toLocaleString("en-US", { month: "short" });
      const inc = monthlyMap[ym].income;
      const exp = monthlyMap[ym].expenses;
      const sav = inc - exp;
      runningBalance += sav;

      return {
        month: monthLabel,
        year: parseInt(yearStr, 10),
        income: Math.round(inc),
        expenses: Math.round(exp),
        savings: Math.round(sav),
        balance: Math.round(runningBalance),
      };
    });

    // Category breakdown for current month
    const totalCurrentMonthExpense = Object.values(categoryMap).reduce((s, c) => s + c.amount, 0);
    const categoryBreakdown: CategoryBreakdown[] = Object.entries(categoryMap).map(([catId, data]) => {
      return {
        categoryId: catId,
        categoryName: getCategoryName(catId),
        color: getCategoryColor(catId),
        amount: data.amount,
        percentage: totalCurrentMonthExpense > 0 ? (data.amount / totalCurrentMonthExpense) * 100 : 0,
        transactionCount: data.count,
      };
    });

    // Daily Expenses trend calculation for current month
    const dailyMap: Record<string, { income: number; expenses: number }> = {};
    for (const t of valid) {
      if (t.date.startsWith(currentMonthPrefix)) {
        if (!dailyMap[t.date]) {
          dailyMap[t.date] = { income: 0, expenses: 0 };
        }
        if (t.type === "expense") dailyMap[t.date].expenses += t.amount;
        else if (t.type === "income") dailyMap[t.date].income += t.amount;
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

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
    const monthsCount = Math.max(1, sortedMonths.length);

    return {
      monthlyTrends: monthlyTrends.length > 0 ? monthlyTrends : [],
      dailyExpenses,
      categoryBreakdown,
      summary: {
        totalIncome,
        totalExpenses,
        netSavings,
        savingsRate,
        avgMonthlyExpense: totalExpenses / monthsCount,
      },
    };
  }, [activeTransactions]);
}

