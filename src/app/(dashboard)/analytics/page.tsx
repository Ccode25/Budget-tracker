import type { Metadata } from "next";
import { AnalyticsContent } from "@/features/analytics/components/AnalyticsContent";

export const metadata: Metadata = {
  title: "Analytics — BudgetTracker",
  description: "Visual insights, cash flow trends, and category breakdown charts.",
};

export default function AnalyticsPage() {
  return <AnalyticsContent />;
}
