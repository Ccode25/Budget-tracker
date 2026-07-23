"use client";

import { useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { MOCK_TRANSACTIONS } from "@/features/transactions/mock/transactions";
import { MOCK_CATEGORIES } from "@/features/categories/mock/categories";
import type { Transaction } from "@/types/transaction";
import type { MonthlyData, CategoryBreakdown, CashFlowEntry } from "@/types/analytics";

export function useAnalytics() {
  const [allTransactions] = useLocalStorage<Transaction[]>(
    "budget_tracker_transactions",
    MOCK_TRANSACTIONS
  );

  return useMemo(() => {
    const valid = allTransactions.filter((t) => t.status !== "failed");

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

        // Current month category breakdown (e.g. 2026-07)
        if (t.date.startsWith("2026-07")) {
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
      const catObj = MOCK_CATEGORIES.find((c) => c.id === catId);
      return {
        categoryId: catId,
        categoryName: catObj?.name ?? catId,
        color: catObj?.color ?? "#6b7280",
        amount: data.amount,
        percentage: totalCurrentMonthExpense > 0 ? (data.amount / totalCurrentMonthExpense) * 100 : 0,
        transactionCount: data.count,
      };
    });

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
    const monthsCount = Math.max(1, sortedMonths.length);

    return {
      monthlyTrends: monthlyTrends.length > 0 ? monthlyTrends : [],
      categoryBreakdown,
      summary: {
        totalIncome,
        totalExpenses,
        netSavings,
        savingsRate,
        avgMonthlyExpense: totalExpenses / monthsCount,
      },
    };
  }, [allTransactions]);
}

