"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useAnalytics } from "../hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

const IncomeExpenseChart = dynamic(
  () => import("./IncomeExpenseChart"),
  { ssr: false, loading: () => <Skeleton className="h-72 w-full rounded-xl" /> }
);

const ExpenseBreakdownChart = dynamic(
  () => import("./ExpenseBreakdownChart"),
  { ssr: false, loading: () => <Skeleton className="h-72 w-full rounded-xl" /> }
);

export function AnalyticsContent() {
  const { monthlyTrends, categoryBreakdown, summary } = useAnalytics();

  return (
    <PageWrapper>
      <Container className="py-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visual insights into your income, expenses, and savings velocity.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground font-medium">Total Income (YTD)</p>
              <p className="text-2xl font-bold text-emerald-500 mt-1">
                ₱{summary.totalIncome.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground font-medium">Total Expenses (YTD)</p>
              <p className="text-2xl font-bold text-rose-500 mt-1">
                ₱{summary.totalExpenses.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground font-medium">Net Savings</p>
              <p className="text-2xl font-bold text-primary mt-1">
                ₱{summary.netSavings.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground font-medium">Avg Savings Rate</p>
              <p className="text-2xl font-bold text-violet-500 mt-1">
                {summary.savingsRate.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Income vs Expenses (6-Month Trend)</CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeExpenseChart data={monthlyTrends} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">July Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseBreakdownChart data={categoryBreakdown} />
            </CardContent>
          </Card>
        </div>
      </Container>
    </PageWrapper>
  );
}
