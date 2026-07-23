"use client";

import { useState } from "react";
import { Plus, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useBudgets } from "../hooks/useBudgets";
import { BudgetCard } from "./BudgetCard";
import { BudgetForm } from "./BudgetForm";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Budget } from "@/types/budget";

export function BudgetContent() {
  const { activeBudgets, addBudget, updateBudget, deleteBudget, setSelectedId } = useBudgets();
  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const totalLimit = activeBudgets.reduce((s, b) => s + b.totalLimit, 0);
  const totalSpent = activeBudgets.reduce((s, b) => s + b.totalSpent, 0);
  const totalPct = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormOpen(true);
  };

  return (
    <PageWrapper>
      <Container className="py-6 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Set spending targets and manage monthly limits.
            </p>
          </div>
          <Button className="gap-2 shrink-0" onClick={handleOpenAdd}>
            <Plus size={14} aria-hidden /> Create Budget
          </Button>
        </div>

        {/* Global Summary */}
        <Card className="bg-primary text-primary-foreground overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Total Active Budget</p>
                <p className="text-3xl font-bold mt-1">
                  ₱{totalSpent.toLocaleString()}
                  <span className="text-lg font-normal opacity-70 ml-1">
                    / ₱{totalLimit.toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">Remaining</p>
                <p className="text-2xl font-bold">
                  ₱{Math.max(0, totalLimit - totalSpent).toLocaleString()}
                </p>
              </div>
            </div>
            <Progress
              value={totalPct}
              className="h-2 bg-primary-foreground/20 [&>div]:bg-primary-foreground"
            />
            <p className="text-xs opacity-70">
              {totalPct}% of total budget used across {activeBudgets.length} active plans.
            </p>
          </CardContent>
        </Card>

        {/* Active Budgets List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Active Plans</h2>
          {activeBudgets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center space-y-3">
              <PiggyBank size={32} className="mx-auto text-muted-foreground" />
              <h3 className="text-base font-semibold text-foreground">No budgets found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Create a budget plan to set category spending limits and monitor monthly usage.
              </p>
              <Button size="sm" onClick={handleOpenAdd} className="gap-2">
                <Plus size={14} /> Create Budget
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeBudgets.map((b) => (
                <BudgetCard
                  key={b.id}
                  budget={b}
                  onClick={() => setSelectedId(b.id)}
                  onEdit={handleOpenEdit}
                  onDelete={deleteBudget}
                />
              ))}
            </div>
          )}
        </div>

        <BudgetForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={addBudget}
          budget={editingBudget}
          onUpdate={updateBudget}
        />
      </Container>
    </PageWrapper>
  );
}
