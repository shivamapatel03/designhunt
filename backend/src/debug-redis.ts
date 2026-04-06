import { client, connectRedis } from "./lib/redis";

async function testRedis() {
  try {
    await connectRedis();
    console.log("Setting a test key in Redis...");
    await client.set("test:hello", "world", { EX: 60 });
    console.log("Test key 'test:hello' set successfully! It will expire in 60 seconds.");
    
    const value = await client.get("test:hello");
    console.log(`Value read back from Redis: ${value}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Redis test failed:", error);
    process.exit(1);
  }
}

testRedis();
