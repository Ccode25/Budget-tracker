/**
 * Zod Schemas for Validation and Sanitization
 */

import { z } from "zod";

// Helper function to sanitize raw string input
export function sanitizeString(val: string): string {
  return val
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

export const TransactionSchemaValidator = z.object({
  accountId: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  description: z.string().min(1, "Description is required").transform(sanitizeString),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense", "transfer"]),
  status: z.enum(["completed", "pending", "failed"]),
  notes: z.string().optional().transform((v) => (v ? sanitizeString(v) : v)),
  tags: z.string().optional(),
  merchant: z.string().optional().transform((v) => (v ? sanitizeString(v) : v)),
});

export const BudgetSchemaValidator = z.object({
  name: z.string().min(1, "Budget name is required").transform(sanitizeString),
  period: z.enum(["monthly", "annual", "weekly", "custom"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format"),
  categories: z.string().min(1, "Category allocations required"),
  totalLimit: z.number().nonnegative("Limit must be positive"),
  color: z.string().default("#7c3aed"),
});

export const GoalSchemaValidator = z.object({
  name: z.string().min(1, "Goal name is required").transform(sanitizeString),
  targetAmount: z.number().positive("Target amount must be positive"),
  savedAmount: z.number().nonnegative("Saved amount cannot be negative").default(0),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid deadline format"),
  color: z.string().default("#10b981"),
  icon: z.string().optional(),
});
