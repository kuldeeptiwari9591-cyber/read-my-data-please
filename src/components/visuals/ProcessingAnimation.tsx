import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, Lock } from "lucide-react";
import { RichProgressBar } from "./RichProgressBar";

const FACTS = [
  "PDF stands for Portable Document Format",
  "PDF was invented by Adobe in 1993",
  "The average PDF is 350KB in size",
  "Over 2.5 trillion PDFs exist worldwide",
  "PDF/A is the archival standard used by governments",
];

export type ProcessingVariant =
  | "default"
  | "compress"
  | "merge"
  | "split"
  | "convert"
  | "rotate";

interface ProcessingAnimationProps {
  progress?: number;
  variant?: ProcessingVariant;
  label?: string;
  status?: string;
  stage?: string;
}

/**
 * Replaces the generic spinner. Indigo rotating arc + tool-specific doc
 * animation + rich progress + rotating PDF facts.
 */
export function ProcessingAnimation({
  progress = 0,
  variant = "default",
  label = "Processing your PDF…",
  status,
  stage,
}: ProcessingAnimationProps) {
  const reduce = useReducedMotion();
  const [factIdx, setFactIdx] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setFactIdx((i) => (i + 1) % FACTS.length), 3000);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="mt-6 flex flex-col items-center rounded-2xl border border-border/70 bg-surface/60 p-6 backdrop-blur-sm">
      <div className="relative flex h-28 w-28 items-center justify-center">
        {/* Rotating indigo arc */}
        {!reduce ? (
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
            style={{ willChange: "transform" }}
          >
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="rgba(99,102,241,0.15)"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="url(#pa-grad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="80 200"
              />
              <defs>
                <linearGradient id="pa-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        ) : (
          <div className="absolute inset-0 rounded-full border-4 border-primary/30" />
        )}

        {/* Tool-specific document icon */}
        <DocAnim variant={variant} reduce={!!reduce} />
      </div>

      <p className="mt-5 font-display text-base font-semibold">{label}</p>

      <div className="mt-2 w-full max-w-md">
        <RichProgressBar
          progress={progress}
          label={stage ?? "Working"}
          status={status}
        />
      </div>

      <div className="mt-3 h-5 overflow-hidden text-center">
        <motion.p
          key={factIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          className="text-xs text-muted-foreground"
        >
          {FACTS[factIdx]}
        </motion.p>
      </div>

      <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
        <Lock className="h-3 w-3" />
        Your file never leaves your device
      </div>
    </div>
  );
}

function DocAnim({
  variant,
  reduce,
}: {
  variant: ProcessingVariant;
  reduce: boolean;
}) {
  const base = "h-9 w-7 text-primary";
  if (reduce) return <FileText className={base} />;

  if (variant === "compress") {
    return (
      <motion.div
        animate={{ scaleY: [1, 0.6, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
      >
        <FileText className={base} />
      </motion.div>
    );
  }
  if (variant === "merge") {
    return (
      <div className="relative">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              x: [(-12 + i * 12), 0, 0],
              opacity: [0.5, 1, 1],
            }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.05 }}
            style={{ willChange: "transform" }}
          >
            <FileText className="h-9 w-7 text-primary" />
          </motion.div>
        ))}
      </div>
    );
  }
  if (variant === "split") {
    return (
      <div className="relative">
        {[-1, 0, 1].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{ x: [0, i * 12, 0], rotate: [0, i * 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            style={{ willChange: "transform" }}
          >
            <FileText className="h-9 w-7 text-primary" />
          </motion.div>
        ))}
      </div>
    );
  }
  if (variant === "convert") {
    return (
      <motion.div
        animate={{ rotateY: [0, 180, 360], opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        style={{ willChange: "transform" }}
      >
        <FileText className={base} />
      </motion.div>
    );
  }
  if (variant === "rotate") {
    return (
      <motion.div
        animate={{ rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
      >
        <FileText className={base} />
      </motion.div>
    );
  }
  // default: pulsing glow
  return (
    <motion.div
      animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      style={{ willChange: "transform" }}
    >
      <FileText className={base} />
    </motion.div>
  );
}
