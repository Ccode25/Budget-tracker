/**
 * Database Schemas & Models Definition
 * Standardized table structures and TypeScript types incorporating core fields:
 * id, uuid, createdAt, updatedAt, deletedAt, foreign keys, and constraints.
 */

import type { TransactionType, TransactionStatus } from "@/types/transaction";
import type { BudgetPeriod } from "@/types/budget";

export interface BaseEntitySchema {
  id: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export type UserRole = "user" | "admin";

export interface UserSchema extends BaseEntitySchema {
  email: string;
  name: string;
  avatarUrl?: string;
  passwordHash?: string | null;
  role: UserRole;
  emailVerified: boolean;
  googleId?: string | null;
  resetTokenHash?: string | null;
  resetTokenExpires?: string | null;
}

export interface RefreshTokenSchema {
  id: string;
  uuid: string;
  userId: string;
  tokenHash: string;
  familyId: string;
  isRevoked: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface AccountSchema extends BaseEntitySchema {
  userId: string; // Foreign Key -> users(id)
  name: string;
  type: "checking" | "savings" | "credit_card" | "investment" | "cash";
  balance: number;
  currency: string;
  accountNumberMasked?: string;
  color?: string;
  isActive: boolean;
}

export interface CategorySchema extends BaseEntitySchema {
  userId?: string | null; // Foreign Key -> users(id), null for system default categories
  name: string;
  color: string;
  icon: string;
  type: TransactionType | "both";
  isDefault: boolean;
  isActive: boolean;
}

export interface TransactionSchema extends BaseEntitySchema {
  userId: string; // Foreign Key -> users(id)
  accountId?: string | null; // Foreign Key -> accounts(id)
  categoryId: string; // Foreign Key -> categories(id)
  date: string; // YYYY-MM-DD
  description: string;
  amount: number; // Constraint: amount >= 0
  type: TransactionType; // Constraint: 'income' | 'expense' | 'transfer'
  status: TransactionStatus; // Constraint: 'completed' | 'pending' | 'failed'
  notes?: string;
  tags?: string; // JSON array string e.g. "[\"work\",\"tax\"]"
  merchant?: string;
  importedFrom?: string;
  isImported: boolean;
}

export interface BudgetSchema extends BaseEntitySchema {
  userId: string; // Foreign Key -> users(id)
  name: string;
  period: BudgetPeriod; // Constraint: 'monthly' | 'annual' | 'weekly' | 'custom'
  startDate: string;
  endDate: string;
  categories: string; // JSON string of BudgetCategoryAllocation[]
  totalLimit: number; // Constraint: totalLimit >= 0
  totalSpent: number; // Constraint: totalSpent >= 0
  color: string;
  isActive: boolean;
}

export interface GoalSchema extends BaseEntitySchema {
  userId: string; // Foreign Key -> users(id)
  name: string;
  targetAmount: number; // Constraint: targetAmount >= 0
  savedAmount: number; // Constraint: savedAmount >= 0
  deadline: string; // YYYY-MM-DD
  color: string;
  icon?: string;
  isCompleted: boolean;
}

export interface SettingsSchema extends BaseEntitySchema {
  userId: string; // Foreign Key -> users(id) (Unique)
  currency: string;
  currencySymbol: string;
  language: string;
  dateFormat: string;
  numberFormat: "comma" | "period";
  importPreferences: string; // JSON string of ImportPreferences
}

export interface SessionSchema {
  id: string;
  uuid: string;
  userId: string; // Foreign Key -> users(id)
  token: string; // Unique session token
  expiresAt: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
}
