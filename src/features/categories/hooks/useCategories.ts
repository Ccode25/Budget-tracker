"use client";

import { useState } from "react";
import { MOCK_CATEGORIES } from "../mock/categories";
import type { Category } from "@/types/category";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  const addCategory = (category: Omit<Category, "id">) => {
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [newCat, ...prev]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
