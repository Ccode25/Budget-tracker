import type { Transaction } from "@/types/transaction";

// Sample dataset for Demo mode exploration
export const DEMO_TRANSACTIONS: Transaction[] = [
  // ── July 2026 ─────────────────────────────────────────────────────────────
  { id: "tx-001", date: "2026-07-22", description: "Stripe Revenue",    amount: 3200.00, type: "income",   categoryId: "cat-freelance",     status: "completed", merchant: "Stripe",        tags: ["work"] },
  { id: "tx-002", date: "2026-07-22", description: "AWS Cloud",         amount:   89.50, type: "expense",  categoryId: "cat-utilities",     status: "completed", merchant: "Amazon Web Services" },
  { id: "tx-003", date: "2026-07-21", description: "Figma Pro",         amount:   15.00, type: "expense",  categoryId: "cat-subscriptions", status: "pending",   merchant: "Figma" },
  { id: "tx-004", date: "2026-07-21", description: "Whole Foods Market",amount:  112.30, type: "expense",  categoryId: "cat-food",          status: "completed", merchant: "Whole Foods" },
  { id: "tx-005", date: "2026-07-20", description: "Uber Ride",         amount:   22.00, type: "expense",  categoryId: "cat-transport",     status: "completed", merchant: "Uber" },
  { id: "tx-006", date: "2026-07-20", description: "Google Cloud",      amount:   45.00, type: "expense",  categoryId: "cat-utilities",     status: "completed", merchant: "Google" },
  { id: "tx-007", date: "2026-07-19", description: "Freelance Invoice", amount: 1500.00, type: "income",   categoryId: "cat-freelance",     status: "completed", tags: ["work", "client-a"] },
  { id: "tx-008", date: "2026-07-19", description: "Spotify Premium",   amount:    9.99, type: "expense",  categoryId: "cat-subscriptions", status: "completed", merchant: "Spotify" },
  { id: "tx-009", date: "2026-07-18", description: "Nike Shoes",        amount:  149.99, type: "expense",  categoryId: "cat-shopping",      status: "completed", merchant: "Nike" },
  { id: "tx-010", date: "2026-07-17", description: "Electric Bill",     amount:   95.20, type: "expense",  categoryId: "cat-utilities",     status: "completed", merchant: "City Electric" },
  { id: "tx-011", date: "2026-07-16", description: "Gym Membership",    amount:   49.99, type: "expense",  categoryId: "cat-health",        status: "completed", merchant: "Planet Fitness" },
  { id: "tx-012", date: "2026-07-15", description: "Salary — July",     amount: 5250.00, type: "income",   categoryId: "cat-salary",        status: "completed", merchant: "ACME Corp" },
  { id: "tx-013", date: "2026-07-15", description: "Rent — July",       amount: 1200.00, type: "expense",  categoryId: "cat-housing",       status: "completed", notes: "Monthly rent" },
  { id: "tx-014", date: "2026-07-14", description: "Starbucks",         amount:    6.75, type: "expense",  categoryId: "cat-food",          status: "completed", merchant: "Starbucks" },
  { id: "tx-015", date: "2026-07-14", description: "Netflix",           amount:   15.99, type: "expense",  categoryId: "cat-entertainment", status: "completed", merchant: "Netflix" },
  { id: "tx-016", date: "2026-07-13", description: "Doctor Visit",      amount:   80.00, type: "expense",  categoryId: "cat-health",        status: "completed" },
  { id: "tx-017", date: "2026-07-12", description: "Amazon Order",      amount:   67.45, type: "expense",  categoryId: "cat-shopping",      status: "completed", merchant: "Amazon" },
  { id: "tx-018", date: "2026-07-11", description: "Gas Station",       amount:   58.30, type: "expense",  categoryId: "cat-transport",     status: "completed", merchant: "Shell" },
  { id: "tx-019", date: "2026-07-10", description: "LinkedIn Premium",  amount:   39.99, type: "expense",  categoryId: "cat-subscriptions", status: "failed" },
  { id: "tx-020", date: "2026-07-09", description: "Chipotle",          amount:   14.25, type: "expense",  categoryId: "cat-food",          status: "completed", merchant: "Chipotle" },
  { id: "tx-021", date: "2026-07-08", description: "Insurance Premium", amount:  220.00, type: "expense",  categoryId: "cat-insurance",     status: "completed" },
  { id: "tx-022", date: "2026-07-07", description: "Freelance Client B",amount:  800.00, type: "income",   categoryId: "cat-freelance",     status: "completed", tags: ["work", "client-b"] },
  { id: "tx-023", date: "2026-07-06", description: "Costco",            amount:  234.89, type: "expense",  categoryId: "cat-food",          status: "completed", merchant: "Costco" },
  { id: "tx-024", date: "2026-07-05", description: "Parking Fine",      amount:   75.00, type: "expense",  categoryId: "cat-transport",     status: "completed" },
  { id: "tx-025", date: "2026-07-04", description: "Dividend — AAPL",   amount:   42.15, type: "income",   categoryId: "cat-investment",    status: "completed", tags: ["passive"] },
  { id: "tx-026", date: "2026-07-03", description: "H&M Clothing",      amount:   89.00, type: "expense",  categoryId: "cat-shopping",      status: "completed", merchant: "H&M" },
  { id: "tx-027", date: "2026-07-02", description: "Internet Bill",     amount:   79.99, type: "expense",  categoryId: "cat-utilities",     status: "completed" },
  { id: "tx-028", date: "2026-07-01", description: "Uber Eats",         amount:   32.50, type: "expense",  categoryId: "cat-food",          status: "completed", merchant: "Uber Eats" },
  // ── June 2026 ─────────────────────────────────────────────────────────────
  { id: "tx-029", date: "2026-06-30", description: "Salary — June",     amount: 5250.00, type: "income",   categoryId: "cat-salary",        status: "completed" },
  { id: "tx-030", date: "2026-06-29", description: "Rent — June",       amount: 1200.00, type: "expense",  categoryId: "cat-housing",       status: "completed" },
  { id: "tx-031", date: "2026-06-28", description: "DoorDash",          amount:   28.90, type: "expense",  categoryId: "cat-food",          status: "completed" },
  { id: "tx-032", date: "2026-06-25", description: "Apple Music",       amount:   10.99, type: "expense",  categoryId: "cat-subscriptions", status: "completed" },
  { id: "tx-033", date: "2026-06-24", description: "Target",            amount:  142.00, type: "expense",  categoryId: "cat-shopping",      status: "completed" },
  { id: "tx-034", date: "2026-06-22", description: "Freelance Invoice", amount: 2200.00, type: "income",   categoryId: "cat-freelance",     status: "completed" },
  { id: "tx-035", date: "2026-06-20", description: "Gas",               amount:   55.00, type: "expense",  categoryId: "cat-transport",     status: "completed" },
  { id: "tx-036", date: "2026-06-18", description: "Dental Checkup",    amount:  120.00, type: "expense",  categoryId: "cat-health",        status: "completed" },
  { id: "tx-037", date: "2026-06-15", description: "Electric Bill",     amount:   88.40, type: "expense",  categoryId: "cat-utilities",     status: "completed" },
  { id: "tx-038", date: "2026-06-12", description: "Coursera Course",   amount:   49.00, type: "expense",  categoryId: "cat-education",     status: "completed" },
  { id: "tx-039", date: "2026-06-10", description: "Restaurant — Date", amount:   95.00, type: "expense",  categoryId: "cat-food",          status: "completed" },
  { id: "tx-040", date: "2026-06-08", description: "Dividend — VTI",    amount:   63.80, type: "income",   categoryId: "cat-investment",    status: "completed" },
  { id: "tx-041", date: "2026-06-05", description: "Haircut",           amount:   35.00, type: "expense",  categoryId: "cat-personal",      status: "completed" },
  { id: "tx-042", date: "2026-06-03", description: "Amazon Prime",      amount:   14.99, type: "expense",  categoryId: "cat-subscriptions", status: "completed" },
  { id: "tx-043", date: "2026-06-01", description: "Water & Sewage",    amount:   42.00, type: "expense",  categoryId: "cat-utilities",     status: "completed" },
];

// Empty state default for newly registered real users
export const MOCK_TRANSACTIONS: Transaction[] = [];

export const getTransactionById = (id: string) =>
  DEMO_TRANSACTIONS.find((t) => t.id === id) || MOCK_TRANSACTIONS.find((t) => t.id === id);
