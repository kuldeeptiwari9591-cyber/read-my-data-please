// Lightweight client-side rate limiter. Counts tool runs per rolling 60s window
// per slug, persisted in localStorage so a refresh doesn't reset the budget.
// Honest scope: this protects the UX from accidental hammer-clicks and signals
// "we care about fair use" — it is NOT a server-enforced limit.

import { useCallback, useEffect, useState } from "react";

const KEY = "crisppdf:rl:v1";
const WINDOW_MS = 60_000;
const DEFAULT_LIMIT = 20; // 20 runs / minute / tool

type Store = Record<string, number[]>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function writeStore(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

function prune(arr: number[], now: number) {
  return arr.filter((t) => now - t < WINDOW_MS);
}

export interface RateLimitState {
  used: number;
  limit: number;
  remaining: number;
  retryInMs: number;
  blocked: boolean;
}

export function useRateLimit(slug: string, limit = DEFAULT_LIMIT) {
  const [state, setState] = useState<RateLimitState>({
    used: 0,
    limit,
    remaining: limit,
    retryInMs: 0,
    blocked: false,
  });

  const refresh = useCallback(() => {
    const now = Date.now();
    const store = readStore();
    const arr = prune(store[slug] || [], now);
    store[slug] = arr;
    writeStore(store);
    const oldest = arr[0];
    setState({
      used: arr.length,
      limit,
      remaining: Math.max(0, limit - arr.length),
      retryInMs: oldest ? Math.max(0, WINDOW_MS - (now - oldest)) : 0,
      blocked: arr.length >= limit,
    });
  }, [slug, limit]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  const consume = useCallback((): RateLimitState => {
    const now = Date.now();
    const store = readStore();
    const arr = prune(store[slug] || [], now);
    if (arr.length >= limit) {
      const retryInMs = Math.max(0, WINDOW_MS - (now - arr[0]));
      const next = { used: arr.length, limit, remaining: 0, retryInMs, blocked: true };
      setState(next);
      return next;
    }
    arr.push(now);
    store[slug] = arr;
    writeStore(store);
    const next = {
      used: arr.length,
      limit,
      remaining: limit - arr.length,
      retryInMs: 0,
      blocked: false,
    };
    setState(next);
    return next;
  }, [slug, limit]);

  return { ...state, consume, refresh };
}
