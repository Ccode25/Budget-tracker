/**
 * Security & Authentication Test Suite
 */

import { describe, it, expect, beforeEach } from "vitest";
import { sanitizeString, TransactionSchemaValidator } from "../validations";
import { checkRateLimit } from "../middleware/rate-limiter";
import { transactionRepository } from "../repositories/transaction.repository";

describe("1. Security: Input Sanitization & XSS Prevention", () => {
  it("escapes malicious script tags from string inputs", () => {
    const rawInput = "<script>alert('xss')</script>";
    const sanitized = sanitizeString(rawInput);
    expect(sanitized).not.toContain("<script>");
    expect(sanitized).toBe("&lt;script&gt;alert(&#x27;xss&#x27;)&lt;&#x2F;script&gt;");
  });

  it("validates transaction payload and sanitizes fields", () => {
    const payload = {
      categoryId: "cat-1",
      date: "2026-07-23",
      description: "Coffee <img src=x onerror=alert(1)>",
      amount: 15.5,
      type: "expense" as const,
      status: "completed" as const,
    };

    const parsed = TransactionSchemaValidator.parse(payload);
    expect(parsed.description).not.toContain("<img");
    expect(parsed.description).toContain("&lt;img");
  });
});

describe("2. Security: Rate Limiting Guard", () => {
  it("allows requests under rate limit threshold", () => {
    const testIp = "192.168.1.100";
    const res = checkRateLimit(testIp, 5, 10000);
    expect(res.allowed).toBe(true);
    expect(res.remaining).toBe(4);
  });

  it("blocks requests exceeding rate limit threshold", () => {
    const testIp = "192.168.1.101";
    for (let i = 0; i < 5; i++) {
      checkRateLimit(testIp, 5, 10000);
    }
    const blockedRes = checkRateLimit(testIp, 5, 10000);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
  });
});

describe("3. Data Ownership: Cross-User Access Safeguard", () => {
  const user1 = "usr-111";
  const user2 = "usr-222";

  it("prevents user2 from reading user1 transactions", async () => {
    const tx = await transactionRepository.create(
      {
        date: "2026-07-23",
        description: "User 1 Secret Purchase",
        amount: 100,
        type: "expense",
        categoryId: "cat-secret",
        status: "completed",
        isImported: false,
      },
      user1
    );

    // User 1 should access the transaction
    const user1Read = await transactionRepository.findById(tx.id, user1);
    expect(user1Read).not.toBeNull();
    expect(user1Read?.description).toBe("User 1 Secret Purchase");

    // User 2 must NOT be allowed to read user 1 transaction
    const user2Read = await transactionRepository.findById(tx.id, user2);
    expect(user2Read).toBeNull();
  });

  it("prevents user2 from deleting user1 transactions", async () => {
    const tx = await transactionRepository.create(
      {
        date: "2026-07-23",
        description: "User 1 Delete Target",
        amount: 50,
        type: "expense",
        categoryId: "cat-secret",
        status: "completed",
        isImported: false,
      },
      user1
    );

    // User 2 attempt to delete user 1 transaction should fail
    const deletedByUser2 = await transactionRepository.delete(tx.id, user2);
    expect(deletedByUser2).toBe(false);

    // Transaction should still exist for user 1
    const user1Read = await transactionRepository.findById(tx.id, user1);
    expect(user1Read).not.toBeNull();
  });
});

describe("4. Google OAuth Registration & Email Verification", () => {
  it("rejects non-verified Google email sign ins", async () => {
    const { authOptions } = await import("../auth");
    const result = await authOptions.callbacks!.signIn!({
      user: { id: "usr-unverified", email: "unverified@example.com", name: "Unverified User" } as any,
      account: { provider: "google", providerAccountId: "google-123", type: "oauth" },
      profile: { email_verified: false } as any,
    });

    expect(result).toBe(false);
  });

  it("registers and creates user account for real verified Google account ajdaelo25@gmail.com", async () => {
    const { authOptions } = await import("../auth");
    const { userRepository } = await import("../repositories/user.repository");

    const result = await authOptions.callbacks!.signIn!({
      user: { id: "usr-ajdaelo25", email: "ajdaelo25@gmail.com", name: "AJ Daelo" } as any,
      account: { provider: "google", providerAccountId: "google-ajdaelo25", type: "oauth" },
      profile: { email_verified: true } as any,
    });

    expect(result).toBe(true);

    const user = await userRepository.findByEmail("ajdaelo25@gmail.com");
    expect(user).not.toBeNull();
    expect(user?.email).toBe("ajdaelo25@gmail.com");
    expect(user?.emailVerified).toBe(true);
    expect(user?.googleId).toBe("google-ajdaelo25");
  });
});
