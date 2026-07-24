import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MOCK_CATEGORIES } from "../mock/categories";
import type { Category } from "@/types/category";

export interface UseCategoriesOptions {
  initialCategories?: Category[];
}

export function useCategories(options?: UseCategoriesOptions) {
  const { initialCategories } = options ?? {};

  const [categories, setCategories] = useState<Category[]>(
    initialCategories && initialCategories.length > 0 ? initialCategories : MOCK_CATEGORIES
  );

  useEffect(() => {
    let isMounted = true;
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.data && Array.isArray(data.data) && data.data.length > 0) {
          setCategories(data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user categories:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [initialCategories]);

  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.data) {
          setCategories((prev) => [data.data, ...prev]);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to create category:", err);
    }

    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [newCat, ...prev]);
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    let previous: Category[] = [];
    setCategories((prev) => {
      previous = prev;
      return prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
    });

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        setCategories(previous);
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to update category");
      }
    } catch (err) {
      setCategories(previous);
      console.error("Failed to update category:", err);
      toast.error("Network error while updating category");
    }
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
