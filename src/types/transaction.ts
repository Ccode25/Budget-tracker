export type TransactionType = "income" | "expense" | "transfer";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  description: string;
  amount: number; // always positive; type determines direction
  type: TransactionType;
  categoryId: string;
  status: TransactionStatus;
  notes?: string;
  tags?: string[];
  merchant?: string;
  importedFrom?: string; // filename if imported
  isImported?: boolean;
}

export interface TransactionFilters {
  search: string;
  types: TransactionType[];
  categoryIds: string[];
  statuses: TransactionStatus[];
  dateFrom: string | null;
  dateTo: string | null;
  amountMin: number | null;
  amountMax: number | null;
}

export type TransactionSortField = "date" | "amount" | "description" | "category";
export type SortDirection = "asc" | "desc";

export interface TransactionSort {
  field: TransactionSortField;
  direction: SortDirection;
}
