const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function profile() {
  const userId = 'usr-1784802442270';
  const out = {};

  let t0 = Date.now();
  const tx = await pool.query('SELECT * FROM transactions WHERE user_id = $1 AND deleted_at IS NULL ORDER BY date DESC', [userId]);
  out.tx = Date.now() - t0;
  out.txCount = tx.rowCount;

  t0 = Date.now();
  const goals = await pool.query('SELECT * FROM goals WHERE user_id = $1 AND deleted_at IS NULL', [userId]);
  out.goals = Date.now() - t0;
  out.goalsCount = goals.rowCount;

  t0 = Date.now();
  const catUser = await pool.query('SELECT * FROM categories WHERE user_id = $1 AND deleted_at IS NULL', [userId]);
  const catUserMs = Date.now() - t0;

  t0 = Date.now();
  const catGlobal = await pool.query('SELECT * FROM categories WHERE user_id IS NULL AND deleted_at IS NULL');
  const catGlobalMs = Date.now() - t0;

  out.catUser = catUserMs;
  out.catGlobal = catGlobalMs;
  out.catUnion = catUserMs + catGlobalMs;

  t0 = Date.now();
  const budgets = await pool.query('SELECT * FROM budgets WHERE user_id = $1 AND deleted_at IS NULL', [userId]);
  out.budgetRows = Date.now() - t0;
  out.budgetCount = budgets.rowCount;

  t0 = Date.now();
  const settings = await pool.query('SELECT * FROM settings WHERE user_id = $1 AND deleted_at IS NULL LIMIT 1', [userId]);
  out.settings = Date.now() - t0;
  out.settingsCount = settings.rowCount;

  // Simulate old categories query pattern
  t0 = Date.now();
  const oldCat = await pool.query('SELECT * FROM categories WHERE (user_id = $1 OR user_id IS NULL) AND deleted_at IS NULL', [userId]);
  out.catOldPattern = Date.now() - t0;

  console.log(JSON.stringify(out, null, 2));
  await pool.end();
}

profile().catch(console.error);
