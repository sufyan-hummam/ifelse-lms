import { headers } from "next/headers";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory sliding window rate limiter
const store: RateLimitStore = {};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 60000);

export interface RateLimitOptions {
  keyPrefix: string;
  limit: number;
  windowMs: number;
}

export async function checkRateLimit(options: RateLimitOptions, identifierOverride?: string): Promise<{ success: boolean; remaining: number; reset: number }> {
  let identifier = identifierOverride;

  if (!identifier) {
    try {
      const headerList = await headers();
      identifier =
        headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headerList.get("x-real-ip") ||
        "127.0.0.1";
    } catch {
      identifier = "127.0.0.1";
    }
  }

  const key = `${options.keyPrefix}:${identifier}`;
  const now = Date.now();

  const record = store[key];

  if (!record || record.resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + options.windowMs,
    };
    return {
      success: true,
      remaining: options.limit - 1,
      reset: Math.ceil(options.windowMs / 1000),
    };
  }

  if (record.count >= options.limit) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      reset: retryAfter,
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: options.limit - record.count,
    reset: Math.ceil((record.resetTime - now) / 1000),
  };
}
