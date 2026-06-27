import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { MiniDemo } from "./visuals/MiniDemo";
import type { Tool } from "@/lib/tools";
import { toolIconMap, categoryColorMap } from "@/lib/toolIcons";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = toolIconMap[tool.slug] ?? tool.icon;
  const colorClass = categoryColorMap[tool.category] ?? "text-primary";
  const [hover, setHover] = useState(false);
  return (
    <Link to={("/" + tool.slug) as never} className="group block">
      <GlassCard tilt glow className="h-full">
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="flex h-full flex-col p-5"
        >
          <div className="flex items-start justify-between">
            <motion.div
              animate={{ y: hover ? -2 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-secondary/15 ring-1 ring-primary/25"
              style={{ willChange: "transform" }}
            >
              <Icon className={`h-5 w-5 ${colorClass}`} />
            </motion.div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </div>
          <h3 className="mt-4 font-display text-base font-semibold leading-tight">
            {tool.name}
          </h3>
          <p className="mt-1.5 text-sm leading-snug text-muted-foreground">
            {tool.short}
          </p>
          <AnimatePresence>
            {hover && (
              <motion.div
                key="demo"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="mt-3 border-t border-border/40 pt-2"
                style={{ willChange: "transform, opacity" }}
              >
                <MiniDemo slug={tool.slug} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </Link>
  );
}
