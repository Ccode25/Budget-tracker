/**
 * Salary Calculation Module
 * Handles gross to net salary calculations, tax bracket deductions,
 * input validation, floating-point precision rounding, and currency formatting.
 */

export interface TaxBracket {
  threshold: number;
  rate: number;
}

export interface SalaryBreakdown {
  grossSalary: number;
  deductions: number;
  netSalary: number;
  formattedGross: string;
  formattedDeductions: string;
  formattedNet: string;
  effectiveTaxRate: number;
}

// Default progressive tax brackets
export const DEFAULT_TAX_BRACKETS: TaxBracket[] = [
  { threshold: 0, rate: 0.10 },       // 10% up to $20,000
  { threshold: 20000, rate: 0.20 },   // 20% from $20,001 to $50,000
  { threshold: 50000, rate: 0.30 },   // 30% above $50,000
];

/**
 * Safely rounds a number to 2 decimal places to prevent floating point inaccuracies.
 */
export function roundToTwoDecimals(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Formats a numeric amount as currency string.
 */
export function formatCurrency(amount: number, currency = "PHP", locale = "en-PH"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Validates and calculates net salary, progressive tax deductions, and formatting.
 * Handles boundary conditions and invalid input types gracefully.
 */
export function calculateSalary(
  grossInput: any,
  brackets: TaxBracket[] = DEFAULT_TAX_BRACKETS,
  currency = "PHP"
): SalaryBreakdown {
  // 1. Input Validation
  if (
    grossInput === null ||
    grossInput === undefined ||
    typeof grossInput === "boolean" ||
    (typeof grossInput === "string" && grossInput.trim() === "")
  ) {
    throw new Error("Invalid salary input: Input must be a valid non-empty number.");
  }

  const gross = Number(grossInput);

  if (isNaN(gross)) {
    throw new Error("Invalid salary input: NaN or non-numeric input provided.");
  }

  if (gross < 0) {
    throw new Error("Invalid salary input: Salary cannot be negative.");
  }

  if (!isFinite(gross)) {
    throw new Error("Invalid salary input: Salary value is out of bounds.");
  }

  // 2. Precise progressive tax deduction calculation
  const roundedGross = roundToTwoDecimals(gross);
  let totalDeductions = 0;

  // Sort brackets ascending by threshold
  const sortedBrackets = [...brackets].sort((a, b) => a.threshold - b.threshold);

  for (let i = 0; i < sortedBrackets.length; i++) {
    const current = sortedBrackets[i];
    const nextThreshold = sortedBrackets[i + 1] ? sortedBrackets[i + 1].threshold : roundedGross;

    if (roundedGross > current.threshold) {
      const taxableInBracket = Math.min(roundedGross, nextThreshold) - current.threshold;
      totalDeductions += taxableInBracket * current.rate;
    }
  }

  const roundedDeductions = roundToTwoDecimals(totalDeductions);
  const roundedNet = roundToTwoDecimals(roundedGross - roundedDeductions);
  const effectiveTaxRate = roundedGross > 0 ? roundToTwoDecimals((roundedDeductions / roundedGross) * 100) : 0;

  // 3. Return Breakdown
  return {
    grossSalary: roundedGross,
    deductions: roundedDeductions,
    netSalary: roundedNet,
    formattedGross: formatCurrency(roundedGross, currency),
    formattedDeductions: formatCurrency(roundedDeductions, currency),
    formattedNet: formatCurrency(roundedNet, currency),
    effectiveTaxRate,
  };
}
