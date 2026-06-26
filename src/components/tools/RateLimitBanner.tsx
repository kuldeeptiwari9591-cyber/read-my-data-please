import { AlertCircle, Gauge } from "lucide-react";
import { useRateLimit } from "@/lib/rate-limit";

interface Props {
  slug: string;
}

// Mounted by every tool via ToolShell. Stays invisible until the user is
// approaching or has hit the per-minute cap.
export function RateLimitBanner({ slug }: Props) {
  const rl = useRateLimit(slug);
  if (rl.used === 0) return null;
  if (rl.remaining > 5 && !rl.blocked) return null;

  const seconds = Math.ceil(rl.retryInMs / 1000);
  const tone = rl.blocked
    ? "border-destructive/40 bg-destructive/10 text-destructive"
    : "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400";

  return (
    <div
      role="status"
      className={`mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${tone}`}
    >
      {rl.blocked ? (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <Gauge className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <div className="flex-1">
        <p className="font-medium">
          {rl.blocked
            ? `Hourly burst limit reached — try again in ${seconds}s`
            : `Heads up: ${rl.remaining} run${rl.remaining === 1 ? "" : "s"} left this minute`}
        </p>
        <p className="mt-0.5 text-xs opacity-80">
          {rl.used}/{rl.limit} runs in the last 60 seconds. The cap protects shared resources
          and resets automatically.
        </p>
      </div>
    </div>
  );
}
