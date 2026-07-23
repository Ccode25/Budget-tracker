import { ValidationResult, ValidationError, ParseResult } from "@/types/import";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: File): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  const fileName = file.name.toLowerCase();
  const isValidExt = fileName.endsWith(".csv") || fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

  if (!isValidExt) {
    errors.push({
      type: "file_type",
      message: "Unsupported file type. Please upload a .csv or .xlsx file.",
    });
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push({
      type: "file_size",
      message: `File size exceeds the 10MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB).`,
    });
  }

  if (file.size === 0) {
    errors.push({
      type: "empty_file",
      message: "The uploaded file is completely empty.",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateParseResult(result: ParseResult): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  if (result.headers.length === 0) {
    errors.push({
      type: "invalid_headers",
      message: "No header row detected in the uploaded file.",
    });
  }

  if (result.rows.length === 0) {
    errors.push({
      type: "empty_file",
      message: "File contains headers but has 0 data rows.",
    });
  }

  // Duplicate headers check
  const seenHeaders = new Set<string>();
  for (const h of result.headers) {
    const lower = h.toLowerCase();
    if (seenHeaders.has(lower)) {
      warnings.push(`Duplicate column header detected: "${h}".`);
    }
    seenHeaders.add(lower);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
