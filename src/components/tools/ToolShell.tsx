import { type ReactNode } from "react";
import { HoloUploadZone } from "@/components/visuals/HoloUploadZone";
import { PdfThumbnailStrip } from "@/components/visuals/PdfThumbnailStrip";
import { celebrate } from "@/lib/celebrate";

interface FileDropProps {
  multiple?: boolean;
  accept?: string;
  files: File[];
  onFiles: (files: File[]) => void;
  label?: string;
  /** Pass to show live thumbnails of uploaded PDFs. Default true. */
  preview?: boolean;
  /** 1-indexed page numbers to highlight in the preview strip. */
  highlightPages?: number[];
}

export function FileDrop({
  multiple = false,
  accept = "application/pdf,.pdf",
  files,
  onFiles,
  label = "Drop your PDF here, or click to browse",
  preview = true,
  highlightPages,
}: FileDropProps) {
  return (
    <div>
      <HoloUploadZone
        multiple={multiple}
        accept={accept}
        files={files}
        onFiles={onFiles}
        label={label}
      />
      {preview && files.length > 0 && (
        <PdfThumbnailStrip files={files} highlightPages={highlightPages} />
      )}
    </div>
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

  // Confetti celebration (Animation 6)
  celebrate(0.75);

  // Ops log (best-effort)
  try {
    if (typeof window !== "undefined") {
      const m = window.location.pathname.match(/^\/([a-z0-9-]+)/i);
      if (m) {
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
  progress: number;
  label?: string;
  status?: string;
  stage?: string;
  done?: boolean;
  /** Tool family — picks the matching ProcessingAnimation variant. */
  variant?: "default" | "compress" | "merge" | "split" | "convert" | "rotate";
}

export { RichProgressBar } from "@/components/visuals/RichProgressBar";

import { ProcessingAnimation } from "@/components/visuals/ProcessingAnimation";

/** Back-compat: every tool calls `<ProgressBar />`. Now renders rich animation. */
export function ProgressBar({
  progress,
  label,
  status,
  stage,
  variant = "default",
}: ProgressBarProps) {
  return (
    <ProcessingAnimation
      progress={progress}
      variant={variant}
      label={label ?? "Processing your PDF…"}
      status={status}
      stage={stage}
    />
  );
}
