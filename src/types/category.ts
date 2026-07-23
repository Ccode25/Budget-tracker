import type { TransactionType } from "./transaction";

export interface Category {
  id: string;
  name: string;
  color: string;     // hex color e.g. "#7c3aed"
  icon: string;      // lucide icon name e.g. "ShoppingBag"
  type: TransactionType | "both";
  isDefault: boolean;
  isActive: boolean;
  transactionCount?: number;
}
