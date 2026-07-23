import { Pool } from "@neondatabase/serverless";

const TARGET_EMAIL = "ajdaelo@gmail.com";

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ Error: DATABASE_URL environment variable is missing.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl });
  console.log(`🔍 Searching for user with email: ${TARGET_EMAIL}...`);

  try {
    // 1. Locate user in Neon DB
    const userRes = await pool.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND deleted_at IS NULL", [TARGET_EMAIL]);
    
    let userId: string;
    if (userRes.rows.length === 0) {
      console.log(`ℹ️ User ${TARGET_EMAIL} not found in database. Searching for any existing user or creating account record...`);
      // Fallback search for any verified account or prompt
      const anyUserRes = await pool.query("SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at ASC LIMIT 1");
      if (anyUserRes.rows.length === 0) {
        // Auto-provision user record for target email
        userId = `usr-${Date.now()}`;
        await pool.query(
          `INSERT INTO users (id, uuid, email, name, role, email_verified, created_at, updated_at)
           VALUES ($1, $2, $3, $4, 'user', true, NOW(), NOW())`,
          [userId, `uuid-${userId}`, TARGET_EMAIL, "AJ Daelo"]
        );
        console.log(`✅ Provisioned database user record for ${TARGET_EMAIL} (ID: ${userId})`);
      } else {
        userId = anyUserRes.rows[0].id;
        console.log(`✅ Using existing active user ID: ${userId} (${anyUserRes.rows[0].email})`);
      }
    } else {
      userId = userRes.rows[0].id;
      console.log(`✅ Found user ${TARGET_EMAIL} with Database ID: ${userId}`);
    }

    // 2. Categories Seeding
    const categoriesData = [
      { id: "cat-salary", name: "Salary", type: "income", color: "#10b981", icon: "Briefcase" },
      { id: "cat-freelance", name: "Freelance", type: "income", color: "#0ea5e9", icon: "Laptop" },
      { id: "cat-food", name: "Food & Dining", type: "expense", color: "#f59e0b", icon: "Utensils" },
      { id: "cat-transport", name: "Transportation", type: "expense", color: "#6366f1", icon: "Car" },
      { id: "cat-shopping", name: "Shopping", type: "expense", color: "#ec4899", icon: "ShoppingBag" },
      { id: "cat-bills", name: "Bills & Utilities", type: "expense", color: "#ef4444", icon: "Receipt" },
      { id: "cat-entertainment", name: "Entertainment", type: "expense", color: "#8b5cf6", icon: "Film" },
      { id: "cat-healthcare", name: "Healthcare", type: "expense", color: "#14b8a6", icon: "Stethoscope" },
      { id: "cat-fitness", name: "Fitness", type: "expense", color: "#84cc16", icon: "Dumbbell" },
      { id: "cat-education", name: "Education", type: "expense", color: "#3b82f6", icon: "GraduationCap" },
      { id: "cat-savings", name: "Savings", type: "transfer", color: "#059669", icon: "PiggyBank" },
      { id: "cat-misc", name: "Miscellaneous", type: "expense", color: "#6b7280", icon: "MoreHorizontal" },
    ];

    let insertedCats = 0;
    for (const cat of categoriesData) {
      const res = await pool.query(
        `INSERT INTO categories (id, uuid, name, type, color, icon, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color
         RETURNING id`,
        [cat.id, `uuid-${cat.id}`, cat.name, cat.type, cat.color, cat.icon]
      );
      if (res.rows.length > 0) insertedCats++;
    }
    console.log(`✅ Categories processed: ${insertedCats} seeded/updated.`);

    // 3. Transactions Seeding (6 Months of realistic transactions)
    const merchants = [
      { desc: "Monthly Salary Payroll", amount: 65000, type: "income", catId: "cat-salary", merchant: "TechCorp Inc" },
      { desc: "Freelance UI Design Project", amount: 18500, type: "income", catId: "cat-freelance", merchant: "Client Design Studio" },
      { desc: "Apartment Rent", amount: 15000, type: "expense", catId: "cat-bills", merchant: "RealEstate Corp" },
      { desc: "Meralco Electricity Bill", amount: 4200, type: "expense", catId: "cat-bills", merchant: "Meralco" },
      { desc: "Maynilad Water Bill", amount: 850, type: "expense", catId: "cat-bills", merchant: "Maynilad" },
      { desc: "PLDT Fiber Internet", amount: 1899, type: "expense", catId: "cat-bills", merchant: "PLDT" },
      { desc: "Netflix Subscription", amount: 549, type: "expense", catId: "cat-entertainment", merchant: "Netflix" },
      { desc: "Spotify Premium", amount: 149, type: "expense", catId: "cat-entertainment", merchant: "Spotify" },
      { desc: "Starbucks Coffee", amount: 245, type: "expense", catId: "cat-food", merchant: "Starbucks" },
      { desc: "Weekly Grocery Shopping", amount: 3450, type: "expense", catId: "cat-food", merchant: "SM Supermarket" },
      { desc: "Grab Ride", amount: 320, type: "expense", catId: "cat-transport", merchant: "Grab Philippines" },
      { desc: "Amazon Electronics Purchase", amount: 4800, type: "expense", catId: "cat-shopping", merchant: "Amazon" },
      { desc: "Gasoline Fuel", amount: 2200, type: "expense", catId: "cat-transport", merchant: "Shell Station" },
      { desc: "Medical Checkup & Vitamins", amount: 1500, type: "expense", catId: "cat-healthcare", merchant: "Mercury Drug" },
    ];

    let insertedTxCount = 0;
    // Generate dates over past 6 months
    const today = new Date();
    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
      for (const item of merchants) {
        const txDate = new Date(today.getFullYear(), today.getMonth() - monthOffset, Math.floor(Math.random() * 25) + 1);
        const dateStr = txDate.toISOString().split("T")[0];
        const txId = `tx-seed-${userId.slice(-6)}-m${monthOffset}-${insertedTxCount}`;

        await pool.query(
          `INSERT INTO transactions (id, uuid, user_id, category_id, date, description, amount, type, status, merchant, is_imported, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'completed', $9, false, NOW(), NOW())
           ON CONFLICT (id) DO NOTHING`,
          [txId, `uuid-${txId}`, userId, item.catId, dateStr, item.desc, item.amount, item.type, item.merchant]
        );
        insertedTxCount++;
      }
    }
    console.log(`✅ Seeded ${insertedTxCount} realistic transactions for user ${userId}.`);

    // 4. Budgets Seeding
    const budgetCategories = [
      { categoryId: "cat-food", limit: 15000 },
      { categoryId: "cat-transport", limit: 8000 },
      { categoryId: "cat-bills", limit: 25000 },
      { categoryId: "cat-shopping", limit: 10000 },
      { categoryId: "cat-entertainment", limit: 5000 },
    ];

    const budgetId = `bgt-${userId.slice(-6)}-2026`;
    await pool.query(
      `INSERT INTO budgets (id, uuid, user_id, name, total_limit, total_spent, period, start_date, end_date, categories, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'monthly', '2026-07-01', '2026-07-31', $7, true, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET categories = EXCLUDED.categories`,
      [budgetId, `uuid-${budgetId}`, userId, "July 2026 Master Budget", 63000, 18500, JSON.stringify(budgetCategories)]
    );
    console.log(`✅ Seeded active monthly budget for user ${userId}.`);

    // 5. Goals Seeding
    const goalsData = [
      { name: "Emergency Fund", target: 100000, saved: 65000, deadline: "2026-12-31", color: "#10b981", icon: "Shield" },
      { name: "Laptop Upgrade", target: 85000, saved: 42000, deadline: "2026-10-15", color: "#3b82f6", icon: "Laptop" },
      { name: "Japan Vacation", target: 120000, saved: 35000, deadline: "2027-04-01", color: "#f59e0b", icon: "Plane" },
      { name: "Investment Fund", target: 200000, saved: 95000, deadline: "2027-12-31", color: "#8b5cf6", icon: "TrendingUp" },
    ];

    for (let i = 0; i < goalsData.length; i++) {
      const g = goalsData[i];
      const goalId = `goal-${userId.slice(-6)}-${i + 1}`;
      await pool.query(
        `INSERT INTO goals (id, uuid, user_id, name, target_amount, saved_amount, deadline, color, icon, is_completed, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET target_amount = EXCLUDED.target_amount, saved_amount = EXCLUDED.saved_amount`,
        [goalId, `uuid-${goalId}`, userId, g.name, g.target, g.saved, g.deadline, g.color, g.icon, g.saved >= g.target]
      );
    }
    console.log(`✅ Seeded 4 savings goals for user ${userId}.`);

    // 6. Settings Seeding
    await pool.query(
      `INSERT INTO settings (id, uuid, user_id, currency, currency_symbol, language, date_format, number_format, import_preferences, created_at, updated_at)
       VALUES ($1, $2, $3, 'PHP', '₱', 'en', 'YYYY-MM-DD', 'comma', $4, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET currency = 'PHP'`,
      [`set-${userId.slice(-6)}`, `uuid-set-${userId.slice(-6)}`, userId, JSON.stringify({ autoCategorize: true, defaultAccountId: "acc-001" })]
    );
    console.log(`✅ Seeded user settings for ${userId}.`);

    console.log("\n🎉 Database seeding complete! All data is live on Neon PostgreSQL.");
  } catch (err) {
    console.error("❌ Error during database seeding:", err);
  } finally {
    await pool.end();
  }
}

main();
