// Sentry init — safe no-op when VITE_SENTRY_DSN is unset.
// Loaded lazily from the client root so SSR bundles stay lean.
let initialized = false;

export function initSentry() {
  if (typeof window === "undefined") return;
  if (initialized) return;
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn || dsn.startsWith("your_") || dsn.includes("xxx")) return;
  // Dynamic import keeps Sentry out of the SSR bundle.
  void import("@sentry/react").then((Sentry) => {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
      integrations: [Sentry.browserTracingIntegration()],
    });
    initialized = true;
  });
}
