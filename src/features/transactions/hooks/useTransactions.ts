import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DEMO_TRANSACTIONS } from "../mock/transactions";
import { getCategoryName, getCategoryColor } from "@/features/categories/mock/categories";
import type {
  Transaction,
  TransactionFilters,
  TransactionSort,
  TransactionType,
  TransactionStatus,
} from "@/types/transaction";

export const EMPTY_FILTERS: TransactionFilters = {
  search: "",
  types: [],
  categoryIds: [],
  statuses: [],
  dateFrom: null,
  dateTo: null,
  amountMin: null,
  amountMax: null,
};

const PAGE_SIZE = 20;

export interface EnrichedTransaction extends Transaction {
  categoryName: string;
  categoryColor: string;
}

function enrichTransaction(t: Transaction): EnrichedTransaction {
  return {
    ...t,
    categoryName: getCategoryName(t.categoryId),
    categoryColor: getCategoryColor(t.categoryId),
  };
}

export function useTransactions() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const [filters, setFilters] = useState<TransactionFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<TransactionSort>({ field: "date", direction: "desc" });
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [dbTransactions, setDbTransactions] = useState<Transaction[]>([]);
  const [demoTransactions, setDemoTransactions] = useLocalStorage<Transaction[]>(
    "budget_tracker_transactions",
    []
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/transactions")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.data) {
            setDbTransactions(data.data);
          }
        })
        .catch((err) => console.error("Failed to fetch transactions", err));
    }
  }, [isAuthenticated]);

  const activeTransactions = useMemo(() => {
    if (isAuthenticated) return dbTransactions;

    if (typeof window !== "undefined") {
      const storedUser = window.localStorage.getItem("budget_tracker_user");
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u?.isDemo) return demoTransactions.length > 0 ? demoTransactions : DEMO_TRANSACTIONS;
        } catch {
          // fallback
        }
      }
    }
    return [];
  }, [isAuthenticated, dbTransactions, demoTransactions]);

  const filteredAndSorted = useMemo(() => {
    const uniqueMap = new Map<string, Transaction>();
    for (const item of activeTransactions) {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    }
    const uniqueTransactions = Array.from(uniqueMap.values());

    let result = uniqueTransactions.map(enrichTransaction);

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.categoryName.toLowerCase().includes(q) ||
          (t.merchant?.toLowerCase().includes(q) ?? false) ||
          (t.notes?.toLowerCase().includes(q) ?? false),
      );
    }

    // Type filter
    if (filters.types.length > 0) {
      result = result.filter((t) => filters.types.includes(t.type));
    }

    // Category filter
    if (filters.categoryIds.length > 0) {
      result = result.filter((t) => filters.categoryIds.includes(t.categoryId));
    }

    // Status filter
    if (filters.statuses.length > 0) {
      result = result.filter((t) => filters.statuses.includes(t.status));
    }

    // Date range
    if (filters.dateFrom) {
      result = result.filter((t) => t.date >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      result = result.filter((t) => t.date <= filters.dateTo!);
    }

    // Amount range
    if (filters.amountMin !== null) {
      result = result.filter((t) => t.amount >= filters.amountMin!);
    }
    if (filters.amountMax !== null) {
      result = result.filter((t) => t.amount <= filters.amountMax!);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sort.field) {
        case "date":
          cmp = a.date.localeCompare(b.date);
          break;
        case "amount":
          cmp = a.amount - b.amount;
          break;
        case "description":
          cmp = a.description.localeCompare(b.description);
          break;
        case "category":
          cmp = a.categoryName.localeCompare(b.categoryName);
          break;
      }
      return sort.direction === "asc" ? cmp : -cmp;
    });

    return result;
  }, [activeTransactions, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const paginatedItems = filteredAndSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedTransaction = useMemo(
    () => filteredAndSorted.find((t) => t.id === selectedId) ?? null,
    [filteredAndSorted, selectedId],
  );

  const updateFilter = useCallback(<K extends keyof TransactionFilters>(
    key: K,
    value: TransactionFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }, []);

  const toggleSort = useCallback((field: TransactionSort["field"]) => {
    setSort((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "desc" },
    );
  }, []);

  const addTransaction = useCallback(
    async (tx: Omit<Transaction, "id">) => {
      if (isAuthenticated) {
        try {
          const res = await fetch("/api/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tx),
          });
          if (res.ok) {
            const data = await res.json();
            setDbTransactions((prev) => [data.data, ...prev]);
          }
        } catch (err) {
          console.error("Failed to save transaction to database", err);
        }
        return;
      }
      const newTx: Transaction = {
        ...tx,
        id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      };
      setDemoTransactions((prev) => [newTx, ...prev]);
    },
    [isAuthenticated, setDemoTransactions]
  );

  const updateTransaction = useCallback(
    async (id: string, updates: Partial<Transaction>) => {
      if (isAuthenticated) {
        setDbTransactions((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
        );
        try {
          await fetch(`/api/transactions/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });
        } catch (err) {
          console.error("Failed to update transaction in database:", err);
        }
        return;
      }
      setDemoTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    },
    [isAuthenticated, setDemoTransactions]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      if (isAuthenticated) {
        setDbTransactions((prev) => prev.filter((t) => t.id !== id));
        if (selectedId === id) setSelectedId(null);
        try {
          await fetch(`/api/transactions/${id}`, {
            method: "DELETE",
          });
        } catch (err) {
          console.error("Failed to delete transaction from database:", err);
        }
        return;
      }
      setDemoTransactions((prev) => prev.filter((t) => t.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [isAuthenticated, selectedId, setDemoTransactions]
  );

  const hasActiveFilters = useMemo(
    () =>
      filters.search !== "" ||
      filters.types.length > 0 ||
      filters.categoryIds.length > 0 ||
      filters.statuses.length > 0 ||
      filters.dateFrom !== null ||
      filters.dateTo !== null ||
      filters.amountMin !== null ||
      filters.amountMax !== null,
    [filters],
  );

  return {
    // Data
    transactions: paginatedItems,
    allFiltered: filteredAndSorted,
    totalCount: filteredAndSorted.length,
    selectedTransaction,
    // Pagination
    page,
    totalPages,
    pageSize: PAGE_SIZE,
    setPage,
    // Filters
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    // Sort
    sort,
    toggleSort,
    // Selection
    selectedId,
    setSelectedId,
    // CRUD
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
