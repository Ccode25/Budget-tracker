/**
 * Goal Repository
 * Encapsulates database operations for savings goals management.
 */

import type { GoalSchema } from "@/database/schema";
import { SAVINGS_GOALS } from "@/features/analytics/mock/analytics";

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

  async findAll(includeDeleted = false): Promise<GoalSchema[]> {
    if (includeDeleted) return [...this.goals];
    return this.goals.filter((g) => !g.deletedAt);
  }

  async findById(id: string): Promise<GoalSchema | null> {
    return this.goals.find((g) => g.id === id && !g.deletedAt) ?? null;
  }

  async findByUuid(uuid: string): Promise<GoalSchema | null> {
    return this.goals.find((g) => g.uuid === uuid && !g.deletedAt) ?? null;
  }

  async create(data: Omit<GoalSchema, "id" | "uuid" | "createdAt" | "updatedAt">): Promise<GoalSchema> {
    const timestamp = new Date().toISOString();
    const newGoal: GoalSchema = {
      ...data,
      id: `goal-${Date.now()}`,
      uuid: `goal-uuid-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
    };
    this.goals.unshift(newGoal);
    return newGoal;
  }

  async update(id: string, updates: Partial<GoalSchema>): Promise<GoalSchema | null> {
    const index = this.goals.findIndex((g) => g.id === id && !g.deletedAt);
    if (index === -1) return null;

    this.goals[index] = {
      ...this.goals[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.goals[index];
  }

  async softDelete(id: string): Promise<boolean> {
    const goal = await this.findById(id);
    if (!goal) return false;
    goal.deletedAt = new Date().toISOString();
    return true;
  }
}

export const goalRepository = GoalRepository.getInstance();
