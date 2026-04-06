import { client, connectRedis } from "./lib/redis";

async function populateRedis() {
  try {
    await connectRedis();
    console.log("Setting a test key in Redis...");
    
    // Setting an OTP key with NO expiration so you can see it in Redis Insight
    await client.set("otp:signup:test@example.com", "123456");
    console.log("Test OTP key placed in Redis!");
    
    const value = await client.get("otp:signup:test@example.com");
    console.log(`Value read back from Redis: ${value}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Redis test failed:", error);
    process.exit(1);
  }
}

populateRedis();
