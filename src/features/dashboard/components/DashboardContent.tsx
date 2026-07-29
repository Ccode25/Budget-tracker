"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, TrendingUp, CreditCard, PiggyBank, Activity, ArrowRight } from "lucide-react";
import { StatCard } from "./StatCard";
import { RecentTransactions } from "./RecentTransactions";
import { BudgetOverviewCard } from "./BudgetOverviewCard";
import { GoalsCard } from "./GoalsCard";
import { QuickActions } from "./QuickActions";
import { useDashboard } from "../hooks/useDashboard";
import { Container } from "@/components/layout/Container";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type { Transaction } from "@/types/transaction";
import type { Budget } from "@/types/budget";
import { cn, formatPHP } from "@/lib/utils";

const DailyExpensesChart = dynamic(() => import("./DailyExpensesChart"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full rounded-xl" />,
});

export function DashboardContent({
  initialTransactions,
  initialBudgets,
  initialGoals,
}: {
  initialTransactions?: Transaction[];
  initialBudgets?: Budget[];
  initialGoals?: any[];
}) {
  const {
    currentBalance,
    income,
    expenses,
    savingsRate,
    incomeTrend,
    expenseTrend,
    recentTransactions,
    dailyExpenses,
    budgetCategories,
    activeBudget,
    goals,
  } = useDashboard({
    initialData: {
      transactions: initialTransactions ?? [],
      budgets: initialBudgets ?? [],
      goals: initialGoals ?? [],
    },
  });

  return (
    <PageWrapper>
      <Container className="py-6 space-y-8">
        {/* Greeting & Onboarding Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Good day 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here&apos;s your financial overview for July 2026.
            </p>
          </div>
        </div>

        {recentTransactions.length === 0 && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 backdrop-blur-md">
            <h2 className="text-base font-bold text-foreground">Welcome to BudgetTracker! 🎉</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You are signed in with a clean account. Get started by adding your first transaction or importing a bank statement.
            </p>
          </div>
        )}

        {/* Daily Summary Bar */}
        {recentTransactions.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            {(() => {
              const dates = Array.from(new Set(recentTransactions.map((t) => t.date))).sort((a, b) => b.localeCompare(a));
              const latestDate = dates[0];
              const dayTx = recentTransactions.filter((t) => t.date === latestDate);
              const dayInc = dayTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
              const dayExp = dayTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
              const dayNet = dayInc - dayExp;

              return (
                <>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Daily Summary ({latestDate})
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground block">Day Income</span>
                      <span className="font-bold text-emerald-500 tabular-nums">+{formatPHP(dayInc)}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Day Expenses</span>
                      <span className="font-bold text-foreground tabular-nums">-{formatPHP(dayExp)}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Net Daily Flow</span>
                      <span className={cn("font-bold tabular-nums", dayNet >= 0 ? "text-emerald-500" : "text-rose-500")}>
                        {dayNet >= 0 ? "+" : ""}{formatPHP(dayNet)}
                      </span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            label="Total Balance"
            value={formatPHP(currentBalance)}
            icon={Wallet}
            iconColor="text-primary"
            iconBg="bg-primary/10"
          />
          <StatCard
            label="Monthly Income"
            value={formatPHP(income)}
            change={incomeTrend}
            icon={TrendingUp}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-500/10"
          />
          <StatCard
            label="Monthly Spend"
            value={formatPHP(expenses)}
            change={expenseTrend}
            icon={CreditCard}
            iconColor="text-destructive"
            iconBg="bg-destructive/10"
          />
          <StatCard
            label="Savings Rate"
            value={`${savingsRate.toFixed(1)}%`}
            icon={PiggyBank}
            iconColor="text-violet-500"
            iconBg="bg-violet-500/10"
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left — Recent Transactions (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            <RecentTransactions transactions={recentTransactions} />
          </div>

          {/* Right — Budget + Savings Goals + Daily Expenses Analytics (2/5) */}
          <div className="lg:col-span-2 space-y-6">
            {activeBudget && (
              <BudgetOverviewCard
                budgetName={activeBudget.name}
                totalSpent={activeBudget.totalSpent ?? activeBudget.totalExpenses ?? 0}
                totalLimit={activeBudget.amount ?? activeBudget.totalLimit ?? 0}
                categories={budgetCategories}
                monthlyIncome={income}
                endDate={activeBudget.endDate}
              />
            )}
            <GoalsCard goals={goals} />

            {/* Daily Expenses Graph Analytics Card (Below Savings Goals) */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-500/10 text-rose-500">
                    <Activity size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Daily Expenses</h3>
                    <p className="text-xs text-muted-foreground">Activity for current month</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                    Total: {formatPHP(expenses)}
                  </span>
                  <Link
                    href="/analytics"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    View All <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
              <DailyExpensesChart data={dailyExpenses} />
            </div>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}
