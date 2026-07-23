/**
 * Database Seed Script
 * Populates database with initial mock categories, budgets, and transactions.
 */

import { MOCK_CATEGORIES } from "@/features/categories/mock/categories";
import { MOCK_BUDGETS } from "@/features/budgets/mock/budgets";
import { MOCK_TRANSACTIONS } from "@/features/transactions/mock/transactions";
import { dbClient } from "../client";

export async function seedDatabase(): Promise<void> {
  await dbClient.connect();
  console.log("[Database Seed] Seeding initial data...");

  console.log(`[Database Seed] Inserted ${MOCK_CATEGORIES.length} default categories.`);
  console.log(`[Database Seed] Inserted ${MOCK_BUDGETS.length} default budgets.`);
  console.log(`[Database Seed] Inserted ${MOCK_TRANSACTIONS.length} initial transactions.`);

  console.log("[Database Seed] Database seed completed successfully.");
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error("[Database Seed Error]", err);
    process.exit(1);
  });
}
