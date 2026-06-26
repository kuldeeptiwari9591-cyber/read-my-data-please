import { type ReactNode } from "react";
import { HoloUploadZone } from "@/components/visuals/HoloUploadZone";

interface FileDropProps {
  multiple?: boolean;
  accept?: string;
  files: File[];
  onFiles: (files: File[]) => void;
  label?: string;
}

export function FileDrop({
  multiple = false,
  accept = "application/pdf,.pdf",
  files,
  onFiles,
  label = "Drop your PDF here, or click to browse",
}: FileDropProps) {
  return (
    <HoloUploadZone
      multiple={multiple}
      accept={accept}
      files={files}
      onFiles={onFiles}
      label={label}
    />
  );
}

interface ToolShellProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

export function ToolShell({ title, description, icon, children }: ToolShellProps) {
  return (
    <div>
      <div className="flex items-start gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-secondary/25 ring-1 ring-primary/30 shadow-[0_0_30px_rgba(99,102,241,0.25)]">
          {icon}
        </div>
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-10">{children}</div>
    </div>
  );
}



export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  // Best-effort: log a successful operation for the admin dashboard.
  // Tool slug is derived from /tools/:slug, so it works for every tool route
  // without requiring each tool component to add its own log call.
  try {
    if (typeof window !== "undefined") {
      const m = window.location.pathname.match(/\/tools\/([^/?#]+)/);
      if (m) {
        // Lazy import so the ops module never blocks the download path.
        void import("@/lib/ops-log").then(({ logOperation }) =>
          logOperation({
            toolSlug: m[1],
            bytesIn: blob.size,
            success: true,
          }),
        );
      }
    }
  } catch {
    /* never break a download for telemetry */
  }
}

export function parseRanges(input: string, max: number): number[] {
  // "1-3,5,7-9" -> [1,2,3,5,7,8,9] (1-indexed), clamped to [1,max], deduped, sorted
  const out = new Set<number>();
  for (const part of input.split(",")) {
    const p = part.trim();
    if (!p) continue;
    if (p.includes("-")) {
      const [a, b] = p.split("-").map((x) => parseInt(x.trim(), 10));
      if (!isNaN(a) && !isNaN(b)) {
        const lo = Math.max(1, Math.min(a, b));
        const hi = Math.min(max, Math.max(a, b));
        for (let i = lo; i <= hi; i++) out.add(i);
      }
    } else {
      const n = parseInt(p, 10);
      if (!isNaN(n) && n >= 1 && n <= max) out.add(n);
    }
  }
  return [...out].sort((a, b) => a - b);
}

interface ProgressBarProps {
  progress: number; // 0..1
  label?: string;
  status?: string;
  stage?: string;
  done?: boolean;
}

export { RichProgressBar } from "@/components/visuals/RichProgressBar";

import { RichProgressBar as _RichProgressBar } from "@/components/visuals/RichProgressBar";

/** Back-compat wrapper — all 30 tools call `<ProgressBar />`. */
export function ProgressBar(props: ProgressBarProps) {
  return <_RichProgressBar {...props} />;
}
