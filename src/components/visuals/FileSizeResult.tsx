import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  before: number; // bytes
  after: number; // bytes
}

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function useCounter(target: number, durationMs = 1500) {
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? target : 0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (reduce) {
      setVal(target);
      return;
    }
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(from + (target - from) * eased);
      if (t < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [target, durationMs, reduce]);
  return val;
}

/**
 * Animated file-size result card (Animation 5). Used by Compress and
 * other tools that report input vs output size.
 */
export function FileSizeResult({ before, after }: Props) {
  const b = useCounter(before);
  const a = useCounter(after);
  const savedPct = before > 0 ? Math.max(0, Math.round((1 - after / before) * 100)) : 0;

  let tone: "excellent" | "good" | "info" = "info";
  let badge = "ℹ️ PDF was already optimised";
  if (savedPct > 50) {
    tone = "excellent";
    badge = "🔥 Excellent compression!";
  } else if (savedPct >= 20) {
    tone = "good";
    badge = "✅ Good compression";
  }

  const toneCls =
    tone === "excellent"
      ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
      : tone === "good"
        ? "border-success/40 bg-success/10 text-success"
        : "border-primary/40 bg-primary/10 text-primary";

  return (
    <div className="mt-6 rounded-2xl border border-border/70 bg-surface/60 p-5 backdrop-blur-sm">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Before
          </p>
          <p className="mt-1 font-mono text-xl font-semibold tabular-nums">
            {fmt(b)}
          </p>
        </div>
        <motion.div
          initial={{ x: -6, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-display text-2xl text-primary"
        >
          →
        </motion.div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            After
          </p>
          <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-success">
            {fmt(a)}
          </p>
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1.1, 1], opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className={`mx-auto mt-4 inline-flex w-full items-center justify-center rounded-full border px-4 py-1.5 text-xs font-semibold ${toneCls}`}
        style={{ willChange: "transform, opacity" }}
      >
        You saved {savedPct}% — {badge}
      </motion.div>
    </div>
  );
}
