import { motion } from "framer-motion";

interface GradientBlobProps {
  className?: string;
  size?: number;
  from?: string;
  to?: string;
  duration?: number;
}

/** Animated soft blurred gradient blob — pure CSS/SVG, no WebGL. */
export function GradientBlob({
  className = "",
  size = 480,
  from = "rgba(99,102,241,0.45)",
  to = "rgba(139,92,246,0.35)",
  duration = 14,
}: GradientBlobProps) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-[120px] ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${from}, ${to} 60%, transparent 75%)`,
      }}
      animate={{
        scale: [1, 1.15, 0.95, 1],
        x: [0, 20, -10, 0],
        y: [0, -15, 10, 0],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
