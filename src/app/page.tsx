import type { Metadata } from "next";
import { Wallet, TrendingUp, CreditCard, PiggyBank } from "lucide-react";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { RecentTransactions } from "@/features/dashboard/components/RecentTransactions";
import { BudgetOverviewCard } from "@/features/dashboard/components/BudgetOverviewCard";
import { GoalsCard } from "@/features/dashboard/components/GoalsCard";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { DashboardContent } from "@/features/dashboard/components/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard — BudgetTracker",
  description: "Your personal financial overview: balance, income, expenses, budgets, and savings goals.",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
