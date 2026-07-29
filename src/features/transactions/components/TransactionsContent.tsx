"use client";

import { useState, useCallback } from "react";
import { Plus, Upload, Calculator, CheckSquare, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useTransactions } from "../hooks/useTransactions";
import { TransactionSearch } from "./TransactionSearch";
import { TransactionFiltersButton, TransactionFilterPanel } from "./TransactionFilters";
import { TransactionTable } from "./TransactionTable";
import { Pagination } from "./Pagination";
import { TransactionForm } from "./TransactionForm";
import { TransactionDetail } from "./TransactionDetail";
import type { Transaction } from "@/types/transaction";
import { cn, formatPHP } from "@/lib/utils";

export function TransactionsContent({
  initialTransactions,
}: {
  initialTransactions?: Transaction[];
}) {
  const {
    transactions,
    allFiltered,
    totalCount,
    selectedTransaction,
    page,
    totalPages,
    pageSize,
    setPage,
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    sort,
    toggleSort,
    selectedId,
    setSelectedId,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading,
  } = useTransactions({ initialTransactions });

  const [formOpen, setFormOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelectTx = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAllTx = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === transactions.length) return new Set();
      return new Set(transactions.map((t) => t.id));
    });
  }, [transactions]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    const tx = transactions.find((t) => t.id === id) || selectedTransaction;
    if (tx) {
      setEditingTransaction(tx);
      setFormOpen(true);
    }
  };

  const handleFormSubmit = (data: Omit<Transaction, "id">) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
  };

  const handleSearchChange = useCallback(
    (val: string) => {
      updateFilter("search", val);
    },
    [updateFilter]
  );

  return (
    <PageWrapper>
      <Container className="py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Transactions
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              View, search, filter, and manage your activity.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => {}}>
              <Link href="/transactions/import" className="flex items-center gap-2">
                <Upload size={14} aria-hidden /> Import CSV / Excel
              </Link>
            </Button>
            <Button size="sm" className="gap-2" onClick={handleOpenAdd}>
              <Plus size={14} aria-hidden /> Add Transaction
            </Button>
          </div>
        </div>

        {/* Search & Filters Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <TransactionSearch
            value={filters.search}
            onChange={handleSearchChange}
            count={totalCount}
          />
          <div className="relative">
            <TransactionFiltersButton
              open={filterOpen}
              onToggle={() => setFilterOpen((v) => !v)}
              onReset={resetFilters}
              hasActive={hasActiveFilters}
            />

            {filterOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-30 animate-in fade-in-0 zoom-in-95">
                <TransactionFilterPanel
                  filters={filters}
                  onUpdate={updateFilter}
                />
              </div>
            )}
          </div>
        </div>

        {/* Daily Summary Cards */}
        {allFiltered && allFiltered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(() => {
              const dates = Array.from(new Set(allFiltered.map((t) => t.date))).sort((a, b) => b.localeCompare(a));
              const latestDate = dates[0];
              const dayTx = allFiltered.filter((t) => t.date === latestDate);
              const dayIncome = dayTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
              const dayExpense = dayTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
              const dayNet = dayIncome - dayExpense;

              return (
                <>
                  <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs flex flex-col justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Latest Day ({latestDate}) Income
                    </p>
                    <p className="text-lg font-bold text-emerald-500 tabular-nums">
                      +{new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(dayIncome)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs flex flex-col justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Latest Day ({latestDate}) Expenses
                    </p>
                    <p className="text-lg font-bold text-foreground tabular-nums">
                      -{new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(dayExpense)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs flex flex-col justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Latest Day ({latestDate}) Net Flow
                    </p>
                    <p className={cn("text-lg font-bold tabular-nums", dayNet >= 0 ? "text-emerald-500" : "text-rose-500")}>
                      {dayNet >= 0 ? "+" : ""}
                      {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(dayNet)}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Selected Calculator Tally Card */}
        {selectedIds.size > 0 && (
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Calculator size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Calculator Tally ({selectedIds.size} transaction{selectedIds.size > 1 ? "s" : ""} selected)
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  {(() => {
                    const selTxs = allFiltered.filter((t) => selectedIds.has(t.id));
                    const inc = selTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
                    const exp = selTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
                    const total = inc - exp;
                    return (
                      <span className={cn("text-xl font-bold tabular-nums", total >= 0 ? "text-emerald-500" : "text-rose-500")}>
                        {total >= 0 ? "+" : ""}
                        {formatPHP(total)}
                        <span className="text-xs font-normal text-muted-foreground ml-2">
                          (Income: {formatPHP(inc)} | Expenses: {formatPHP(exp)})
                        </span>
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={clearSelection}>
              <X size={14} /> Clear Selection
            </Button>
          </div>
        )}

        {/* Table */}
        <TransactionTable
          transactions={transactions}
          sort={sort}
          onSort={toggleSort}
          onSelect={(id) => setSelectedId(id)}
          onEdit={handleOpenEdit}
          onDelete={deleteTransaction}
          selectedId={selectedId}
          isLoading={isLoading}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelectTx}
          onToggleSelectAll={toggleSelectAllTx}
        />

        {/* Pagination */}
        <div className="pt-2 pb-6">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalCount={totalCount}
            pageSize={pageSize}
          />
        </div>

        {/* Add/Edit Modal */}
        <TransactionForm
          open={formOpen}
          onOpenChange={setFormOpen}
          transaction={editingTransaction}
          onSubmit={handleFormSubmit}
        />

        {/* Detail Drawer */}
        <TransactionDetail
          transaction={selectedTransaction}
          open={!!selectedId}
          onOpenChange={(open) => !open && setSelectedId(null)}
          onEdit={handleOpenEdit}
          onDelete={deleteTransaction}
        />
      </Container>
    </PageWrapper>
  );
}
