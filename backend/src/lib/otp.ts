import bcrypt from "bcryptjs";
import db from "../db";
import { client as redis, isHealthy as isRedisHealthy } from "./redis";

const OTP_EXPIRY_SECONDS = 600; // 10 minutes

/**
 * Stores an OTP in Redis if healthy, otherwise falls back to Database.
 */
export async function storeOtp(email: string, otp: string, type: "signup" | "login" | "admin", hashed = false) {
  const redisKey = `otp:${type}:${email}`;
  const valueToStore = hashed ? await bcrypt.hash(otp, 10) : otp;

  if (isRedisHealthy()) {
    try {
      await redis.set(redisKey, valueToStore, { EX: OTP_EXPIRY_SECONDS });
      return { success: true, storedIn: "redis" };
    } catch (err) {
      console.error("Redis set error, falling back to DB:", err);
    }
  }

  // Fallback to Database
  // Using SQL to set expiration to ensure consistency with DB time
  await db.run(
    "UPDATE users SET otp_code = $1, otp_expires_at = CURRENT_TIMESTAMP + interval '10 minutes' WHERE email = $2",
    [valueToStore, email]
  );
  
  return { success: true, storedIn: "db" };
}

/**
 * Retrieves an OTP from Redis or Database.
 */
export async function getStoredOtp(email: string, type: "signup" | "login" | "admin") {
  const redisKey = `otp:${type}:${email}`;

  if (isRedisHealthy()) {
    try {
      const redisOtp = await redis.get(redisKey);
      if (redisOtp) return redisOtp;
    } catch (err) {
      console.error("Redis get error, checking DB:", err);
    }
  }

  // Check Database — let SQL evaluate expiry so there's NO timezone mismatch in Node.js
  // Try Postgres first (NOW() is Postgres syntax)
  try {
    const user = await (db as any).query(
      "SELECT otp_code FROM users WHERE email = $1 AND otp_code IS NOT NULL AND otp_expires_at > NOW()",
      [email]
    );
    if (user?.rows?.[0]?.otp_code) {
      return user.rows[0].otp_code;
    }
  } catch (err) {
    console.error("Postgres OTP check error:", err);
  }
  
  // SQLite fallback — datetime('now') is SQLite's equivalent of NOW()
  const { pool } = await import("../db");
  try {
    // Try direct Postgres pool once more as safety
    const res = await pool.query(
      "SELECT otp_code FROM users WHERE email = $1 AND otp_code IS NOT NULL AND otp_expires_at > NOW()",
      [email]
    );
    if (res?.rows?.[0]?.otp_code) return res.rows[0].otp_code;
  } catch (_) {}

  return null;
}

/**
 * Clears an OTP from both Redis and Database.
 */
export async function clearOtp(email: string, type: "signup" | "login" | "admin") {
  if (isRedisHealthy()) {
    try {
      await redis.del(`otp:${type}:${email}`);
    } catch (err) {
      console.error("Redis del error:", err);
    }
  }
  await db.run("UPDATE users SET otp_code = NULL, otp_expires_at = NULL WHERE email = $1", [email]);
}
