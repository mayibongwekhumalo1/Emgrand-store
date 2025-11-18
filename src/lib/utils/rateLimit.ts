import RedisService from '../redis';

// Initialize Redis service
const redisService = new RedisService();
redisService.connect();

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyPrefix?: string; // Prefix for Redis keys
}

export class RateLimiter {
  private windowMs: number;
  private maxRequests: number;
  private keyPrefix: string;

  constructor(options: RateLimitOptions) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;
    this.keyPrefix = options.keyPrefix || 'ratelimit';
  }

  async checkLimit(identifier: string): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `${this.keyPrefix}:${identifier}`;
    const now = Date.now();

    try {
      // Get current request data
      const data = await redisService.get<{ count: number; resetTime: number }>(key) || { count: 0, resetTime: now + this.windowMs };

      // Check if window has expired
      if (now > data.resetTime) {
        data.count = 0;
        data.resetTime = now + this.windowMs;
      }

      if (data.count >= this.maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: data.resetTime
        };
      }

      // Increment count
      data.count += 1;

      // Save updated data
      await redisService.set(key, data, Math.ceil(this.windowMs / 1000));

      return {
        allowed: true,
        remaining: this.maxRequests - data.count,
        resetTime: data.resetTime
      };
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Allow request on Redis error to avoid blocking legitimate users
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs
      };
    }
  }
}

// Pre-configured rate limiters
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes for auth
  keyPrefix: 'auth'
});

export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  keyPrefix: 'api'
});