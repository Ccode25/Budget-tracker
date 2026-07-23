"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useCategories } from "../hooks/useCategories";
import { CategoryCard } from "./CategoryCard";
import { CategoryForm } from "./CategoryForm";

export function CategoriesContent() {
  const { categories, addCategory } = useCategories();
  const [formOpen, setFormOpen] = useState(false);

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  return (
    <PageWrapper>
      <Container className="py-6 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Organize income and spending classification rules.
            </p>
          </div>
          <Button className="gap-2 shrink-0" onClick={() => setFormOpen(true)}>
            <Plus size={14} aria-hidden /> Add Category
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold mb-3">Expense Categories ({expenseCategories.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {expenseCategories.map((c) => (
                <CategoryCard key={c.id} category={c} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-3">Income Categories ({incomeCategories.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {incomeCategories.map((c) => (
                <CategoryCard key={c.id} category={c} />
              ))}
            </div>
          </div>
        </div>

        <CategoryForm open={formOpen} onOpenChange={setFormOpen} onSubmit={addCategory} />
      </Container>
    </PageWrapper>
  );
}
