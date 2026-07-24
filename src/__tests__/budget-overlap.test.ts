import { describe, it, expect } from "vitest";
import { checkBudgetOverlap, calculateBudgetSummary } from "../features/budgets/utils/budgetUtils";
import type { Transaction } from "@/types/transaction";

describe("Budget Date Range Overlap Validation", () => {
  const julyBudget = { startDate: "2026-07-01", endDate: "2026-07-31" };

  it("allows non-overlapping budget periods (July 1-31 and August 1-31)", () => {
    const augBudget = { startDate: "2026-08-01", endDate: "2026-08-31" };
    const overlaps = checkBudgetOverlap(
      julyBudget.startDate,
      julyBudget.endDate,
      augBudget.startDate,
      augBudget.endDate
    );
    expect(overlaps).toBe(false);
  });

  it("detects overlapping budget period (July 15-August 15 vs July 1-31)", () => {
    const invalidBudget = { startDate: "2026-07-15", endDate: "2026-08-15" };
    const overlaps = checkBudgetOverlap(
      invalidBudget.startDate,
      invalidBudget.endDate,
      julyBudget.startDate,
      julyBudget.endDate
    );
    expect(overlaps).toBe(true);
  });

  it("detects overlapping budget period (July 20-July 31 vs July 1-31)", () => {
    const invalidBudget = { startDate: "2026-07-20", endDate: "2026-07-31" };
    const overlaps = checkBudgetOverlap(
      invalidBudget.startDate,
      invalidBudget.endDate,
      julyBudget.startDate,
      julyBudget.endDate
    );
    expect(overlaps).toBe(true);
  });

  it("detects overlapping budget period (June 20-July 10 vs July 1-31)", () => {
    const invalidBudget = { startDate: "2026-06-20", endDate: "2026-07-10" };
    const overlaps = checkBudgetOverlap(
      invalidBudget.startDate,
      invalidBudget.endDate,
      julyBudget.startDate,
      julyBudget.endDate
    );
    expect(overlaps).toBe(true);
  });
});

describe("Dynamic Expense Calculation and Budget Summaries", () => {
  const julyBudget = {
    amount: 50000,
    startDate: "2026-07-01",
    endDate: "2026-07-31",
  };

  const sampleTransactions: Transaction[] = [
    {
      id: "tx-1",
      date: "2026-07-05",
      description: "Food",
      amount: 500,
      type: "expense",
      categoryId: "cat-food",
      status: "completed",
    },
    {
      id: "tx-2",
      date: "2026-07-10",
      description: "Fuel",
      amount: 1000,
      type: "expense",
      categoryId: "cat-transport",
      status: "completed",
    },
    {
      id: "tx-3",
      date: "2026-08-03",
      description: "Grocery",
      amount: 800,
      type: "expense",
      categoryId: "cat-groceries",
      status: "completed",
    },
  ];

  it("assigns transactions strictly by transaction_date within budget start_date and end_date", () => {
    const summary = calculateBudgetSummary(julyBudget, sampleTransactions);

    // July budget should only include tx-1 (500) and tx-2 (1000)
    expect(summary.transactions.length).toBe(2);
    expect(summary.totalExpenses).toBe(1500);
    expect(summary.remainingBudget).toBe(48500);
    expect(summary.spentPercentage).toBe(3);
    expect(summary.remainingPercentage).toBe(97);
    expect(summary.status).toBe("Safe");

    // tx-3 (August 3) must NOT be included in July budget
    const tx3InJuly = summary.transactions.some((t) => t.id === "tx-3");
    expect(tx3InJuly).toBe(false);
  });

  it("calculates August budget independently without affecting July budget", () => {
    const augBudget = {
      amount: 60000,
      startDate: "2026-08-01",
      endDate: "2026-08-31",
    };

    const summary = calculateBudgetSummary(augBudget, sampleTransactions);

    expect(summary.transactions.length).toBe(1);
    expect(summary.transactions[0].id).toBe("tx-3");
    expect(summary.totalExpenses).toBe(800);
    expect(summary.remainingBudget).toBe(59200);
    expect(summary.status).toBe("Safe");
  });

  it("determines Warning and Over Budget statuses correctly based on spent percentage", () => {
    // 85% spent -> Warning
    const warningBudget = calculateBudgetSummary(
      { amount: 1000, startDate: "2026-07-01", endDate: "2026-07-31" },
      [{ id: "1", date: "2026-07-05", description: "Test", amount: 850, type: "expense", categoryId: "c1", status: "completed" }]
    );
    expect(warningBudget.status).toBe("Warning");

    // 110% spent -> Over Budget
    const overBudget = calculateBudgetSummary(
      { amount: 1000, startDate: "2026-07-01", endDate: "2026-07-31" },
      [{ id: "2", date: "2026-07-05", description: "Test", amount: 1100, type: "expense", categoryId: "c1", status: "completed" }]
    );
    expect(overBudget.status).toBe("Over Budget");
  });
});
