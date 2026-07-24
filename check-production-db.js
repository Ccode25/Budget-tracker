const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  const [settings, tx, goals, cat] = await Promise.all([
    pool.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'settings') AS exists_settings"),
    pool.query("SELECT COUNT(*)::text AS tx_count FROM transactions WHERE user_id = 'usr-1784802442270' AND deleted_at IS NULL"),
    pool.query("SELECT COUNT(*)::text AS goal_count FROM goals WHERE user_id = 'usr-1784802442270' AND deleted_at IS NULL"),
    pool.query("SELECT COUNT(*)::text AS cat_count FROM categories WHERE user_id = 'usr-1784802442270' AND deleted_at IS NULL"),
  ]);

  console.log(JSON.stringify({
    settingsTableExists: settings.rows[0]?.exists_settings,
    txCount: tx.rows[0]?.tx_count,
    goalCount: goals.rows[0]?.goal_count,
    catCount: cat.rows[0]?.cat_count,
  }, null, 2));

  await pool.end();
}

check().catch((e) => {
  console.error('CHECK_FAILED', e);
  process.exit(1);
});
