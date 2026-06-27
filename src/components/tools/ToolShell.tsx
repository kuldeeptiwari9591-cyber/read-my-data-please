import { useEffect, useState, type ReactNode } from "react";
import { SmartUploadZone } from "@/components/visuals/SmartUploadZone";
import { PdfThumbnailStrip } from "@/components/visuals/PdfThumbnailStrip";
import { PDFHealthScore } from "@/components/visuals/PDFHealthScore";
import { ShareCard } from "@/components/visuals/ShareCard";
import { celebrate } from "@/lib/celebrate";
import { TOOLS_BY_SLUG } from "@/lib/tools";
import { analytics } from "@/lib/analytics";

interface FileDropProps {
  multiple?: boolean;
  accept?: string;
  files: File[];
  onFiles: (files: File[]) => void;
  label?: string;
  preview?: boolean;
  highlightPages?: number[];
  /** Show PDF Health Score under the first uploaded PDF. Default true. */
  health?: boolean;
}

export function FileDrop({
  multiple = false,
  accept = "application/pdf,.pdf",
  files,
  onFiles,
  label = "Drop your PDF here, or click to browse",
  preview = true,
  highlightPages,
  health = true,
}: FileDropProps) {
  return (
    <div>
      <SmartUploadZone
        multiple={multiple}
        accept={accept}
        files={files}
        onFiles={onFiles}
        label={label}
      />
      {preview && files.length > 0 && (
        <PdfThumbnailStrip files={files} highlightPages={highlightPages} />
      )}
      {health && files.length > 0 && /\.pdf$/i.test(files[0].name) && (
        <PDFHealthScore file={files[0]} />
      )}
    </div>
  );
}

interface ToolShellProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  /** Slug — auto-derived from URL if omitted. Used by the share card. */
  slug?: string;
}

function fmtBytes(b?: number) {
  if (!b && b !== 0) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

function ShareCardSlot({ slug, title }: { slug: string; title: string }) {
  const [downloaded, setDownloaded] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | undefined>();
  const [resultSize, setResultSize] = useState<number | undefined>();
  const [count, setCount] = useState<number | undefined>();

  useEffect(() => {
    const onUp = (e: Event) => {
      const d = (e as CustomEvent).detail as { size?: number; count?: number };
      setOriginalSize(d?.size);
      setCount(d?.count);
    };
    const onDown = (e: Event) => {
      const d = (e as CustomEvent).detail as { size?: number; slug?: string };
      if (d?.slug && slug && d.slug !== slug) return;
      setResultSize(d?.size);
      setDownloaded(true);
    };
    window.addEventListener("crisppdf:upload", onUp);
    window.addEventListener("crisppdf:download", onDown);
    return () => {
      window.removeEventListener("crisppdf:upload", onUp);
      window.removeEventListener("crisppdf:download", onDown);
    };
  }, [slug]);

  if (!downloaded || !slug) return null;

  const ctx: Record<string, string> = {};
  if (originalSize) ctx.originalSize = fmtBytes(originalSize);
  if (resultSize) ctx.newSize = fmtBytes(resultSize);
  if (originalSize && resultSize && originalSize > 0) {
    ctx.percent = Math.max(0, Math.round((1 - resultSize / originalSize) * 100)).toString();
  }
  if (count) ctx.count = String(count);

  return <ShareCard toolSlug={slug} toolName={title} context={ctx} />;
}

export function ToolShell({ title, description, icon, children, slug }: ToolShellProps) {
  const [resolvedSlug, setResolvedSlug] = useState<string | undefined>(slug);
  useEffect(() => {
    if (slug) return;
    if (typeof window !== "undefined") {
      const m = window.location.pathname.match(/^\/([a-z0-9-]+)/i);
      if (m) setResolvedSlug(m[1]);
    }
  }, [slug]);

  const ctxSlug = resolvedSlug ?? "";
  const ctxTitle = TOOLS_BY_SLUG[ctxSlug]?.name ?? String(title);

  return (
    <ToolShellContext.Provider value={{ slug: ctxSlug, title: ctxTitle }}>
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
        <ShareCardSlot slug={ctxSlug} title={ctxTitle} />
      </div>
    </ToolShellContext.Provider>
  );
}

import { createContext, useContext } from "react";
const ToolShellContext = createContext<{ slug: string; title: string }>({
  slug: "",
  title: "",
});
export function useToolContext() {
  return useContext(ToolShellContext);
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

  // Broadcast download for ShareCard context
  try {
    if (typeof window !== "undefined") {
      const m = window.location.pathname.match(/^\/([a-z0-9-]+)/i);
      const slug = m?.[1];
      window.dispatchEvent(
        new CustomEvent("crisppdf:download", { detail: { size: blob.size, slug } }),
      );
      if (slug) {
        void import("@/lib/ops-log").then(({ logOperation }) =>
          logOperation({
            toolSlug: slug,
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
  variant?: "default" | "compress" | "merge" | "split" | "convert" | "rotate";
}

export { RichProgressBar } from "@/components/visuals/RichProgressBar";

import { ProcessingAnimation } from "@/components/visuals/ProcessingAnimation";

export function ProgressBar({
  progress,
  label,
  status,
  stage,
  variant,
}: ProgressBarProps) {
  // Auto-pick variant from slug when caller omits it
  const ctx = useToolContext();
  const auto = variant ?? variantFromSlug(ctx.slug);
  return (
    <ProcessingAnimation
      progress={progress}
      variant={auto}
      label={label ?? "Processing your PDF…"}
      status={status}
      stage={stage}
    />
  );
}

function variantFromSlug(
  slug: string,
): "default" | "compress" | "merge" | "split" | "convert" | "rotate" {
  if (!slug) return "default";
  if (slug === "compress-pdf") return "compress";
  if (slug === "merge-pdf") return "merge";
  if (slug === "split-pdf" || slug === "extract-pdf-pages") return "split";
  if (slug.startsWith("pdf-to-") || slug.endsWith("-to-pdf")) return "convert";
  if (slug === "rotate-pdf") return "rotate";
  return "default";
}

export { ShareCard };
