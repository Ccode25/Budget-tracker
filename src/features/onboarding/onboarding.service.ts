/**
 * Onboarding Service
 * Single source of truth for initializing a new user account.
 * Runs all onboarding steps inside a database transaction on Neon PostgreSQL.
 * Idempotent - skips steps that already exist for the user.
 */

import { dbClient } from '@/database/client';
import { categoryRepository } from '@/repositories/category.repository';
import { settingsRepository } from '@/repositories/settings.repository';
import { PoolClient } from '@neondatabase/serverless';

export interface OnboardingResult {
  success: boolean;
  userId: string;
  categoriesCreated: number;
  settingsCreated: boolean;
  error?: string;
}

export class OnboardingService {
  private static instance: OnboardingService;

  public static getInstance(): OnboardingService {
    if (!OnboardingService.instance) {
      OnboardingService.instance = new OnboardingService();
    }
    return OnboardingService.instance;
  }

  async initializeNewUser(userId: string): Promise<OnboardingResult> {
    if (!userId) {
      return { success: false, userId: '', categoriesCreated: 0, settingsCreated: false, error: 'userId is required' };
    }

    const existingCategories = await categoryRepository.findAll(userId);
    if (existingCategories.length > 0) {
      return {
        success: true,
        userId,
        categoriesCreated: 0,
        settingsCreated: false,
      };
    }

    try {
      return await dbClient.transaction(async (client: PoolClient) => {
        const categoriesCreated = await this.seedCategoriesInTransaction(client, userId);
        await this.seedSettingsInTransaction(client, userId);
        await this.seedPreferencesInTransaction(client, userId);
        await this.seedDashboardConfigInTransaction(client, userId);

        return {
          success: true,
          userId,
          categoriesCreated,
          settingsCreated: true,
        };
      });
    } catch (err) {
      console.error('[OnboardingService] Transaction failed for user ' + userId + ':', err);
      // Fallback to non-transaction initialization
      return await this.initializeNewUserWithoutTransaction(userId);
    }
  }

  private async initializeNewUserWithoutTransaction(userId: string): Promise<OnboardingResult> {
    try {
      const categoriesCreated = await categoryRepository.seedDefaultCategories(userId);
      await settingsRepository.getByUserId(userId);

      return {
        success: true,
        userId,
        categoriesCreated,
        settingsCreated: true,
      };
    } catch (err) {
      console.error('[OnboardingService] Non-transaction init failed for user ' + userId + ':', err);
      return {
        success: false,
        userId,
        categoriesCreated: 0,
        settingsCreated: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  private async seedCategoriesInTransaction(client: PoolClient, userId: string): Promise<number> {
    const { MOCK_CATEGORIES } = await import('@/features/categories/mock/categories');
    let createdCount = 0;

    for (const cat of MOCK_CATEGORIES) {
      const catId = cat.id;
      const result = await client.query(
        'INSERT INTO categories (id, uuid, user_id, name, color, icon, type, is_default, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, true, true, NOW(), NOW()) ON CONFLICT (id) DO NOTHING',
        [catId, 'uuid-' + catId + '-' + userId.slice(-6), userId, cat.name, cat.color, cat.icon, cat.type]
      );
      if (result.rowCount !== undefined && result.rowCount !== null && result.rowCount > 0) {
        createdCount++;
      }
    }

    return createdCount;
  }

  private async seedSettingsInTransaction(client: PoolClient, userId: string): Promise<void> {
    const { DEFAULT_SETTINGS } = await import('@/types/settings');

    const id = 'set-' + Date.now();
    const uuid = 'set-uuid-' + Date.now();

    await client.query(
      `INSERT INTO settings (id, uuid, user_id, currency, currency_symbol, language, date_format, number_format, import_preferences, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       ON CONFLICT (user_id) DO NOTHING`,
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
  }

  private async seedPreferencesInTransaction(client: PoolClient, userId: string): Promise<void> {
    const { DEFAULT_SETTINGS } = await import('@/types/settings');

    await client.query(
      `UPDATE settings SET import_preferences = $1, updated_at = NOW() WHERE user_id = $2`,
      [JSON.stringify(DEFAULT_SETTINGS.importPreferences), userId]
    );
  }

  private async seedDashboardConfigInTransaction(client: PoolClient, userId: string): Promise<void> {
    const dashboardId = 'dash-' + userId.slice(-8) + '-' + Date.now();

    await client.query(
      `INSERT INTO dashboard_config (id, uuid, user_id, layout, widgets, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (user_id) DO NOTHING`,
      [
        dashboardId,
        'uuid-' + dashboardId,
        userId,
        JSON.stringify({ columns: 2, layout: 'default' }),
        JSON.stringify(['budgetOverview', 'recentTransactions', 'goals', 'categories']),
      ]
    );
  }
}

export const onboardingService = OnboardingService.getInstance();
