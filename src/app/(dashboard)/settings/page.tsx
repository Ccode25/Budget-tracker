import type { Metadata } from "next";
import { SettingsContent } from "@/features/settings/components/SettingsContent";

export const metadata: Metadata = {
  title: "Settings — BudgetTracker",
  description: "Configure app preferences, currency formatting, and import settings.",
};

export default function SettingsPage() {
  return <SettingsContent />;
}
