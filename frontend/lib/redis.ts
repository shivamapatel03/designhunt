import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const createRedisInstance = () => {
  try {
    const instance = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        if (times > 3) {
          console.warn('Redis connection failed. Performance may be degraded as system falls back to database.');
          return null; // Stop retrying
        }
        return Math.min(times * 500, 2000);
      },
      reconnectOnError(err) {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      }
    });

    instance.on('error', (err) => {
      // Silence unhandled error events
      if (err.code === 'ECONNREFUSED') {
        // Just log a minimal message instead of a full stack trace
        console.warn(`Redis connection refused at ${REDIS_URL}`);
      } else {
        console.error('Redis error:', err);
      }
    });

    return instance;
  } catch (e) {
    console.error('Failed to initialize Redis client:', e);
    return null as any;
  }
};

const globalForRedis = global as unknown as { redis: Redis };

export const redis = globalForRedis.redis || createRedisInstance();

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

export default redis;
