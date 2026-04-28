import bcrypt from "bcryptjs";
import db from "../db";
import { client as redis, isHealthy as isRedisHealthy } from "./redis";

const OTP_EXPIRY_SECONDS = 600; // 10 minutes

/**
 * Stores an OTP in Redis if healthy, otherwise falls back to SQLite.
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

  // Fallback to SQLite
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000).toISOString();
  db.prepare(
    "UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE email = ?"
  ).run(valueToStore, expiresAt, email);
  
  return { success: true, storedIn: "db" };
}

/**
 * Retrieves an OTP from Redis or SQLite.
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

  // Check SQLite
  const user = db.prepare("SELECT otp_code, otp_expires_at FROM users WHERE email = ?").get(email) as any;
  if (user && user.otp_code && new Date(user.otp_expires_at) > new Date()) {
    return user.otp_code;
  }

  return null;
}

/**
 * Clears an OTP from both Redis and SQLite.
 */
export async function clearOtp(email: string, type: "signup" | "login" | "admin") {
  if (isRedisHealthy()) {
    try {
      await redis.del(`otp:${type}:${email}`);
    } catch (err) {
      console.error("Redis del error:", err);
    }
  }
  db.prepare("UPDATE users SET otp_code = NULL, otp_expires_at = NULL WHERE email = ?").run(email);
}
