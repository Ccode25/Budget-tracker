"use client";

import { useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Transaction } from "@/types/transaction";
import { MOCK_TRANSACTIONS } from "@/features/transactions/mock/transactions";
import { MOCK_BUDGETS } from "@/features/budgets/mock/budgets";
import { SAVINGS_GOALS, MONTHLY_DATA } from "@/features/analytics/mock/analytics";
import { getCategoryName, getCategoryColor } from "@/features/categories/mock/categories";

export function useDashboard() {
  const [allTransactions] = useLocalStorage<Transaction[]>(
    "budget_tracker_transactions",
    MOCK_TRANSACTIONS
  );

  return useMemo(() => {
    // Deduplicate array by ID to eliminate any legacy duplicate keys
    const uniqueMap = new Map<string, Transaction>();
    for (const item of allTransactions) {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    }
    const uniqueTransactions = Array.from(uniqueMap.values());

    const validTransactions = uniqueTransactions.filter((t) => t.status !== "failed");

    // Get current month string (e.g. "2026-07")
    const now = new Date();
    const currentYr = now.getFullYear();
    const currentMo = String(now.getMonth() + 1).padStart(2, "0");
    const currentMonthPrefix = `${currentYr}-${currentMo}`;

    // Previous month prefix
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevYr = prevDate.getFullYear();
    const prevMo = String(prevDate.getMonth() + 1).padStart(2, "0");
    const prevMonthPrefix = `${prevYr}-${prevMo}`;

    // Filter current month transactions
    const currentMonthTx = validTransactions.filter((t) => t.date.startsWith(currentMonthPrefix));
    const prevMonthTx = validTransactions.filter((t) => t.date.startsWith(prevMonthPrefix));

    // Calculate current month income & expenses
    const income = currentMonthTx
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const expenses = currentMonthTx
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    // Previous month totals for trends
    const prevIncome = prevMonthTx
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const prevExpenses = prevMonthTx
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const incomeTrend =
      prevIncome > 0
        ? ((income - prevIncome) / prevIncome) * 100
        : 0;
    const expenseTrend =
      prevExpenses > 0
        ? ((expenses - prevExpenses) / prevExpenses) * 100
        : 0;

    // All-time balance computation
    const totalAllTimeIncome = validTransactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const totalAllTimeExpenses = validTransactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const currentBalance = totalAllTimeIncome - totalAllTimeExpenses;

    // Recent transactions sorted by date desc
    const sortedTx = [...uniqueTransactions].sort((a, b) => b.date.localeCompare(a.date));
    const recentTransactions = sortedTx.slice(0, 10).map((t) => ({
      ...t,
      categoryName: getCategoryName(t.categoryId),
      categoryColor: getCategoryColor(t.categoryId),
    }));

    // Calculate actual category spending for current month from transactions
    const categorySpentMap: Record<string, number> = {};
    for (const t of currentMonthTx) {
      if (t.type === "expense") {
        categorySpentMap[t.categoryId] = (categorySpentMap[t.categoryId] || 0) + t.amount;
      }
    }

    const activeBudget = MOCK_BUDGETS.find((b) => b.id === "bgt-001");
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
      goals: SAVINGS_GOALS,
    };
  }, [allTransactions]);
}

