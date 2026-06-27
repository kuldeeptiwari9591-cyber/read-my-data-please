import { lazy, Suspense, useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HeroScene = lazy(() =>
  import("./HeroScene").then((m) => ({ default: m.HeroScene })),
);

/**
 * Defers the 3D Three.js hero until after first paint and skips it for users
 * with prefers-reduced-motion. Cuts LCP risk on mobile dramatically.
 */
export function HeroSceneLazy() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduced) return;
    // Wait for browser idle so it never competes with LCP image/text paint.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
    };
    const handle = w.requestIdleCallback
      ? w.requestIdleCallback(() => setShow(true), { timeout: 1500 })
      : window.setTimeout(() => setShow(true), 600);
    return () => {
      if (w.requestIdleCallback && typeof handle === "number") {
        (w as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback?.(handle);
      } else {
        clearTimeout(handle as unknown as number);
      }
    };
  }, [reduced]);

  if (reduced || !show) {
    // Lightweight CSS-only placeholder so layout stays stable (no CLS).
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(99,102,241,0.18), transparent 60%)",
        }}
      />
    );
  }

  return (
    <Suspense fallback={null}>
      <HeroScene />
    </Suspense>
  );
}
