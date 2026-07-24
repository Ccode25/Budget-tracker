"use client";

import { useState } from "react";
import { ArrowLeft, Calendar, Plus, Pencil, Trash2, Tag, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import type { Budget } from "@/types/budget";
import type { Transaction } from "@/types/transaction";
import { getCategoryName, getCategoryColor } from "@/features/categories/mock/categories";
import { cn } from "@/lib/utils";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";

interface BudgetDetailsProps {
  budget: Budget;
  allTransactions: Transaction[];
  onBack: () => void;
  onEditBudget: (budget: Budget) => void;
  onDeleteBudget: (id: string) => void;
  onAddTransaction: (tx: Omit<Transaction, "id">) => void;
  onDeleteTransaction: (id: string) => void;
}

export function BudgetDetails({
  budget,
  allTransactions,
  onBack,
  onEditBudget,
  onDeleteBudget,
  onAddTransaction,
  onDeleteTransaction,
}: BudgetDetailsProps) {
  const [txFormOpen, setTxFormOpen] = useState(false);

  // Filter transactions strictly belonging to this budget period
  const periodTransactions = allTransactions.filter(
    (t) =>
      t.status !== "failed" &&
      t.date >= budget.startDate &&
      t.date <= budget.endDate
  );

  const amount = budget.amount ?? budget.totalLimit ?? 0;
  const totalExpenses = periodTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = periodTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const remaining = amount - totalExpenses;
  const spentPct = amount > 0 ? (totalExpenses / amount) * 100 : 0;
  const remainingPct = amount > 0 ? (remaining / amount) * 100 : 0;
  const status = spentPct > 100 ? "Over Budget" : spentPct > 80 ? "Warning" : "Safe";

  const formatDateRange = (start: string, end: string) => {
    try {
      const s = new Date(start + "T00:00:00");
      const e = new Date(end + "T00:00:00");
      return `${format(s, "MMM d, yyyy")} – ${format(e, "MMM d, yyyy")}`;
    } catch {
      return `${start} – ${end}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-2">
          <ArrowLeft size={16} /> Back to Budgets
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEditBudget(budget)} className="gap-1.5">
            <Pencil size={14} /> Edit Period
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteBudget(budget.id)}
            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      </div>

      {/* Budget Summary Banner */}
      <Card className="border-border overflow-hidden">
        <div className="h-2" style={{ backgroundColor: budget.color || "#7c3aed" }} />
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{budget.name}</h1>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-semibold px-2.5 py-0.5 rounded-full border",
                    status === "Over Budget" && "bg-destructive/10 text-destructive border-destructive/20",
                    status === "Warning" && "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
                    status === "Safe" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                  )}
                >
                  {status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Calendar size={14} />
                Period: {formatDateRange(budget.startDate, budget.endDate)}
              </p>
            </div>
            <Button onClick={() => setTxFormOpen(true)} className="gap-2 shrink-0">
              <Plus size={14} /> Add Period Transaction
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Budget Amount</p>
              <p className="text-2xl font-bold text-foreground mt-1">₱{amount.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Expenses</p>
              <p className="text-2xl font-bold text-foreground mt-1">₱{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Remaining Budget</p>
              <p className={cn("text-2xl font-bold mt-1", remaining < 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400")}>
                ₱{remaining.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{Math.round(remainingPct)}% remaining</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Income</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">₱{totalIncome.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Budget Consumption</span>
              <span className={cn(status === "Over Budget" ? "text-destructive" : status === "Warning" ? "text-amber-600" : "text-foreground")}>
                {Math.round(spentPct)}% Spent
              </span>
            </div>
            <Progress
              value={Math.min(spentPct, 100)}
              className={cn(
                "h-3",
                status === "Over Budget"
                  ? "[&>div]:bg-destructive"
                  : status === "Warning"
                  ? "[&>div]:bg-amber-500"
                  : "[&>div]:bg-emerald-500"
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Transactions Section */}
      <Card className="border-border">
        <CardHeader className="flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg font-semibold">Period Transactions</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Showing transactions assigned to this budget period ({periodTransactions.length} total)
            </p>
          </div>
        </CardHeader>

        <CardContent>
          {periodTransactions.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded-lg space-y-2">
              <Tag size={28} className="mx-auto text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No transactions in this date range</p>
              <p className="text-xs text-muted-foreground">
                Transactions with dates between {budget.startDate} and {budget.endDate} will automatically appear here.
              </p>
              <Button size="sm" variant="outline" onClick={() => setTxFormOpen(true)} className="mt-2 gap-1.5">
                <Plus size={13} /> Add Transaction
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {periodTransactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                        tx.type === "expense" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500"
                      )}
                    >
                      {tx.type === "expense" ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span className="capitalize">{getCategoryName(tx.categoryId)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        tx.type === "expense" ? "text-foreground" : "text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      {tx.type === "expense" ? "-" : "+"}₱{tx.amount.toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onDeleteTransaction(tx.id)}
                      title="Delete Transaction"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Form Modal */}
      <TransactionForm
        open={txFormOpen}
        onOpenChange={setTxFormOpen}
        onSubmit={(data) => {
          onAddTransaction({
            ...data,
            date: data.date || budget.startDate,
          });
          setTxFormOpen(false);
        }}
      />
    </div>
  );
}
