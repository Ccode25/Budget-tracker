import { describe, it, expect } from "vitest";
import {
  calculateSalary,
  roundToTwoDecimals,
  formatCurrency,
  DEFAULT_TAX_BRACKETS,
} from "./salaryCalculator";

describe("Salary Calculation Module", () => {
  // ── Normal Cases ─────────────────────────────────────────────────────────────
  describe("Normal Cases", () => {
    it("calculates breakdown correctly for Gross Salary: 30,000", () => {
      // 10% on first 20,000 = 2,000; 20% on next 10,000 = 2,000 -> Total = 4,000
      const result = calculateSalary(30000);
      expect(result.grossSalary).toBe(30000);
      expect(result.deductions).toBe(4000);
      expect(result.netSalary).toBe(26000);
      expect(result.formattedGross).toBe("₱30,000.00");
      expect(result.formattedDeductions).toBe("₱4,000.00");
      expect(result.formattedNet).toBe("₱26,000.00");
      expect(result.effectiveTaxRate).toBe(13.33);
    });

    it("calculates breakdown correctly for Gross Salary: 50,000", () => {
      // 10% on 20,000 = 2,000; 20% on 30,000 = 6,000 -> Total = 8,000
      const result = calculateSalary(50000);
      expect(result.grossSalary).toBe(50000);
      expect(result.deductions).toBe(8000);
      expect(result.netSalary).toBe(42000);
      expect(result.formattedGross).toBe("₱50,000.00");
      expect(result.formattedDeductions).toBe("₱8,000.00");
      expect(result.formattedNet).toBe("₱42,000.00");
      expect(result.effectiveTaxRate).toBe(16);
    });

    it("calculates breakdown correctly for Gross Salary: 100,000", () => {
      // 10% on 20,000 = 2,000; 20% on 30,000 = 6,000; 30% on 50,000 = 15,000 -> Total = 23,000
      const result = calculateSalary(100000);
      expect(result.grossSalary).toBe(100000);
      expect(result.deductions).toBe(23000);
      expect(result.netSalary).toBe(77000);
      expect(result.formattedGross).toBe("₱100,000.00");
      expect(result.formattedDeductions).toBe("₱23,000.00");
      expect(result.formattedNet).toBe("₱77,000.00");
      expect(result.effectiveTaxRate).toBe(23);
    });
  });

  // ── Boundary Cases ───────────────────────────────────────────────────────────
  describe("Boundary Cases", () => {
    it("handles 0 salary correctly", () => {
      const result = calculateSalary(0);
      expect(result.grossSalary).toBe(0);
      expect(result.deductions).toBe(0);
      expect(result.netSalary).toBe(0);
      expect(result.effectiveTaxRate).toBe(0);
    });

    it("handles salary of 1 correctly", () => {
      const result = calculateSalary(1);
      expect(result.grossSalary).toBe(1);
      expect(result.deductions).toBe(0.1);
      expect(result.netSalary).toBe(0.9);
    });

    it("handles decimal salary correctly without floating point precision issues", () => {
      const result = calculateSalary(45678.95);
      expect(result.grossSalary).toBe(45678.95);
      // 10% on 20000 = 2000; 20% on 25678.95 = 5135.79 -> Total = 7135.79
      expect(result.deductions).toBe(7135.79);
      expect(result.netSalary).toBe(38543.16);
    });

    it("handles very large salary correctly", () => {
      const result = calculateSalary(10000000); // 10M
      expect(result.grossSalary).toBe(10000000);
      expect(result.netSalary).toBe(7007000);
      expect(result.formattedGross).toBe("₱10,000,000.00");
    });
  });

  // ── Invalid Inputs ───────────────────────────────────────────────────────────
  describe("Invalid Inputs", () => {
    it("throws error for negative salary", () => {
      expect(() => calculateSalary(-5000)).toThrow("Salary cannot be negative");
    });

    it("throws error for null input", () => {
      expect(() => calculateSalary(null)).toThrow("Invalid salary input");
    });

    it("throws error for undefined input", () => {
      expect(() => calculateSalary(undefined)).toThrow("Invalid salary input");
    });

    it("throws error for empty string", () => {
      expect(() => calculateSalary("   ")).toThrow("Invalid salary input");
    });

    it("throws error for text input", () => {
      expect(() => calculateSalary("abc")).toThrow("NaN or non-numeric");
    });

    it("throws error for NaN", () => {
      expect(() => calculateSalary(NaN)).toThrow("NaN or non-numeric");
    });

    it("throws error for boolean input", () => {
      expect(() => calculateSalary(true)).toThrow("Invalid salary input");
    });
  });

  // ── Utility Helpers ──────────────────────────────────────────────────────────
  describe("Utility Helpers", () => {
    it("rounds numbers accurately to two decimal places", () => {
      expect(roundToTwoDecimals(10.1234)).toBe(10.12);
      expect(roundToTwoDecimals(10.125)).toBe(10.13);
      expect(roundToTwoDecimals(1.005)).toBe(1.01);
    });

    it("formats currency correctly", () => {
      expect(formatCurrency(1234.56)).toBe("₱1,234.56");
      expect(formatCurrency(1234.56, "EUR", "de-DE")).toContain("1.234,56");
    });
  });
});
