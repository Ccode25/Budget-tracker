import type { Metadata } from "next";
import { CategoriesContent } from "@/features/categories/components/CategoriesContent";

export const metadata: Metadata = {
  title: "Categories — BudgetTracker",
  description: "Manage income and expense categories.",
};

export default function CategoriesPage() {
  return <CategoriesContent />;
}
