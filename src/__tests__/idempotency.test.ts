import { describe, it, expect, afterEach, beforeAll } from "vitest";
import { onboardingService } from "@/features/onboarding/onboarding.service";
import { categoryRepository } from "@/repositories/category.repository";
import { settingsRepository } from "@/repositories/settings.repository";
import { userRepository } from "@/repositories/user.repository";
import { dbClient } from "@/database/client";

describe("Onboarding Idempotency — Final Testing Suite", () => {
  const userId1 = "idemp-test-" + Date.now() + "-1";

  beforeAll(async () => {
    const user = await userRepository.create({
      email: "idemp-test-" + Date.now() + "@example.com",
      name: "Idempotency Test User",
      role: "user",
      emailVerified: true,
    });
    await onboardingService.initializeNewUser(user.id);
  });

  afterEach(async () => {
    try {
      await dbClient.query("DELETE FROM settings WHERE user_id = $1", [userId1]);
      await dbClient.query("DELETE FROM categories WHERE user_id = $1", [userId1]);
      await dbClient.query("DELETE FROM users WHERE id = $1", [userId1]);
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("1. No Duplicate Onboarding", () => {
    it("onboards a new user exactly once", async () => {
      const result = await onboardingService.initializeNewUser(userId1);
      expect(result.categoriesCreated).toBeGreaterThan(0);
      expect(result.settingsCreated).toBe(true);
    });

    it("returns zero categories created on second call", async () => {
      await onboardingService.initializeNewUser(userId1);
      const secondResult = await onboardingService.initializeNewUser(userId1);

      expect(secondResult.categoriesCreated).toBe(0);
      expect(secondResult.settingsCreated).toBe(false);
      expect(secondResult.success).toBe(true);
    });
  });

  describe("2. Category Content Verification", () => {
    it("creates correct default category structure", async () => {
      const user = await userRepository.create({
        email: "struct-test-" + Date.now() + "@example.com",
        name: "Structure Test User",
        role: "user",
        emailVerified: true,
      });
      await onboardingService.initializeNewUser(user.id);

      const categories = await categoryRepository.findAll(user.id);
      const housing = categories.find((c) => c.name === "Housing");
      const salary = categories.find((c) => c.name === "Salary");

      expect(housing).toBeDefined();
      expect(housing.type).toBe("expense");
      expect(housing.isDefault).toBe(true);
      expect(housing.isActive).toBe(true);

      expect(salary).toBeDefined();
      expect(salary.type).toBe("income");
      expect(salary.isDefault).toBe(true);
    });
  });
});
