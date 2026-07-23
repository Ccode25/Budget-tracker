/**
 * Transaction Repository
 * Encapsulates database operations for transaction entity management.
 */

import type { Transaction, TransactionFilters, TransactionSort } from "@/types/transaction";
import { MOCK_TRANSACTIONS } from "@/features/transactions/mock/transactions";

export class TransactionRepository {
  private static instance: TransactionRepository;
  private transactions: Transaction[] = [...MOCK_TRANSACTIONS];

  public static getInstance(): TransactionRepository {
    if (!TransactionRepository.instance) {
      TransactionRepository.instance = new TransactionRepository();
    }
    return TransactionRepository.instance;
  }

  async findAll(
    filters?: Partial<TransactionFilters>,
    sort?: TransactionSort,
    page = 1,
    pageSize = 20
  ): Promise<{ data: Transaction[]; total: number }> {
    let result = [...this.transactions];

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (t) =>
            t.description.toLowerCase().includes(q) ||
            (t.merchant?.toLowerCase().includes(q) ?? false) ||
            (t.notes?.toLowerCase().includes(q) ?? false)
        );
      }
      if (filters.types && filters.types.length > 0) {
        result = result.filter((t) => filters.types!.includes(t.type));
      }
      if (filters.categoryIds && filters.categoryIds.length > 0) {
        result = result.filter((t) => filters.categoryIds!.includes(t.categoryId));
      }
      if (filters.statuses && filters.statuses.length > 0) {
        result = result.filter((t) => filters.statuses!.includes(t.status));
      }
      if (filters.dateFrom) {
        result = result.filter((t) => t.date >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        result = result.filter((t) => t.date <= filters.dateTo!);
      }
      if (filters.amountMin !== undefined && filters.amountMin !== null) {
        result = result.filter((t) => t.amount >= filters.amountMin!);
      }
      if (filters.amountMax !== undefined && filters.amountMax !== null) {
        result = result.filter((t) => t.amount <= filters.amountMax!);
      }
    }

    if (sort) {
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
            cmp = a.categoryId.localeCompare(b.categoryId);
            break;
        }
        return sort.direction === "asc" ? cmp : -cmp;
      });
    }

    const total = result.length;
    const startIndex = (page - 1) * pageSize;
    const data = result.slice(startIndex, startIndex + pageSize);

    return { data, total };
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactions.find((t) => t.id === id) ?? null;
  }

  async create(data: Omit<Transaction, "id">): Promise<Transaction> {
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    this.transactions.unshift(newTx);
    return newTx;
  }

  async update(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
    const index = this.transactions.findIndex((t) => t.id === id);
    if (index === -1) return null;

    this.transactions[index] = { ...this.transactions[index], ...updates };
    return this.transactions[index];
  }

  async delete(id: string): Promise<boolean> {
    const initialLen = this.transactions.length;
    this.transactions = this.transactions.filter((t) => t.id !== id);
    return this.transactions.length < initialLen;
  }

  async getMonthlySummary(yearMonth: string): Promise<{ income: number; expenses: number }> {
    const monthTx = this.transactions.filter((t) => t.date.startsWith(yearMonth) && t.status !== "failed");
    const income = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expenses };
  }
}

export const transactionRepository = TransactionRepository.getInstance();
