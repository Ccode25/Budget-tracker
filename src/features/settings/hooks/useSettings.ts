"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AppSettings, DEFAULT_SETTINGS } from "@/types/settings";

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    "budget_tracker_settings",
    DEFAULT_SETTINGS
  );

  const updateCurrency = (currency: string, currencySymbol: string) => {
    setSettings((prev) => ({ ...prev, currency, currencySymbol }));
  };

  const updateLanguage = (language: string) => {
    setSettings((prev) => ({ ...prev, language }));
  };

  const updateImportPreferences = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      importPreferences: {
        ...prev.importPreferences,
        [key]: value,
      },
    }));
  };

  return {
    settings,
    updateCurrency,
    updateLanguage,
    updateImportPreferences,
  };
}
