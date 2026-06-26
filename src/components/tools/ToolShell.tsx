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
}

export function ProgressBar({ progress, label, status }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <div className="mt-6 rounded-xl border border-border bg-surface/60 p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label ?? "Processing"}</span>
        <span className="font-mono text-muted-foreground">{Math.round(pct)}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {status && (
        <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">{status}</p>
      )}
    </div>
  );
}
