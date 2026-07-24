import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { transactionRepository } from "@/repositories/transaction.repository";
import { categoryRepository } from "@/repositories/category.repository";
import { settingsRepository } from "@/repositories/settings.repository";
import { userRepository } from "@/repositories/user.repository";
import { dbClient } from "@/database/client";
import { onboardingService } from "@/features/onboarding/onboarding.service";

describe("CRUD Operations — Final Testing Suite", () => {
  const testUserId = "crud-test-" + Date.now();
  const testUserEmail = "crud-test-" + Date.now() + "@example.com";

  beforeAll(async () => {
    const user = await userRepository.create({
      email: testUserEmail,
      name: "CRUD Test User",
      role: "user",
      emailVerified: true,
    });
    await onboardingService.initializeNewUser(user.id);
  });

  afterEach(async () => {
    try {
      await dbClient.query("DELETE FROM transactions WHERE user_id = $1", [testUserId]);
      await dbClient.query("DELETE FROM categories WHERE user_id = $1", [testUserId]);
      await dbClient.query("DELETE FROM settings WHERE user_id = $1", [testUserId]);
      await dbClient.query("DELETE FROM users WHERE id = $1", [testUserId]);
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("1. Transactions", () => {
    it("creates a transaction", async () => {
      const tx = await transactionRepository.create(
        {
          date: "2026-07-01",
          description: "Test Transaction",
          amount: 100.50,
          type: "expense",
          categoryId: "cat-housing",
          status: "completed",
        },
        testUserId
      );

      expect(tx.id).toBeDefined();
      expect(tx.description).toBe("Test Transaction");
      expect(tx.amount).toBe(100.50);
      expect(tx.type).toBe("expense");
    });

    it("reads transactions scoped to user", async () => {
      await transactionRepository.create(
        {
          date: "2026-07-02",
          description: "User Tx",
          amount: 50,
          type: "income",
          categoryId: "cat-salary",
          status: "completed",
        },
        testUserId
      );

      const { data } = await transactionRepository.findAll(testUserId);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].description).toBe("User Tx");
    });

    it("updates a transaction", async () => {
      const tx = await transactionRepository.create(
        {
          date: "2026-07-04",
          description: "Original",
          amount: 75,
          type: "expense",
          categoryId: "cat-shopping",
          status: "pending",
        },
        testUserId
      );

      const updated = await transactionRepository.update(tx.id, {
        description: "Updated Description",
        amount: 99.99,
      }, testUserId);

      expect(updated).not.toBeNull();
      expect(updated.description).toBe("Updated Description");
      expect(updated.amount).toBe(99.99);
    });

    it("deletes a transaction", async () => {
      const tx = await transactionRepository.create(
        {
          date: "2026-07-05",
          description: "To Be Deleted",
          amount: 10,
          type: "expense",
          categoryId: "cat-food",
          status: "completed",
        },
        testUserId
      );

      const deleted = await transactionRepository.delete(tx.id, testUserId);
      expect(deleted).toBe(true);

      const found = await transactionRepository.findById(tx.id, testUserId);
      expect(found).toBeNull();
    });
  });

  describe("2. Settings", () => {
    it("reads user settings", async () => {
      const settings = await settingsRepository.getByUserId(testUserId);
      expect(settings).toBeDefined();
      expect(settings.currency).toBe("PHP");
    });

    it("updates user settings", async () => {
      const updated = await settingsRepository.updateByUserId(testUserId, {
        currency: "USD",
        currencySymbol: "$",
      });

      expect(updated.currency).toBe("USD");
      expect(updated.currencySymbol).toBe("$");
    });
  });
});
