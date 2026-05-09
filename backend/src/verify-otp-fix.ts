import db from "./db";
import { isHealthy } from "./lib/redis";

// Mocking the behavior of storeOtp/getStoredOtp manually since we are in a script
async function verifyOtpPersistence() {
  const email = "designhunt.community@gmail.com";
  const testOtp = "999999";

  console.log("--- Starting Verification ---");
  console.log("Redis Healthy:", isHealthy());

  if (isHealthy()) {
    console.log("NOTE: Redis is healthy. To test fallback, please stop Redis.");
  } else {
    console.log("Redis is NOT healthy. Testing Database fallback...");
  }

  try {
    // 1. Clear existing
    await db.run(
      "UPDATE users SET otp_code = NULL, otp_expires_at = NULL WHERE email = $1",
      [email],
    );

    // 2. Simulate storing in DB (fallback logic)
    const expiresAt = new Date(Date.now() + 600 * 1000).toISOString();
    await db.run(
      "UPDATE users SET otp_code = $1, otp_expires_at = $2 WHERE email = $3",
      [testOtp, expiresAt, email],
    );
    console.log("OTP stored in DB manually for verification.");

    // 3. Read back
    const user = (await db.get(
      "SELECT otp_code, otp_expires_at FROM users WHERE email = $1",
      [email],
    )) as any;
    console.log("Read from DB:", user);

    if (user && user.otp_code === testOtp) {
      console.log("SUCCESS: OTP persisted in database.");
    } else {
      console.error("FAILURE: OTP did not persist in database.");
      process.exit(1);
    }
  } catch (error) {
    console.error("Verification error:", error);
    process.exit(1);
  }

  console.log("--- Verification Complete ---");
  process.exit(0);
}

verifyOtpPersistence();
