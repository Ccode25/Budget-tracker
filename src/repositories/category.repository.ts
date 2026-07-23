/**
 * Category Repository
 * Encapsulates database operations for category entity management.
 */

import type { Category } from "@/types/category";
import { MOCK_CATEGORIES } from "@/features/categories/mock/categories";

export class CategoryRepository {
  private static instance: CategoryRepository;
  private categories: Category[] = [...MOCK_CATEGORIES];

  public static getInstance(): CategoryRepository {
    if (!CategoryRepository.instance) {
      CategoryRepository.instance = new CategoryRepository();
    }
    return CategoryRepository.instance;
  }

  async findAll(): Promise<Category[]> {
    return [...this.categories];
  }

  async findActive(): Promise<Category[]> {
    return this.categories.filter((c) => c.isActive);
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.find((c) => c.id === id) ?? null;
  }

  async create(data: Omit<Category, "id">): Promise<Category> {
    const newCat: Category = {
      ...data,
      id: `cat-${Date.now()}`,
    };
    this.categories.unshift(newCat);
    return newCat;
  }

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;

    this.categories[index] = { ...this.categories[index], ...updates };
    return this.categories[index];
  }

  async delete(id: string): Promise<boolean> {
    const initialLen = this.categories.length;
    this.categories = this.categories.filter((c) => c.id !== id);
    return this.categories.length < initialLen;
  }
}

export const categoryRepository = CategoryRepository.getInstance();
