import { Loader2, CheckCircle2 } from "lucide-react";

interface RichProgressBarProps {
  progress: number; // 0..1
  label?: string;
  status?: string;
  stage?: string;
  done?: boolean;
}

/**
 * Richer progress UI: gradient fill, animated shine, stage label,
 * percent + sub-status line, success state.
 */
export function RichProgressBar({
  progress,
  label = "Processing",
  status,
  stage,
  done = false,
}: RichProgressBarProps) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-surface/70 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {done ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
          ) : (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
          )}
          <span className="truncate text-sm font-medium text-foreground">{label}</span>
          {stage && (
            <span className="ml-1 truncate rounded-full border border-border/60 bg-background/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {stage}
            </span>
          )}
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {Math.round(pct)}%
        </span>
      </div>

      <div className="relative mt-3 h-2.5 overflow-hidden rounded-full bg-border/50">
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] transition-[width] duration-300 ease-out"
          style={{
            width: `${pct}%`,
            animation: done ? undefined : "rpb-flow 2.4s linear infinite",
          }}
        >
          <div className="absolute inset-0 -translate-x-full animate-[rpb-shine_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>

      {status && (
        <p className="mt-2.5 truncate font-mono text-[11px] text-muted-foreground">{status}</p>
      )}

      <style>{`
        @keyframes rpb-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes rpb-flow {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
