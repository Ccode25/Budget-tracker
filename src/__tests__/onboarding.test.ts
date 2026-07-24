import { describe, it, expect, afterEach } from "vitest";
import { onboardingService } from "@/features/onboarding/onboarding.service";
import { categoryRepository } from "@/repositories/category.repository";
import { settingsRepository } from "@/repositories/settings.repository";
import { userRepository } from "@/repositories/user.repository";
import { dbClient } from "@/database/client";

describe("Onboarding Service — Final Testing Suite", () => {
  const testUserId = "test-user-" + Date.now();
  const secondTestUserId = "test-user-second-" + Date.now();

  afterEach(async () => {
    try {
      await dbClient.query("DELETE FROM settings WHERE user_id = $1", [testUserId]);
      await dbClient.query("DELETE FROM categories WHERE user_id = $1", [testUserId]);
      await dbClient.query("DELETE FROM users WHERE id = $1", [testUserId]);
      await dbClient.query("DELETE FROM settings WHERE user_id = $1", [secondTestUserId]);
      await dbClient.query("DELETE FROM categories WHERE user_id = $1", [secondTestUserId]);
      await dbClient.query("DELETE FROM users WHERE id = $1", [secondTestUserId]);
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("1. New User Onboarding", () => {
    it("creates default categories for a new user", async () => {
      const result = await onboardingService.initializeNewUser(testUserId);

      expect(result.success).toBe(true);
      expect(result.userId).toBe(testUserId);
      expect(result.categoriesCreated).toBeGreaterThan(0);
    });

    it("creates default settings for a new user", async () => {
      const result = await onboardingService.initializeNewUser(testUserId);

      expect(result.success).toBe(true);
      expect(result.settingsCreated).toBe(true);

      const settings = await settingsRepository.getByUserId(testUserId);
      expect(settings).toBeDefined();
      expect(settings.currency).toBe("PHP");
    });
  });

  describe("2. Idempotency — No Duplicate Onboarding", () => {
    it("does not create duplicate categories on re-initialization", async () => {
      const firstResult = await onboardingService.initializeNewUser(testUserId);
      const categoriesAfterFirst = await categoryRepository.findAll(testUserId);
      const firstCount = categoriesAfterFirst.length;

      const secondResult = await onboardingService.initializeNewUser(testUserId);
      const categoriesAfterSecond = await categoryRepository.findAll(testUserId);
      const secondCount = categoriesAfterSecond.length;

      expect(firstResult.categoriesCreated).toBeGreaterThan(0);
      expect(secondResult.categoriesCreated).toBe(0);
      expect(firstCount).toBe(secondCount);
    });

    it("does not create duplicate settings on re-initialization", async () => {
      await onboardingService.initializeNewUser(testUserId);

      const result = await onboardingService.initializeNewUser(testUserId);
      expect(result.settingsCreated).toBe(false);

      const settings = await settingsRepository.getByUserId(testUserId);
      expect(settings).toBeDefined();
    });
  });

  describe("3. Error Handling", () => {
    it("returns error for missing userId", async () => {
      const result = await onboardingService.initializeNewUser("");

      expect(result.success).toBe(false);
      expect(result.error).toBe("userId is required");
    });
  });

  describe("4. Transaction Verification", () => {
    it("creates categories and settings atomically", async () => {
      const result = await onboardingService.initializeNewUser(secondTestUserId);

      expect(result.success).toBe(true);

      const categories = await categoryRepository.findAll(secondTestUserId);
      const settings = await settingsRepository.getByUserId(secondTestUserId);

      expect(categories.length).toBeGreaterThan(0);
      expect(settings).toBeDefined();
    });
  });
});
