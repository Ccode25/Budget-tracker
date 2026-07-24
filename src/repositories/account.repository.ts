/**
 * Account Repository
 * Encapsulates database operations for bank/financial account management on Neon PostgreSQL.
 */

import type { AccountSchema } from "@/database/schema";
import { dbClient } from "../database/client";

export class AccountRepository {
  private static instance: AccountRepository;

  public static getInstance(): AccountRepository {
    if (!AccountRepository.instance) {
      AccountRepository.instance = new AccountRepository();
    }
    return AccountRepository.instance;
  }

  private mapRow(r: any): AccountSchema {
    return {
      id: r.id,
      uuid: r.uuid || r.id,
      userId: r.user_id || r.userId,
      name: r.name,
      type: r.type,
      balance: parseFloat(r.balance || 0),
      currency: r.currency || "PHP",
      accountNumberMasked: r.account_number_masked || r.accountNumberMasked || null,
      color: r.color || "#7c3aed",
      isActive: r.is_active ?? true,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      deletedAt: r.deleted_at ? new Date(r.deleted_at).toISOString() : null,
    };
  }

  async findAll(userId?: string, includeDeleted = false): Promise<AccountSchema[]> {
    try {
      let queryStr = "SELECT * FROM accounts WHERE 1=1";
      const params: any[] = [];

      if (userId) {
        params.push(userId);
        queryStr += ` AND user_id = $${params.length}`;
      }
      if (!includeDeleted) {
        queryStr += " AND deleted_at IS NULL";
      }

      queryStr += " ORDER BY created_at DESC";

      const rows = await dbClient.query<any>(queryStr, params);
      return rows.map((r) => this.mapRow(r));
    } catch (err) {
      console.error("AccountRepository Neon findAll error:", err);
      return [];
    }
  }

  async findById(id: string, userId?: string): Promise<AccountSchema | null> {
    try {
      let queryStr = "SELECT * FROM accounts WHERE id = $1 AND deleted_at IS NULL";
      const params: any[] = [id];

      if (userId) {
        params.push(userId);
        queryStr += " AND user_id = $2";
      }

      const rows = await dbClient.query<any>(queryStr, params);
      return rows.length > 0 ? this.mapRow(rows[0]) : null;
    } catch (err) {
      console.error("AccountRepository Neon findById error:", err);
      return null;
    }
  }

  async findByUuid(uuid: string): Promise<AccountSchema | null> {
    try {
      const rows = await dbClient.query<any>("SELECT * FROM accounts WHERE (uuid = $1 OR id = $1) AND deleted_at IS NULL LIMIT 1", [uuid]);
      return rows.length > 0 ? this.mapRow(rows[0]) : null;
    } catch (err) {
      console.error("AccountRepository Neon findByUuid error:", err);
      return null;
    }
  }

  async create(data: Omit<AccountSchema, "id" | "uuid" | "createdAt" | "updatedAt">): Promise<AccountSchema> {
    const id = `acc-${Date.now()}`;
    const uuid = `acc-uuid-${Date.now()}`;

    const sql = `
      INSERT INTO accounts (id, uuid, user_id, name, type, balance, currency, account_number_masked, color, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `;

    const params = [
      id,
      uuid,
      data.userId,
      data.name,
      data.type,
      data.balance || 0,
      data.currency || "PHP",
      data.accountNumberMasked || null,
      data.color || "#7c3aed",
      data.isActive ?? true,
    ];

    const rows = await dbClient.query<any>(sql, params);
    return this.mapRow(rows[0]);
  }

  async update(id: string, updates: Partial<AccountSchema>, userId?: string): Promise<AccountSchema | null> {
    try {
      const setClauses: string[] = [];
      const params: any[] = [id];
      let idx = 2;

      if (updates.name !== undefined) { setClauses.push(`name = $${idx++}`); params.push(updates.name); }
      if (updates.type !== undefined) { setClauses.push(`type = $${idx++}`); params.push(updates.type); }
      if (updates.balance !== undefined) { setClauses.push(`balance = $${idx++}`); params.push(updates.balance); }
      if (updates.currency !== undefined) { setClauses.push(`currency = $${idx++}`); params.push(updates.currency); }
      if (updates.accountNumberMasked !== undefined) { setClauses.push(`account_number_masked = $${idx++}`); params.push(updates.accountNumberMasked); }
      if (updates.color !== undefined) { setClauses.push(`color = $${idx++}`); params.push(updates.color); }
      if (updates.isActive !== undefined) { setClauses.push(`is_active = $${idx++}`); params.push(updates.isActive); }

      setClauses.push(`updated_at = NOW()`);

      let queryStr = `UPDATE accounts SET ${setClauses.join(", ")} WHERE id = $1`;
      if (userId) {
        queryStr += ` AND user_id = $${idx++}`;
        params.push(userId);
      }
      queryStr += " RETURNING *";

      const rows = await dbClient.query<any>(queryStr, params);
      return rows.length > 0 ? this.mapRow(rows[0]) : null;
    } catch (err) {
      console.error("AccountRepository Neon update error:", err);
      return null;
    }
  }

  async softDelete(id: string, userId?: string): Promise<boolean> {
    try {
      let queryStr = "UPDATE accounts SET deleted_at = NOW() WHERE id = $1";
      const params: any[] = [id];
      if (userId) {
        queryStr += " AND user_id = $2";
        params.push(userId);
      }
      queryStr += " RETURNING id";

      const rows = await dbClient.query<any>(queryStr, params);
      return rows.length > 0;
    } catch (err) {
      console.error("AccountRepository Neon softDelete error:", err);
      return false;
    }
  }
}

export const accountRepository = AccountRepository.getInstance();
