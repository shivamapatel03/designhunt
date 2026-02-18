import db from "../db";
import { v4 as uuidv4 } from "uuid";

export const getFinancialStats = () => {
  try {
    // Check if we have transactions, if not, seed some mock data for demo
    const count = db
      .prepare("SELECT COUNT(*) as count FROM transactions")
      .get() as { count: number };
    if (count.count === 0) {
      seedMockTransactions();
    }

    const totalRevenue = db
      .prepare(
        "SELECT SUM(amount) as total FROM transactions WHERE status = 'completed'",
      )
      .get() as { total: number };

    // Simple MRR calculation (Subscriptions in last 30 days)
    const mrr = db
      .prepare(
        `
            SELECT SUM(amount) as total 
            FROM transactions 
            WHERE status = 'completed' 
            AND type = 'subscription' 
            AND created_at >= date('now', '-30 days')
        `,
      )
      .get() as { total: number };

    const activeSubscriptions = db
      .prepare(
        `
            SELECT COUNT(DISTINCT user_id) as count 
            FROM transactions 
            WHERE status = 'completed' 
            AND type = 'subscription' 
            AND created_at >= date('now', '-30 days')
        `,
      )
      .get() as { count: number };

    const recentTransactions = db
      .prepare(
        `
            SELECT t.*, u.email as user_email, u.name as user_name
            FROM transactions t
            LEFT JOIN users u ON t.user_id = u.id
            ORDER BY t.created_at DESC
            LIMIT 10
        `,
      )
      .all();

    return {
      totalRevenue: totalRevenue.total || 0,
      mrr: mrr.total || 0,
      activeSubscriptions: activeSubscriptions.count || 0,
      recentTransactions,
    };
  } catch (err) {
    console.error("Error getting financial stats:", err);
    return {
      totalRevenue: 0,
      mrr: 0,
      activeSubscriptions: 0,
      recentTransactions: [],
    };
  }
};

const seedMockTransactions = () => {
  try {
    const users = db.prepare("SELECT id FROM users LIMIT 5").all() as {
      id: string;
    }[];
    if (users.length === 0) return;

    const stmt = db.prepare(`
            INSERT INTO transactions (id, user_id, amount, status, type, description, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

    // Generate 50 mock transactions
    for (let i = 0; i < 50; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const isSub = Math.random() > 0.3;
      const amount = isSub ? 29.99 : 49.99;
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // Past 60 days

      stmt.run(
        uuidv4(),
        user.id,
        amount,
        "completed",
        isSub ? "subscription" : "one_time",
        isSub ? "Pro Plan - Monthly" : "Course Purchase",
        date.toISOString(),
      );
    }
    console.log("Seeded mock financial data");
  } catch (err) {
    console.error("Error seeding mock financials:", err);
  }
};
