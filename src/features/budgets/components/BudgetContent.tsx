"use client";

import { useState, useEffect } from "react";
import { Plus, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useBudgets } from "../hooks/useBudgets";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { BudgetCard } from "./BudgetCard";
import { BudgetForm } from "./BudgetForm";
import { BudgetDetails } from "./BudgetDetails";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Budget } from "@/types/budget";
import type { Transaction } from "@/types/transaction";

export function BudgetContent({
  initialBudgets,
  initialTransactions,
}: {
  initialBudgets?: Budget[];
  initialTransactions?: Transaction[];
}) {
  const [mounted, setMounted] = useState(false);
  const {
    activeBudgets,
    selectedBudget,
    setSelectedId,
    addBudget,
    updateBudget,
    deleteBudget,
    refetch,
  } = useBudgets({
    initialBudgets,
    initialTransactions,
  });

  const {
    allFiltered: allTransactions,
    addTransaction,
    deleteTransaction,
  } = useTransactions({
    initialTransactions,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayBudgets = mounted ? activeBudgets : [];

  const totalAmount = displayBudgets.reduce((s, b) => s + (b.amount ?? b.totalLimit ?? 0), 0);
  const totalExpenses = displayBudgets.reduce((s, b) => s + (b.totalExpenses ?? b.totalSpent ?? 0), 0);
  const totalPct = totalAmount > 0 ? Math.round((totalExpenses / totalAmount) * 100) : 0;

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormOpen(true);
  };

  const handleAddTransactionInBudget = async (tx: Omit<Transaction, "id">) => {
    await addTransaction(tx);
    refetch();
  };

  const handleDeleteTransactionInBudget = async (id: string) => {
    await deleteTransaction(id);
    refetch();
  };

  return (
    <PageWrapper>
      <Container className="py-6 space-y-8">
        {selectedBudget ? (
          <BudgetDetails
            budget={selectedBudget}
            allTransactions={allTransactions}
            onBack={() => setSelectedId(null)}
            onEditBudget={handleOpenEdit}
            onDeleteBudget={async (id) => {
              await deleteBudget(id);
              setSelectedId(null);
            }}
            onAddTransaction={handleAddTransactionInBudget}
            onDeleteTransaction={handleDeleteTransactionInBudget}
          />
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage monthly budget periods and track expense allocations.
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
                    <p className="text-sm font-medium opacity-80">Total Active Budget Limit</p>
                    <p className="text-3xl font-bold mt-1">
                      ₱{totalExpenses.toLocaleString()}
                      <span className="text-lg font-normal opacity-70 ml-1">
                        / ₱{totalAmount.toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-80">Remaining</p>
                    <p className="text-2xl font-bold">
                      ₱{Math.max(0, totalAmount - totalExpenses).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Progress
                  value={Math.min(totalPct, 100)}
                  className="h-2 bg-primary-foreground/20 [&>div]:bg-primary-foreground"
                />
                <p className="text-xs opacity-70">
                  {totalPct}% of total budget used across {displayBudgets.length} active periods.
                </p>
              </CardContent>
            </Card>

            {/* Active Budgets List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Budget Periods</h2>
              {displayBudgets.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center space-y-3">
                  <PiggyBank size={32} className="mx-auto text-muted-foreground" />
                  <h3 className="text-base font-semibold text-foreground">No budgets found</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Create a budget period to set date ranges, spending targets, and automatically track period expenses.
                  </p>
                  <Button size="sm" onClick={handleOpenAdd} className="gap-2">
                    <Plus size={14} /> Create Budget
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {displayBudgets.map((b) => (
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
          </>
        )}

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
