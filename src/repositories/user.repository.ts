/**
 * User Repository
 * Encapsulates database operations for user profile and authentication state.
 */

import type { UserSchema } from "@/database/schema";

export class UserRepository {
  private static instance: UserRepository;
  private users: UserSchema[] = [
    {
      id: "usr-001",
      uuid: "usr-uuid-001",
      email: "user@example.com",
      name: "Alex Johnson",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: "user",
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    },
  ];

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async findById(id: string): Promise<UserSchema | null> {
    return this.users.find((u) => u.id === id && !u.deletedAt) ?? null;
  }

  async findByUuid(uuid: string): Promise<UserSchema | null> {
    return this.users.find((u) => u.uuid === uuid && !u.deletedAt) ?? null;
  }

  async findByEmail(email: string): Promise<UserSchema | null> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && !u.deletedAt) ?? null;
  }

  async create(data: Omit<UserSchema, "id" | "uuid" | "createdAt" | "updatedAt">): Promise<UserSchema> {
    const timestamp = new Date().toISOString();
    const newUser: UserSchema = {
      ...data,
      id: `usr-${Date.now()}`,
      uuid: `usr-uuid-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, updates: Partial<UserSchema>): Promise<UserSchema | null> {
    const index = this.users.findIndex((u) => u.id === id && !u.deletedAt);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.users[index];
  }

  async softDelete(id: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;
    user.deletedAt = new Date().toISOString();
    return true;
  }
}

export const userRepository = UserRepository.getInstance();
