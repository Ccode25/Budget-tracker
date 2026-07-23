/**
 * Settings Repository
 * Encapsulates database operations for user application preferences.
 */

import type { SettingsSchema } from "@/database/schema";
import { DEFAULT_SETTINGS } from "@/types/settings";

export class SettingsRepository {
  private static instance: SettingsRepository;
  private settingsStore: Record<string, SettingsSchema> = {
    "usr-001": {
      id: "set-001",
      uuid: "set-uuid-001",
      userId: "usr-001",
      currency: DEFAULT_SETTINGS.currency,
      currencySymbol: DEFAULT_SETTINGS.currencySymbol,
      language: DEFAULT_SETTINGS.language,
      dateFormat: DEFAULT_SETTINGS.dateFormat,
      numberFormat: DEFAULT_SETTINGS.numberFormat,
      importPreferences: JSON.stringify(DEFAULT_SETTINGS.importPreferences),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    },
  };

  public static getInstance(): SettingsRepository {
    if (!SettingsRepository.instance) {
      SettingsRepository.instance = new SettingsRepository();
    }
    return SettingsRepository.instance;
  }

  async getByUserId(userId: string): Promise<SettingsSchema> {
    if (!this.settingsStore[userId]) {
      const timestamp = new Date().toISOString();
      this.settingsStore[userId] = {
        id: `set-${Date.now()}`,
        uuid: `set-uuid-${Date.now()}`,
        userId,
        currency: DEFAULT_SETTINGS.currency,
        currencySymbol: DEFAULT_SETTINGS.currencySymbol,
        language: DEFAULT_SETTINGS.language,
        dateFormat: DEFAULT_SETTINGS.dateFormat,
        numberFormat: DEFAULT_SETTINGS.numberFormat,
        importPreferences: JSON.stringify(DEFAULT_SETTINGS.importPreferences),
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: null,
      };
    }
    return this.settingsStore[userId];
  }

  async updateByUserId(userId: string, updates: Partial<SettingsSchema>): Promise<SettingsSchema> {
    const current = await this.getByUserId(userId);
    const updated: SettingsSchema = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.settingsStore[userId] = updated;
    return updated;
  }
}

export const settingsRepository = SettingsRepository.getInstance();
