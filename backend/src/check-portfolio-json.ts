
import db from "./db";

async function checkPortfolio() {
  try {
    const res = await db.all(`SELECT id, email, portfolio_items FROM users`);
    for (const row of res as any[]) {
        if (row.portfolio_items) {
            try {
                JSON.parse(row.portfolio_items);
            } catch (e: any) {
                console.log(`User ${row.email} has INVALID portfolio_items JSON: "${row.portfolio_items}"`);
            }
        }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkPortfolio();
