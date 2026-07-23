import type { Metadata } from "next";
import { DashboardContent } from "@/features/dashboard/components/DashboardContent";

export const metadata: Metadata = {
  title: "Overview — BudgetTracker",
  description: "Your financial dashboard summary.",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
