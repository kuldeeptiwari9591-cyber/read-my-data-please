import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { TiltCard } from "./TiltCard";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: boolean;
}

export function GlassCard({
  children,
  className = "",
  tilt = false,
  glow = false,
}: GlassCardProps) {
  const card = (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      className={`relative overflow-hidden rounded-xl border border-border bg-surface/80 backdrop-blur-sm ${
        glow ? "glow-hover" : ""
      } ${className}`}
    >
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      {children}
    </motion.div>
  );

  return tilt ? <TiltCard>{card}</TiltCard> : card;
}
