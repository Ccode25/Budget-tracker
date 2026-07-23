import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MOCK_CATEGORIES } from "../mock/categories";
import type { Category } from "@/types/category";

export function useCategories() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/categories")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.data) {
            setCategories(data.data);
          }
        })
        .catch((err) => console.error("Failed to fetch user categories", err));
    } else if (typeof window !== "undefined") {
      const storedUser = window.localStorage.getItem("budget_tracker_user");
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u?.isDemo) setCategories(MOCK_CATEGORIES);
        } catch {
          setCategories([]);
        }
      }
    }
  }, [isAuthenticated]);

  const addCategory = async (category: Omit<Category, "id">) => {
    if (isAuthenticated) {
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
        console.error("Failed to create category", err);
      }
    }

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
