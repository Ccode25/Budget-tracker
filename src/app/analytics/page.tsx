import type { Metadata } from "next";
import { AnalyticsContent } from "@/features/analytics/components/AnalyticsContent";

export const metadata: Metadata = {
  title: "Analytics — BudgetTracker",
  description: "Deep dive into your financial trends and category spending.",
};

export default function AnalyticsPage() {
  return <AnalyticsContent />;
}
