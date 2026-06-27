// In-memory rolling-window rate limiter for server functions.
// Scope: per Worker isolate. Good for absorbing bursts and signaling abuse;
// not a strict distributed quota. Pair with audit logging.

type Bucket = { hits: number[]; lastSeen: number };

const BUCKETS = new Map<string, Bucket>();
const MAX_KEYS = 5000;

function gc(now: number) {
  if (BUCKETS.size < MAX_KEYS) return;
  for (const [k, b] of BUCKETS) {
    if (now - b.lastSeen > 10 * 60_000) BUCKETS.delete(k);
  }
}

export interface RateLimitOptions {
  key: string;            // e.g. `feedback:${ip}` or `blog-search:${ip}`
  limit: number;          // max requests per window
  windowMs: number;       // rolling window size
}

export interface RateLimitResult {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  retryInMs: number;
}

export function checkRateLimit(opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  gc(now);
  const b = BUCKETS.get(opts.key) ?? { hits: [], lastSeen: now };
  b.hits = b.hits.filter((t) => now - t < opts.windowMs);
  b.lastSeen = now;

  if (b.hits.length >= opts.limit) {
    BUCKETS.set(opts.key, b);
    return {
      allowed: false,
      used: b.hits.length,
      limit: opts.limit,
      remaining: 0,
      retryInMs: Math.max(0, opts.windowMs - (now - b.hits[0])),
    };
  }

  b.hits.push(now);
  BUCKETS.set(opts.key, b);
  return {
    allowed: true,
    used: b.hits.length,
    limit: opts.limit,
    remaining: opts.limit - b.hits.length,
    retryInMs: 0,
  };
}
