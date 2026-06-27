// Core Web Vitals reporting → PostHog + GA4. No-ops if neither is configured.
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";
import { posthog } from "./posthog";

type GtagFn = (...args: unknown[]) => void;

function send(metric: Metric) {
  const payload = {
    metric: metric.name,
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    rating: metric.rating, // "good" | "needs-improvement" | "poor"
    id: metric.id,
    navigation_type: metric.navigationType,
    path: typeof window !== "undefined" ? window.location.pathname : "",
  };

  try {
    if (posthog && typeof posthog.capture === "function") {
      posthog.capture("web_vitals", payload);
    }
  } catch {
    /* swallow */
  }

  try {
    const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
    if (typeof gtag === "function") {
      gtag("event", metric.name, {
        event_category: "Web Vitals",
        value: payload.value,
        metric_rating: payload.rating,
        metric_id: payload.id,
        non_interaction: true,
      });
    }
  } catch {
    /* swallow */
  }
}

let started = false;
export function startWebVitals() {
  if (typeof window === "undefined" || started) return;
  started = true;
  onCLS(send);
  onFCP(send);
  onINP(send);
  onLCP(send);
  onTTFB(send);
}
