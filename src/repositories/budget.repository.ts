import type { Budget } from "@/types/budget";
import type { Transaction } from "@/types/transaction";
import { dbClient } from "../database/client";
import { calculateBudgetSummary } from "@/features/budgets/utils/budgetUtils";

export class BudgetRepository {
  private static instance: BudgetRepository;

  public static getInstance(): BudgetRepository {
    if (!BudgetRepository.instance) {
      BudgetRepository.instance = new BudgetRepository();
    }
    return BudgetRepository.instance;
  }

  async findAll(userId?: string, preFetchedTransactions?: Transaction[]): Promise<Budget[]> {
    if (!userId) return [];
    try {
      const budgetRows = await dbClient.query<any>(
        "SELECT * FROM budgets WHERE user_id = $1 AND deleted_at IS NULL ORDER BY start_date DESC",
        [userId]
      );

      if (budgetRows.length === 0) return [];

      let transactions: Transaction[];
      if (preFetchedTransactions) {
        transactions = preFetchedTransactions;
      } else {
        // Fetch user transactions to calculate dynamic totals if not provided
        const txRows = await dbClient.query<any>(
          "SELECT * FROM transactions WHERE user_id = $1 AND deleted_at IS NULL",
          [userId]
        );

        transactions = txRows.map((r) => ({
          id: r.id,
          date: r.date,
          description: r.description,
          amount: parseFloat(r.amount),
          type: r.type,
          categoryId: r.category_id,
          accountId: r.account_id,
          status: r.status,
          merchant: r.merchant,
          notes: r.notes,
          isImported: r.is_imported,
        }));
      }

      return budgetRows.map((r) => {
        const amount = parseFloat(r.total_limit || r.totalLimit || 0);
        const startDate = r.start_date || r.startDate || new Date().toISOString().slice(0, 10);
        const endDate = r.end_date || r.endDate || new Date().toISOString().slice(0, 10);

        const rawBudget = {
          id: r.id,
          name: r.name,
          amount,
          totalLimit: amount,
          period: r.period || "monthly",
          startDate,
          endDate,
          categories: typeof r.categories === "string" ? JSON.parse(r.categories) : (r.categories || []),
          color: r.color || "#7c3aed",
          isActive: r.is_active ?? r.isActive ?? true,
        };

        const summary = calculateBudgetSummary(rawBudget, transactions);

        return {
          ...rawBudget,
          amount: summary.amount,
          totalLimit: summary.amount,
          totalSpent: summary.totalExpenses,
          totalExpenses: summary.totalExpenses,
          totalIncome: summary.totalIncome,
          remainingBudget: summary.remainingBudget,
          spentPercentage: summary.spentPercentage,
          remainingPercentage: summary.remainingPercentage,
          status: summary.status,
          transactions: summary.transactions,
        };
      });
    } catch (err) {
      console.error("BudgetRepository Neon query error:", err);
      return [];
    }
  }

  async findAllActive(userId?: string): Promise<Budget[]> {
    const all = await this.findAll(userId);
    return all.filter((b) => b.isActive !== false);
  }

  async findById(id: string, userId?: string): Promise<Budget | null> {
    const all = await this.findAll(userId);
    return all.find((b) => b.id === id) ?? null;
  }

  async create(data: Partial<Budget> & { name: string; startDate: string; endDate: string }, userId?: string): Promise<Budget> {
    const id = `bgt-${Date.now()}`;
    const amount = data.amount ?? data.totalLimit ?? 0;

    if (userId) {
      await dbClient.query(
        `INSERT INTO budgets (id, uuid, user_id, name, total_limit, total_spent, period, start_date, end_date, categories, color, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, 0.00, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
        [
          id,
          `uuid-${id}`,
          userId,
          data.name,
          amount,
          data.period || "monthly",
          data.startDate,
          data.endDate,
          JSON.stringify(data.categories || []),
          data.color || "#7c3aed",
          data.isActive ?? true,
        ]
      );

      const created = await this.findById(id, userId);
      if (created) return created;
    }

    const newBudget: Budget = {
      id,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      amount,
      totalLimit: amount,
      totalSpent: 0,
      totalExpenses: 0,
      totalIncome: 0,
      remainingBudget: amount,
      spentPercentage: 0,
      remainingPercentage: 100,
      status: "Safe",
      period: data.period || "monthly",
      categories: data.categories || [],
      color: data.color || "#7c3aed",
      isActive: data.isActive ?? true,
      transactions: [],
    };
    return newBudget;
  }

  async update(id: string, updates: Partial<Budget>, userId?: string): Promise<Budget | null> {
    if (userId) {
      const amount = updates.amount ?? updates.totalLimit;
      await dbClient.query(
        `UPDATE budgets SET 
          name = COALESCE($2, name),
          total_limit = COALESCE($3, total_limit),
          period = COALESCE($4, period),
          start_date = COALESCE($5, start_date),
          end_date = COALESCE($6, end_date),
          categories = COALESCE($7, categories),
          color = COALESCE($8, color),
          is_active = COALESCE($9, is_active),
          updated_at = NOW()
         WHERE id = $1 AND user_id = $10`,
        [
          id,
          updates.name,
          amount !== undefined ? amount : null,
          updates.period,
          updates.startDate,
          updates.endDate,
          updates.categories ? JSON.stringify(updates.categories) : null,
          updates.color,
          updates.isActive,
          userId,
        ]
      );
    }
    return this.findById(id, userId);
  }

  async delete(id: string, userId?: string): Promise<boolean> {
    if (userId) {
      const res = await dbClient.query("DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING id", [id, userId]);
      return res.length > 0;
    }
    return false;
  }
}

export const budgetRepository = BudgetRepository.getInstance();

