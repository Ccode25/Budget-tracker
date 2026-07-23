import type { GoalSchema } from "@/database/schema";
import { SAVINGS_GOALS } from "@/features/analytics/mock/analytics";
import { dbClient } from "../database/client";

export class GoalRepository {
  private static instance: GoalRepository;
  private goals: GoalSchema[] = SAVINGS_GOALS.map((g, idx) => ({
    id: g.id,
    uuid: `goal-uuid-${idx + 1}`,
    userId: "usr-001",
    name: g.name,
    targetAmount: g.target,
    savedAmount: g.saved,
    deadline: g.deadline,
    color: g.color,
    icon: g.icon,
    isCompleted: g.saved >= g.target,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  }));

  public static getInstance(): GoalRepository {
    if (!GoalRepository.instance) {
      GoalRepository.instance = new GoalRepository();
    }
    return GoalRepository.instance;
  }

  async findAll(userId?: string, includeDeleted = false): Promise<GoalSchema[]> {
    if (userId) {
      try {
        const rows = await dbClient.query<any>(
          `SELECT * FROM goals WHERE user_id = $1 ${includeDeleted ? "" : "AND deleted_at IS NULL"}`,
          [userId]
        );
        return rows.map((r) => ({
          id: r.id,
          uuid: r.uuid || r.id,
          userId: r.user_id,
          name: r.name,
          targetAmount: parseFloat(r.target_amount || r.targetAmount || 0),
          savedAmount: parseFloat(r.saved_amount || r.savedAmount || 0),
          deadline: r.deadline ? new Date(r.deadline).toISOString() : new Date().toISOString(),
          color: r.color || "#10b981",
          icon: r.icon || "PiggyBank",
          isCompleted: r.is_completed ?? (parseFloat(r.saved_amount || 0) >= parseFloat(r.target_amount || 1)),
          createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
          updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
          deletedAt: r.deleted_at ? new Date(r.deleted_at).toISOString() : null,
        }));
      } catch (err) {
        console.error("GoalRepository Neon query error:", err);
      }
    }
    return userId ? [] : (includeDeleted ? [...this.goals] : this.goals.filter((g) => !g.deletedAt));
  }

  async findById(id: string, userId?: string): Promise<GoalSchema | null> {
    const all = await this.findAll(userId);
    return all.find((g) => g.id === id) ?? null;
  }

  async create(data: Omit<GoalSchema, "id" | "uuid" | "createdAt" | "updatedAt">, userId?: string): Promise<GoalSchema> {
    const timestamp = new Date().toISOString();
    const id = `goal-${Date.now()}`;
    const newGoal: GoalSchema = {
      ...data,
      id,
      uuid: `goal-uuid-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
    };

    if (userId) {
      await dbClient.query(
        `INSERT INTO goals (id, uuid, user_id, name, target_amount, saved_amount, deadline, color, icon, is_completed, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
        [
          id,
          `uuid-${id}`,
          userId,
          data.name,
          data.targetAmount,
          data.savedAmount || 0,
          data.deadline,
          data.color || "#10b981",
          data.icon || "PiggyBank",
          data.isCompleted || false,
        ]
      );
    }
    return newGoal;
  }

  async update(id: string, updates: Partial<GoalSchema>, userId?: string): Promise<GoalSchema | null> {
    const index = this.goals.findIndex((g) => g.id === id && !g.deletedAt);
    if (index !== -1) {
      this.goals[index] = { ...this.goals[index], ...updates };
    }
    return this.findById(id, userId);
  }

  async softDelete(id: string, userId?: string): Promise<boolean> {
    if (userId) {
      const res = await dbClient.query("DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id", [id, userId]);
      return res.length > 0;
    }
    const goal = await this.findById(id);
    if (!goal) return false;
    goal.deletedAt = new Date().toISOString();
    return true;
  }
}

export const goalRepository = GoalRepository.getInstance();
