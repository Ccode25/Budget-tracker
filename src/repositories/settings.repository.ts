import type { SettingsSchema } from "@/database/schema";
import { DEFAULT_SETTINGS } from "@/types/settings";
import { dbClient } from "../database/client";

export class SettingsRepository {
  private static instance: SettingsRepository;
  private settingsStore: Record<string, SettingsSchema> = {};

  public static getInstance(): SettingsRepository {
    if (!SettingsRepository.instance) {
      SettingsRepository.instance = new SettingsRepository();
    }
    return SettingsRepository.instance;
  }

  async getByUserId(userId: string): Promise<SettingsSchema> {
    const t0 = Date.now();
    try {
      const rows = await dbClient.query<any>(
        "SELECT * FROM settings WHERE user_id = $1 AND deleted_at IS NULL LIMIT 1",
        [userId]
      );
      if (rows.length > 0) {
        const ms = Date.now() - t0;
        console.log(`[profile] settings getByUserId: ${ms}ms`);
        const r = rows[0];
        return {
          id: r.id,
          uuid: r.uuid || r.id,
          userId: r.user_id,
          currency: r.currency || DEFAULT_SETTINGS.currency,
          currencySymbol: r.currency_symbol || r.currencySymbol || DEFAULT_SETTINGS.currencySymbol,
          language: r.language || DEFAULT_SETTINGS.language,
          dateFormat: r.date_format || r.dateFormat || DEFAULT_SETTINGS.dateFormat,
          numberFormat: r.number_format || r.numberFormat || DEFAULT_SETTINGS.numberFormat,
          importPreferences: typeof r.import_preferences === "string" ? r.import_preferences : JSON.stringify(DEFAULT_SETTINGS.importPreferences),
          createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
          updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
          deletedAt: r.deleted_at ? new Date(r.deleted_at).toISOString() : null,
        };
      }

      const ms = Date.now() - t0;
      console.log(`[profile] settings insert missing: ${ms}ms`);
      // Auto-create default settings in Neon DB for new user
      const id = `set-${Date.now()}`;
      const uuid = `set-uuid-${Date.now()}`;
      await dbClient.query(
        `INSERT INTO settings (id, uuid, user_id, currency, currency_symbol, language, date_format, number_format, import_preferences, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
        [
          id,
          uuid,
          userId,
          DEFAULT_SETTINGS.currency,
          DEFAULT_SETTINGS.currencySymbol,
          DEFAULT_SETTINGS.language,
          DEFAULT_SETTINGS.dateFormat,
          DEFAULT_SETTINGS.numberFormat,
          JSON.stringify(DEFAULT_SETTINGS.importPreferences),
        ]
      );
    } catch (err) {
      console.error("SettingsRepository Neon query error:", err);
    }

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

    await dbClient.query(
      `UPDATE settings SET currency = $2, currency_symbol = $3, language = $4, date_format = $5, number_format = $6, updated_at = NOW()
       WHERE user_id = $1`,
      [
        userId,
        updated.currency,
        updated.currencySymbol,
        updated.language,
        updated.dateFormat,
        updated.numberFormat,
      ]
    );

    this.settingsStore[userId] = updated;
    return updated;
  }
}

export const settingsRepository = SettingsRepository.getInstance();
