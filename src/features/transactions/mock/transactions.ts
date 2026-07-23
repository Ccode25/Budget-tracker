import type { Transaction } from "@/types/transaction";

// Clean state for real user databases (no mock sample transactions)
export const MOCK_TRANSACTIONS: Transaction[] = [];

export const getTransactionById = (id: string) =>
  MOCK_TRANSACTIONS.find((t) => t.id === id);
