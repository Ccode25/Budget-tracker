/**
 * Budget Repository
 * Encapsulates database operations for budget entity management.
 */

import type { Budget } from "@/types/budget";
import { MOCK_BUDGETS } from "@/features/budgets/mock/budgets";

export class BudgetRepository {
  private static instance: BudgetRepository;
  private budgets: Budget[] = [...MOCK_BUDGETS];

  public static getInstance(): BudgetRepository {
    if (!BudgetRepository.instance) {
      BudgetRepository.instance = new BudgetRepository();
    }
    return BudgetRepository.instance;
  }

  async findAll(): Promise<Budget[]> {
    return [...this.budgets];
  }

  async findAllActive(): Promise<Budget[]> {
    return this.budgets.filter((b) => b.isActive);
  }

  async findById(id: string): Promise<Budget | null> {
    return this.budgets.find((b) => b.id === id) ?? null;
  }

  async create(data: Omit<Budget, "id">): Promise<Budget> {
    const newBudget: Budget = {
      ...data,
      id: `bgt-${Date.now()}`,
    };
    this.budgets.unshift(newBudget);
    return newBudget;
  }

  async update(id: string, updates: Partial<Budget>): Promise<Budget | null> {
    const index = this.budgets.findIndex((b) => b.id === id);
    if (index === -1) return null;

    this.budgets[index] = { ...this.budgets[index], ...updates };
    return this.budgets[index];
  }

  async delete(id: string): Promise<boolean> {
    const initialLen = this.budgets.length;
    this.budgets = this.budgets.filter((b) => b.id !== id);
    return this.budgets.length < initialLen;
  }
}

export const budgetRepository = BudgetRepository.getInstance();
