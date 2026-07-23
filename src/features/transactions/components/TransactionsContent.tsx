"use client";

import { useState, useCallback } from "react";
import { Plus, Upload } from "lucide-react";
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

export function TransactionsContent() {
  const {
    transactions,
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
  } = useTransactions();

  const [formOpen, setFormOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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

        {/* Table */}
        <TransactionTable
          transactions={transactions}
          sort={sort}
          onSort={toggleSort}
          onSelect={(id) => setSelectedId(id)}
          onEdit={handleOpenEdit}
          onDelete={deleteTransaction}
          selectedId={selectedId}
        />

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalCount={totalCount}
          pageSize={pageSize}
        />

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
