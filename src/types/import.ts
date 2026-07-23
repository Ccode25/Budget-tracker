import type { Transaction } from "./transaction";

export type ImportStep =
  | "upload"
  | "validate"
  | "map"
  | "preview"
  | "categorize"
  | "review"
  | "complete";

export type ImportFileFormat = "csv" | "xlsx" | "unknown";

export interface RawRow {
  [header: string]: string;
}

export interface ParseResult {
  headers: string[];
  rows: RawRow[];
  totalRows: number;
  format: ImportFileFormat;
  errors: string[];
}

export interface ColumnMapping {
  sourceHeader: string;
  targetField: StandardField | null;
}

export type StandardField =
  | "date"
  | "description"
  | "amount"
  | "debit"
  | "credit"
  | "balance"
  | "category"
  | "notes"
  | "ignore";

export interface MappedRow {
  rowIndex: number;
  date: string;
  description: string;
  amount: number;
  balance?: number;
  notes?: string;
  rawRow: RawRow;
  validationErrors: string[];
}

export interface CategorizedRow extends MappedRow {
  categoryId: string;
  categoryName: string;
  isAutoAssigned: boolean;
}

export type DuplicateStatus = "duplicate" | "skip" | "import";

export interface DuplicateFlag {
  rowIndex: number;
  isDuplicate: boolean;
  matchedTransactionId?: string;
  matchScore: number;
  userChoice: DuplicateStatus;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export interface ValidationError {
  type:
    | "file_type"
    | "file_size"
    | "empty_file"
    | "invalid_headers"
    | "invalid_date"
    | "invalid_amount"
    | "missing_required";
  message: string;
  rowIndex?: number;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  duplicatesSkipped: number;
  errors: number;
  transactions: Transaction[];
}

export interface ImportWizardState {
  step: ImportStep;
  file: File | null;
  parseResult: ParseResult | null;
  mappings: ColumnMapping[];
  validationResult: ValidationResult | null;
  mappedRows: MappedRow[];
  categorizedRows: CategorizedRow[];
  duplicateFlags: DuplicateFlag[];
  importResult: ImportResult | null;
  isProcessing: boolean;
  errorMessage: string | null;
}

export interface SavedColumnMapping {
  name: string;
  mappings: ColumnMapping[];
  savedAt: string;
}
