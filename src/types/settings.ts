export interface AppSettings {
  currency: string;         // e.g. "USD"
  currencySymbol: string;   // e.g. "$"
  language: string;         // e.g. "en-US"
  dateFormat: string;       // e.g. "MM/dd/yyyy"
  numberFormat: "comma" | "period"; // decimal separator
  importPreferences: ImportPreferences;
}

export interface ImportPreferences {
  defaultDateFormat: string;
  defaultEncoding: string;
  skipDuplicates: boolean;
  autoAssignCategories: boolean;
  savedMappings: Array<{
    name: string;
    mappings: Array<{ sourceHeader: string; targetField: string }>;
  }>;
}

export const DEFAULT_SETTINGS: AppSettings = {
  currency: "PHP",
  currencySymbol: "₱",
  language: "en-PH",
  dateFormat: "MM/dd/yyyy",
  numberFormat: "comma",
  importPreferences: {
    defaultDateFormat: "MM/dd/yyyy",
    defaultEncoding: "UTF-8",
    skipDuplicates: true,
    autoAssignCategories: true,
    savedMappings: [],
  },
};
