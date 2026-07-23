import { ColumnMapping, StandardField } from "@/types/import";

const COMMON_HEADER_MAP: Record<StandardField, string[]> = {
  date: ["date", "posting date", "transaction date", "trans date", "tx date", "time"],
  description: ["description", "payee", "merchant", "details", "narrative", "name", "memo", "desc"],
  amount: ["amount", "tx amount", "sum", "total", "net amount"],
  debit: ["debit", "withdrawal", "outflow", "spent", "expense"],
  credit: ["credit", "deposit", "inflow", "received", "income"],
  balance: ["balance", "running balance", "total balance"],
  category: ["category", "cat", "classification", "tag"],
  notes: ["notes", "memo", "comment", "remark"],
  ignore: [],
};

export function autoMapColumns(headers: string[]): ColumnMapping[] {
  return headers.map((header) => {
    const clean = header.toLowerCase().replace(/[^a-z0-9]/g, " ").trim();
    let matchedField: StandardField | null = null;

    for (const [field, keywords] of Object.entries(COMMON_HEADER_MAP)) {
      if (keywords.some((kw) => clean.includes(kw))) {
        matchedField = field as StandardField;
        break;
      }
    }

    return {
      sourceHeader: header,
      targetField: matchedField,
    };
  });
}
