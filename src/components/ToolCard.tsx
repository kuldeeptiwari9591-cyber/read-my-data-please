import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <Link to={("/" + tool.slug) as never} className="group block">
      <GlassCard tilt glow className="h-full">
        <div className="flex h-full flex-col p-5">
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 ring-1 ring-primary/30">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </div>
          <h3 className="mt-4 font-display text-base font-semibold leading-tight">
            {tool.name}
          </h3>
          <p className="mt-1.5 text-sm leading-snug text-muted-foreground">
            {tool.short}
          </p>
        </div>
      </GlassCard>
    </Link>
  );
}
