import type { Transaction, TransactionFilters, TransactionSort } from "../types/transaction";
import { dbClient } from "../database/client";

export class TransactionRepository {
  private static instance: TransactionRepository;
  private transactions: Transaction[] = [];

  public static getInstance(): TransactionRepository {
    if (!TransactionRepository.instance) {
      TransactionRepository.instance = new TransactionRepository();
    }
    return TransactionRepository.instance;
  }

  /**
   * Retrieves transactions strictly scoped by authenticated user_id from Neon PostgreSQL
   */
  async findAll(
    userId: string,
    filters?: Partial<TransactionFilters>,
    sort?: TransactionSort,
    page = 1,
    pageSize = 20
  ): Promise<{ data: Transaction[]; total: number }> {
    try {
      let queryStr = "SELECT * FROM transactions WHERE user_id = $1 AND deleted_at IS NULL";
      const params: any[] = [userId];

      if (filters?.search) {
        params.push(`%${filters.search}%`);
        queryStr += ` AND (LOWER(description) LIKE LOWER($${params.length}) OR LOWER(merchant) LIKE LOWER($${params.length}))`;
      }

      if (filters?.types && filters.types.length > 0) {
        params.push(filters.types);
        queryStr += ` AND type = ANY($${params.length})`;
      }

      const countRes = await dbClient.query<{ count: string }>(`SELECT COUNT(*) as count FROM (${queryStr}) as filtered`, params);
      const total = parseInt(countRes[0]?.count || "0", 10);

      const offset = (page - 1) * pageSize;
      params.push(pageSize, offset);
      queryStr += ` ORDER BY date DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

      const rows = await dbClient.query<any>(queryStr, params);
      const data: Transaction[] = rows.map((r) => ({
        id: r.id,
        date: r.date,
        description: r.description,
        amount: parseFloat(r.amount),
        type: r.type,
        categoryId: r.category_id,
        accountId: r.account_id,
        status: r.status,
        merchant: r.merchant,
        notes: r.notes,
        isImported: r.is_imported,
      }));

      return { data, total };
    } catch (err) {
      console.error("TransactionRepository Neon query error:", err);
      return { data: [], total: 0 };
    }
  }

  /**
   * Fast, unpaginated single-query retrieval of all non-deleted transactions for a user
   */
  async findAllUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const rows = await dbClient.query<any>(
        "SELECT * FROM transactions WHERE user_id = $1 AND deleted_at IS NULL ORDER BY date DESC",
        [userId]
      );
      return rows.map((r) => ({
        id: r.id,
        date: r.date,
        description: r.description,
        amount: parseFloat(r.amount),
        type: r.type,
        categoryId: r.category_id,
        accountId: r.account_id,
        status: r.status,
        merchant: r.merchant,
        notes: r.notes,
        isImported: r.is_imported,
      }));
    } catch (err) {
      console.error("TransactionRepository findAllUserTransactions error:", err);
      return [];
    }
  }

  async findById(id: string, userId: string): Promise<Transaction | null> {
    try {
      const rows = await dbClient.query<any>(
        "SELECT * FROM transactions WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL",
        [id, userId]
      );
      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        date: r.date,
        description: r.description,
        amount: parseFloat(r.amount),
        type: r.type,
        categoryId: r.category_id,
        accountId: r.account_id,
        status: r.status,
        merchant: r.merchant,
        notes: r.notes,
        isImported: r.is_imported,
      };
    } catch {
      return null;
    }
  }

  async create(data: Omit<Transaction, "id">, userId: string): Promise<Transaction> {
    const newTxId = `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newTx: Transaction = {
      ...data,
      id: newTxId,
    };

    await dbClient.query(
      `INSERT INTO transactions (id, uuid, user_id, category_id, account_id, date, description, amount, type, status, notes, merchant, is_imported)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        newTxId,
        `uuid-${newTxId}`,
        userId,
        data.categoryId,
        data.accountId || null,
        data.date,
        data.description,
        data.amount,
        data.type,
        data.status,
        data.notes || null,
        data.merchant || null,
        data.isImported || false,
      ]
    );

    return newTx;
  }

  async update(id: string, updates: Partial<Transaction>, userId: string): Promise<Transaction | null> {
    const existing = await this.findById(id, userId);
    if (!existing) return null;

    const updated: Transaction = {
      ...existing,
      ...updates,
    };

    await dbClient.query(
      `UPDATE transactions 
       SET date = $3,
           description = $4,
           amount = $5,
           type = $6,
           category_id = $7,
           status = $8,
           notes = $9,
           merchant = $10,
           updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [
        id,
        userId,
        updated.date,
        updated.description,
        updated.amount,
        updated.type,
        updated.categoryId,
        updated.status,
        updated.notes || null,
        updated.merchant || null,
      ]
    );

    return updated;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const res = await dbClient.query(
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, userId]
    );
    return res.length > 0;
  }
}

export const transactionRepository = TransactionRepository.getInstance();
