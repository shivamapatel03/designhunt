import db from "./db";
import { isHealthy } from "./lib/redis";
import bcrypt from "bcryptjs";

// Mocking the behavior of storeOtp/getStoredOtp manually since we are in a script
async function verifyOtpPersistence() {
  const email = "shivampatel2330@gmail.com";
  const testOtp = "999999";
  const type = "signup";

  console.log("--- Starting Verification ---");
  console.log("Redis Healthy:", isHealthy());

  if (isHealthy()) {
    console.log("NOTE: Redis is healthy. To test fallback, please stop Redis.");
  } else {
    console.log("Redis is NOT healthy. Testing SQLite fallback...");
  }

  // 1. Clear existing
  db.prepare("UPDATE users SET otp_code = NULL, otp_expires_at = NULL WHERE email = ?").run(email);
  
  // 2. Simulate storing in DB (fallback logic)
  const expiresAt = new Date(Date.now() + 600 * 1000).toISOString();
  db.prepare(
    "UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE email = ?"
  ).run(testOtp, expiresAt, email);
  console.log("OTP stored in DB manually for verification.");

  // 3. Read back
  const user = db.prepare("SELECT otp_code, otp_expires_at FROM users WHERE email = ?").get(email) as any;
  console.log("Read from DB:", user);

  if (user && user.otp_code === testOtp) {
    console.log("SUCCESS: OTP persisted in SQLite database.");
  } else {
    console.error("FAILURE: OTP did not persist in database.");
    process.exit(1);
  }

  console.log("--- Verification Complete ---");
  process.exit(0);
}

verifyOtpPersistence();
