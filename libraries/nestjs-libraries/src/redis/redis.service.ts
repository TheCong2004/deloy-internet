import { Redis } from 'ioredis';

// Create a mock Redis implementation for testing environments
class MockRedis {
  private data: Map<string, any> = new Map();

  async get(key: string) {
    return this.data.get(key);
  }

  async set(key: string, value: any) {
    this.data.set(key, value);
    return 'OK';
  }

  async del(key: string) {
    this.data.delete(key);
    return 1;
  }

  async rpush(key: string, value: any) {
    this.data.set(key, [...(this.data.get(key) || []), value]);
    return this.data.get(key).length;
  }

  async lrange(key: string, start: number, end: number) {
    const list = this.data.get(key) || [];
    return list.slice(start, end === -1 ? undefined : end + 1);
  }

  async expire() {
    return 1;
  }

  // Add other Redis methods as needed for your tests
}

// Use real Redis if REDIS_URL is reachable, otherwise gracefully use MockRedis
let instance: Redis;
try {
  if (process.env.REDIS_URL && process.env.REDIS_URL.startsWith('redis://')) {
    const r = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      retryStrategy: () => null,
      lazyConnect: true,
    });
    r.on('error', () => {}); // silence connection errors
    r.connect().catch(() => {});
    instance = r;
  } else {
    instance = new MockRedis() as unknown as Redis;
  }
} catch (e) {
  instance = new MockRedis() as unknown as Redis;
}

export const ioRedis = instance;

