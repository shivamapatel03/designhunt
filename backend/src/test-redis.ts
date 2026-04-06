import { client, connectRedis } from "./lib/redis";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  try {
    console.log("Connecting to Redis...");
    await connectRedis();
    console.log("Setting key...");
    await client.set("test-key", "test-value", { EX: 10 });
    console.log("Getting key...");
    const val = await client.get("test-key");
    console.log("Value:", val);
    if (val === "test-value") {
      console.log("SUCCESS: Redis is working.");
    } else {
      console.log("FAILURE: Redis value mismatch.");
    }
  } catch (err) {
    console.error("Redis Test Error:", err);
  } finally {
    await client.quit();
    process.exit(0);
  }
}

test();
