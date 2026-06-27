import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (typeof window === "undefined") return;
  if (initialized) return;
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  if (!key || key.startsWith("your_") || key.includes("XXXX")) return;
  posthog.init(key, {
    api_host: "https://app.posthog.com",
    autocapture: true,
    capture_pageview: true,
    respect_dnt: true,
    loaded: (ph) => {
      if (import.meta.env.DEV) ph.opt_out_capturing();
    },
  });
  initialized = true;
}

export { posthog };
