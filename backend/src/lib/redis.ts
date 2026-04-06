import { createClient } from "redis";

let isRedisConnected = false;

const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        console.error("Redis reconnection failed after 3 attempts. Disabling Redis fallback.");
        isRedisConnected = false;
        return false; // stop retrying
      }
      return Math.min(retries * 50, 500);
    },
    connectTimeout: 5000,
  },
});

client.on("connect", () => {
  isRedisConnected = true;
  console.log("Redis connecting...");
});

client.on("ready", () => {
  isRedisConnected = true;
  console.log("Redis ready");
});

client.on("error", (err) => {
  isRedisConnected = false;
  console.error("Redis Client Error:", err.message);
});

client.on("end", () => {
  isRedisConnected = false;
  console.log("Redis connection closed");
});

const connectRedis = async () => {
  try {
    if (!client.isOpen) {
      // Use connect without awaiting if we want to handle failure gracefully in background
      // but here we want to at least try once
      await client.connect();
      isRedisConnected = true;
      console.log("Redis connected successfully");
    }
  } catch (err: any) {
    isRedisConnected = false;
    console.error("Failed to connect to Redis:", err.message);
  }
};

const isHealthy = () => isRedisConnected && client.isOpen;

export { client, connectRedis, isHealthy };
