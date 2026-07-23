"use client";

import { Wallet, TrendingUp, CreditCard, PiggyBank } from "lucide-react";
import { StatCard } from "./StatCard";
import { RecentTransactions } from "./RecentTransactions";
import { BudgetOverviewCard } from "./BudgetOverviewCard";
import { GoalsCard } from "./GoalsCard";
import { QuickActions } from "./QuickActions";
import { useDashboard } from "../hooks/useDashboard";
import { Container } from "@/components/layout/Container";
import { PageWrapper } from "@/components/layout/PageWrapper";

function fmt(n: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function DashboardContent() {
  const {
    currentBalance,
    income,
    expenses,
    savingsRate,
    incomeTrend,
    expenseTrend,
    recentTransactions,
    budgetCategories,
    activeBudget,
    goals,
  } = useDashboard();

  return (
    <PageWrapper>
      <Container className="py-6 space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Good afternoon 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s your financial overview for July 2026.
          </p>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            label="Total Balance"
            value={fmt(currentBalance)}
            icon={Wallet}
            iconColor="text-primary"
            iconBg="bg-primary/10"
          />
          <StatCard
            label="Monthly Income"
            value={fmt(income)}
            change={incomeTrend}
            icon={TrendingUp}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-500/10"
          />
          <StatCard
            label="Monthly Spend"
            value={fmt(expenses)}
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

          {/* Right — Budget + Goals (2/5) */}
          <div className="lg:col-span-2 space-y-6">
            {activeBudget && (
              <BudgetOverviewCard
                budgetName={activeBudget.name}
                totalSpent={activeBudget.totalSpent}
                totalLimit={activeBudget.totalLimit}
                categories={budgetCategories}
              />
            )}
            <GoalsCard goals={goals} />
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}
