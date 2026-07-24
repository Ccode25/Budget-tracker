import type { Metadata } from "next";
import { CategoriesContent } from "@/features/categories/components/CategoriesContent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { categoryRepository } from "@/repositories/category.repository";
import type { Category } from "@/types/category";

export const metadata: Metadata = {
  title: "Categories — BudgetTracker",
  description: "Manage income and expense categories.",
};

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id || session?.user?.email;

  let initialCategories: Category[] = [];

  if (userId) {
    let categories = await categoryRepository.findAll(userId);
    if (categories.length === 0) {
      await categoryRepository.seedDefaultCategories(userId);
      categories = await categoryRepository.findAll(userId);
    }
    initialCategories = categories;
  }

  return <CategoriesContent initialCategories={initialCategories} />;
}
