import db from "../db";
import { v4 as uuidv4 } from "uuid";

export const getFinancialStats = async () => {
  try {
    // Check if we have transactions
    const countRes = await db.get("SELECT COUNT(*) as count FROM transactions") as { count: string };
    const count = parseInt(countRes?.count || "0");
    
    if (count === 0) {
      await seedMockTransactions();
    }

    const totalRevenue = await db.get(
      "SELECT SUM(amount) as total FROM transactions WHERE status = 'completed'"
    ) as { total: number };

    // MRR calculation (Subscriptions in last 30 days)
    const mrr = await db.get(
      `
            SELECT SUM(amount) as total 
            FROM transactions 
            WHERE status = 'completed' 
            AND type = 'subscription' 
            AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        `
    ) as { total: number };

    const activeSubscriptions = await db.get(
      `
            SELECT COUNT(DISTINCT user_id) as count 
            FROM transactions 
            WHERE status = 'completed' 
            AND type = 'subscription' 
            AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        `
    ) as { count: string };

    const recentTransactions = await db.all(
      `
            SELECT t.*, u.email as user_email, u.name as user_name
            FROM transactions t
            LEFT JOIN users u ON t.user_id = u.id
            ORDER BY t.created_at DESC
            LIMIT 10
        `
    );

    return {
      totalRevenue: totalRevenue?.total || 0,
      mrr: mrr?.total || 0,
      activeSubscriptions: parseInt(activeSubscriptions?.count || "0"),
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

const seedMockTransactions = async () => {
  try {
    const users = await db.all("SELECT id FROM users LIMIT 5") as {
      id: string;
    }[];
    if (users.length === 0) return;

    // Generate 50 mock transactions
    for (let i = 0; i < 50; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const isSub = Math.random() > 0.3;
      const amount = isSub ? 29.99 : 49.99;
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // Past 60 days

      await db.run(`
            INSERT INTO transactions (id, user_id, amount, status, type, description, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
        uuidv4(),
        user.id,
        amount,
        "completed",
        isSub ? "subscription" : "one_time",
        isSub ? "Pro Plan - Monthly" : "Course Purchase",
        date.toISOString(),
      ]);
    }
    console.log("Seeded mock financial data");
  } catch (err) {
    console.error("Error seeding mock financials:", err);
  }
};
