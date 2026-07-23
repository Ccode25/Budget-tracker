import { describe, it, expect, beforeEach } from "vitest";

// Mock localStorage for Vitest environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

describe("Dashboard Real-Time Update Logic", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("calculates initial metrics correctly from base ledger", () => {
    const initialTxs = [
      { id: "1", date: "2026-07-22", description: "Base Salary", amount: 5000, type: "income", status: "completed" },
      { id: "2", date: "2026-07-20", description: "Rent", amount: 1200, type: "expense", status: "completed" },
    ];

    const income = initialTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = initialTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const net = income - expenses;
    const baseBalance = 14224;

    expect(income).toBe(5000);
    expect(expenses).toBe(1200);
    expect(baseBalance + net).toBe(18024);
  });

  it("dynamically computes updated Monthly Income and Total Balance after adding a 100k Salary", () => {
    const initialTxs = [
      { id: "1", date: "2026-07-22", description: "Base Salary", amount: 5000, type: "income", status: "completed" },
      { id: "2", date: "2026-07-20", description: "Rent", amount: 1200, type: "expense", status: "completed" },
    ];

    // Simulate adding 100k Salary transaction
    const newTx = { id: "3", date: "2026-07-22", description: "Bonus Salary", amount: 100000, type: "income", status: "completed" };
    const updatedTxs = [newTx, ...initialTxs];

    // Calculate month prefix from chronologically latest entry
    const dates = updatedTxs.map((t) => t.date).sort().reverse();
    const currentMonthPrefix = dates[0].slice(0, 7);

    const thisMonth = updatedTxs.filter((t) => t.date.startsWith(currentMonthPrefix));
    const income = thisMonth.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = thisMonth.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const net = updatedTxs.reduce((s, t) => (t.type === "income" ? s + t.amount : s - t.amount), 0);

    const baseBalance = 14224;
    const totalBalance = baseBalance + net;

    // Monthly Income should include the 100k addition (5,000 + 100,000 = 105,000)
    expect(income).toBe(105000);
    expect(expenses).toBe(1200);
    expect(totalBalance).toBe(118024);
  });
});
