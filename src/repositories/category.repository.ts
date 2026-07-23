import type { Category } from "@/types/category";
import { dbClient } from "../database/client";

export const DEFAULT_CATEGORIES: Array<{ code: string; name: string; type: "expense" | "income"; color: string; icon: string }> = [
  // 14 Default Expense Categories
  { code: "HO", name: "Housing", type: "expense", color: "#7c3aed", icon: "Home" },
  { code: "FO", name: "Food & Dining", type: "expense", color: "#f59e0b", icon: "Utensils" },
  { code: "TR", name: "Transportation", type: "expense", color: "#0ea5e9", icon: "Car" },
  { code: "SH", name: "Shopping", type: "expense", color: "#ec4899", icon: "ShoppingBag" },
  { code: "UT", name: "Utilities", type: "expense", color: "#6366f1", icon: "Zap" },
  { code: "EN", name: "Entertainment", type: "expense", color: "#8b5cf6", icon: "Film" },
  { code: "HE", name: "Health", type: "expense", color: "#14b8a6", icon: "Stethoscope" },
  { code: "ED", name: "Education", type: "expense", color: "#3b82f6", icon: "GraduationCap" },
  { code: "TRV", name: "Travel", type: "expense", color: "#059669", icon: "Plane" },
  { code: "INS", name: "Insurance", type: "expense", color: "#ef4444", icon: "ShieldCheck" },
  { code: "SUB", name: "Subscriptions", type: "expense", color: "#d946ef", icon: "CreditCard" },
  { code: "PC", name: "Personal Care", type: "expense", color: "#10b981", icon: "Smile" },
  { code: "GC", name: "Gifts & Charity", type: "expense", color: "#f43f5e", icon: "Heart" },
  { code: "PET", name: "Pets", type: "expense", color: "#84cc16", icon: "Dog" },

  // 4 Default Income Categories
  { code: "SA", name: "Salary", type: "income", color: "#10b981", icon: "Briefcase" },
  { code: "FR", name: "Freelance", type: "income", color: "#0ea5e9", icon: "Laptop" },
  { code: "INV", name: "Investment", type: "income", color: "#8b5cf6", icon: "TrendingUp" },
  { code: "RENT", name: "Rental Income", type: "income", color: "#f59e0b", icon: "Key" },
];

export class CategoryRepository {
  private static instance: CategoryRepository;

  public static getInstance(): CategoryRepository {
    if (!CategoryRepository.instance) {
      CategoryRepository.instance = new CategoryRepository();
    }
    return CategoryRepository.instance;
  }

  /**
   * Seeds 18 default categories (14 expense, 4 income) for a new user if they don't exist
   */
  async seedDefaultCategories(userId: string): Promise<number> {
    if (!userId) return 0;

    let createdCount = 0;
    try {
      const existing = await this.findAll(userId);
      const existingNames = new Set(existing.map((c) => c.name.toLowerCase()));

      for (const cat of DEFAULT_CATEGORIES) {
        if (!existingNames.has(cat.name.toLowerCase())) {
          const catId = `cat-${cat.code.toLowerCase()}-${userId.slice(-6)}`;
          await dbClient.query(
            `INSERT INTO categories (id, uuid, user_id, name, color, icon, type, is_default, is_active, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, true, true, NOW(), NOW())
             ON CONFLICT (id) DO NOTHING`,
            [catId, `uuid-${catId}`, userId, cat.name, cat.color, cat.icon, cat.type]
          );
          createdCount++;
        }
      }
    } catch (err) {
      console.error("Failed to seed default categories for user:", userId, err);
    }
    return createdCount;
  }

  async findAll(userId?: string): Promise<Category[]> {
    try {
      const queryStr = userId
        ? "SELECT * FROM categories WHERE (user_id = $1 OR user_id IS NULL) AND deleted_at IS NULL"
        : "SELECT * FROM categories WHERE user_id IS NULL AND deleted_at IS NULL";
      const params = userId ? [userId] : [];

      const rows = await dbClient.query<any>(queryStr, params);
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        color: r.color,
        icon: r.icon,
        type: r.type,
        isDefault: r.is_default ?? r.isDefault ?? false,
        isActive: r.is_active ?? r.isActive ?? true,
      }));
    } catch (err) {
      console.error("CategoryRepository Neon query error:", err);
      return [];
    }
  }

  async findActive(userId?: string): Promise<Category[]> {
    const all = await this.findAll(userId);
    return all.filter((c) => c.isActive);
  }

  async findById(id: string, userId?: string): Promise<Category | null> {
    const all = await this.findAll(userId);
    return all.find((c) => c.id === id) ?? null;
  }

  async create(data: Omit<Category, "id">, userId?: string): Promise<Category> {
    const id = `cat-${Date.now()}`;
    const newCat: Category = { ...data, id };

    await dbClient.query(
      `INSERT INTO categories (id, uuid, user_id, name, color, icon, type, is_default, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
      [
        id,
        `uuid-${id}`,
        userId || null,
        data.name,
        data.color || "#10b981",
        data.icon || "Folder",
        data.type,
        data.isDefault || false,
        data.isActive ?? true,
      ]
    );

    return newCat;
  }

  async update(id: string, updates: Partial<Category>, userId?: string): Promise<Category | null> {
    if (userId) {
      await dbClient.query(
        "UPDATE categories SET name = COALESCE($2, name), color = COALESCE($3, color), updated_at = NOW() WHERE id = $1 AND (user_id = $4 OR user_id IS NULL)",
        [id, updates.name, updates.color, userId]
      );
    }
    return this.findById(id, userId);
  }

  async delete(id: string, userId?: string): Promise<boolean> {
    if (userId) {
      const res = await dbClient.query("DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id", [id, userId]);
      return res.length > 0;
    }
    return false;
  }
}

export const categoryRepository = CategoryRepository.getInstance();
