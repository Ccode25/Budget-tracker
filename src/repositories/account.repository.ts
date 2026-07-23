/**
 * Account Repository
 * Encapsulates database operations for bank/financial account management.
 */

import type { AccountSchema } from "@/database/schema";

export class AccountRepository {
  private static instance: AccountRepository;
  private accounts: AccountSchema[] = [
    {
      id: "acc-001",
      uuid: "acc-uuid-001",
      userId: "usr-001",
      name: "Main Checking Account",
      type: "checking",
      balance: 14850.0,
      currency: "PHP",
      accountNumberMasked: "•••• 4321",
      color: "#6366f1",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    },
    {
      id: "acc-002",
      uuid: "acc-uuid-002",
      userId: "usr-001",
      name: "High-Yield Savings",
      type: "savings",
      balance: 32500.0,
      currency: "PHP",
      accountNumberMasked: "•••• 8765",
      color: "#10b981",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    },
  ];

  public static getInstance(): AccountRepository {
    if (!AccountRepository.instance) {
      AccountRepository.instance = new AccountRepository();
    }
    return AccountRepository.instance;
  }

  async findAll(includeDeleted = false): Promise<AccountSchema[]> {
    if (includeDeleted) return [...this.accounts];
    return this.accounts.filter((a) => !a.deletedAt);
  }

  async findById(id: string): Promise<AccountSchema | null> {
    return this.accounts.find((a) => a.id === id && !a.deletedAt) ?? null;
  }

  async findByUuid(uuid: string): Promise<AccountSchema | null> {
    return this.accounts.find((a) => a.uuid === uuid && !a.deletedAt) ?? null;
  }

  async create(data: Omit<AccountSchema, "id" | "uuid" | "createdAt" | "updatedAt">): Promise<AccountSchema> {
    const timestamp = new Date().toISOString();
    const newAcc: AccountSchema = {
      ...data,
      id: `acc-${Date.now()}`,
      uuid: `acc-uuid-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
    };
    this.accounts.unshift(newAcc);
    return newAcc;
  }

  async update(id: string, updates: Partial<AccountSchema>): Promise<AccountSchema | null> {
    const index = this.accounts.findIndex((a) => a.id === id && !a.deletedAt);
    if (index === -1) return null;

    this.accounts[index] = {
      ...this.accounts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.accounts[index];
  }

  async softDelete(id: string): Promise<boolean> {
    const account = await this.findById(id);
    if (!account) return false;
    account.deletedAt = new Date().toISOString();
    return true;
  }
}

export const accountRepository = AccountRepository.getInstance();
