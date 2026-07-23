import type { Budget } from "@/types/budget";
import { dbClient } from "../database/client";

export class BudgetRepository {
  private static instance: BudgetRepository;
  private budgets: Budget[] = [];

  public static getInstance(): BudgetRepository {
    if (!BudgetRepository.instance) {
      BudgetRepository.instance = new BudgetRepository();
    }
    return BudgetRepository.instance;
  }

  async findAll(userId?: string): Promise<Budget[]> {
    if (userId) {
      try {
        const rows = await dbClient.query<any>(
          "SELECT * FROM budgets WHERE user_id = $1 AND deleted_at IS NULL",
          [userId]
        );
        return rows.map((r) => ({
          id: r.id,
          name: r.name,
          totalLimit: parseFloat(r.total_limit || r.totalLimit || 0),
          totalSpent: parseFloat(r.total_spent || r.totalSpent || 0),
          period: r.period || "monthly",
          startDate: r.start_date || r.startDate || new Date().toISOString(),
          endDate: r.end_date || r.endDate || new Date().toISOString(),
          categories: typeof r.categories === "string" ? JSON.parse(r.categories) : (r.categories || []),
          color: r.color || "#7c3aed",
          isActive: r.is_active ?? r.isActive ?? true,
        }));
      } catch (err) {
        console.error("BudgetRepository Neon query error:", err);
      }
    }
    return [];
  }

  async findAllActive(userId?: string): Promise<Budget[]> {
    const all = await this.findAll(userId);
    return all.filter((b) => b.isActive);
  }

  async findById(id: string, userId?: string): Promise<Budget | null> {
    const all = await this.findAll(userId);
    return all.find((b) => b.id === id) ?? null;
  }

  async create(data: Omit<Budget, "id">, userId?: string): Promise<Budget> {
    const id = `bgt-${Date.now()}`;
    const newBudget: Budget = { ...data, id };

    if (userId) {
      await dbClient.query(
        `INSERT INTO budgets (id, uuid, user_id, name, total_limit, total_spent, period, start_date, end_date, categories, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
        [
          id,
          `uuid-${id}`,
          userId,
          data.name,
          data.totalLimit,
          data.totalSpent || 0,
          data.period || "monthly",
          data.startDate,
          data.endDate,
          JSON.stringify(data.categories || []),
          data.isActive ?? true,
        ]
      );
    }
    return newBudget;
  }

  async update(id: string, updates: Partial<Budget>, userId?: string): Promise<Budget | null> {
    if (userId) {
      await dbClient.query(
        "UPDATE budgets SET name = COALESCE($2, name), total_limit = COALESCE($3, total_limit), updated_at = NOW() WHERE id = $1 AND user_id = $4",
        [id, updates.name, updates.totalLimit, userId]
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
