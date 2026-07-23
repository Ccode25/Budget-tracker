import type { Metadata } from "next";
import { SettingsContent } from "@/features/settings/components/SettingsContent";

export const metadata: Metadata = {
  title: "Settings — BudgetTracker",
  description: "Manage your preferences and application configuration.",
};

export default function SettingsPage() {
  return <SettingsContent />;
}
