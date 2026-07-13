import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Minimize2, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob, ProgressBar, ShareCard } from "./ToolShell";
import { FileSizeResult } from "@/components/visuals/FileSizeResult";
import { loadPdfjs } from "@/lib/pdfjs";
import { toast } from "sonner";

type Level = "light" | "medium" | "strong";

const LEVELS: Record<Level, { scale: number; quality: number; label: string }> = {
  light: { scale: 1.5, quality: 0.85, label: "Light (best quality)" },
  medium: { scale: 1.1, quality: 0.7, label: "Medium (recommended)" },
  strong: { scale: 0.85, quality: 0.55, label: "Strong (smallest)" },
};

// Bounds for the binary-search when the user picks a size target.
const MIN_SCALE = 0.4;
const MAX_SCALE = 1.6;
const MIN_QUALITY = 0.25;
const MAX_QUALITY = 0.9;
const MAX_ITERATIONS = 6;

async function renderPdfAtParams(
  buf: ArrayBuffer,
  scale: number,
  quality: number,
  onProgress?: (fraction: number, status: string) => void,
): Promise<Uint8Array> {
  const pdfjs = await loadPdfjs();
  const src = await pdfjs.getDocument({ data: buf.slice(0) }).promise;
  const out = await PDFDocument.create();
  for (let i = 1; i <= src.numPages; i++) {
    onProgress?.((i - 1) / src.numPages, `Rendering page ${i} of ${src.numPages}`);
    const page = await src.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    const blob: Blob = await new Promise((res) =>
      canvas.toBlob((b) => res(b!), "image/jpeg", quality),
    );
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const img = await out.embedJpg(bytes);
    const original = page.getViewport({ scale: 1 });
    const p = out.addPage([original.width, original.height]);
    p.drawImage(img, { x: 0, y: 0, width: original.width, height: original.height });
  }
  return await out.save({ useObjectStreams: true });
}

/**
 * Iteratively compress a PDF toward a target byte size.
 *
 * We treat (scale, quality) as one search dimension `t ∈ [0,1]` where
 * t=0 → aggressive (small), t=1 → gentle (large). Because output size is
 * monotonic in t, binary search converges in at most MAX_ITERATIONS passes.
 * Returns the smallest render that is ≤ target, or (if none fit) the
 * smallest render we produced.
 */
async function compressToTarget(
  buf: ArrayBuffer,
  targetBytes: number,
  onProgress: (overall: number, status: string) => void,
): Promise<{ bytes: Uint8Array; iterations: number; hit: boolean }> {
  let lo = 0;
  let hi = 1;
  let bestFit: Uint8Array | null = null;
  let bestAny: Uint8Array | null = null;
  let iterations = 0;

  const paramsAt = (t: number) => ({
    scale: MIN_SCALE + (MAX_SCALE - MIN_SCALE) * t,
    quality: MIN_QUALITY + (MAX_QUALITY - MIN_QUALITY) * t,
  });

  // Start with a midpoint pass so users see progress fast.
  let t = 0.55;
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    iterations = i + 1;
    const { scale, quality } = paramsAt(t);
    onProgress(
      i / MAX_ITERATIONS,
      `Pass ${i + 1}/${MAX_ITERATIONS} — scale ${scale.toFixed(2)}, quality ${quality.toFixed(2)}`,
    );
    const bytes = await renderPdfAtParams(buf, scale, quality);
    if (!bestAny || bytes.length < bestAny.length) bestAny = bytes;

    if (bytes.length <= targetBytes) {
      bestFit = bytes;
      // Try a gentler pass — maybe we can preserve more quality.
      lo = t;
      t = (t + hi) / 2;
    } else {
      // Overshoot — go smaller.
      hi = t;
      t = (lo + t) / 2;
    }
    // Stop early if the window is tiny.
    if (hi - lo < 0.03) break;
  }
  return {
    bytes: (bestFit ?? bestAny)!,
    iterations,
    hit: bestFit !== null,
  };
}

type CompressPdfProps = {
  /** When set, the tool ignores `level` and iterates toward this byte size. */
  targetKB?: number;
  /** Human label for messaging, e.g. "100 KB" or "1 MB". */
  targetLabel?: string;
};

export function CompressPdf({ targetKB, targetLabel }: CompressPdfProps = {}) {
  const [files, setFiles] = useState<File[]>([]);
  const [level, setLevel] = useState<Level>("medium");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{
    before: number;
    after: number;
    hit?: boolean;
    iterations?: number;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const isTargetMode = typeof targetKB === "number";

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    setResult(null);
    try {
      const file = files[0];
      const buf = await file.arrayBuffer();

      let outBytes: Uint8Array;
      let hit: boolean | undefined;
      let iterations: number | undefined;

      if (isTargetMode) {
        const targetBytes = targetKB! * 1024;
        const res = await compressToTarget(buf, targetBytes, (frac, s) => {
          setProgress(frac);
          setStatus(s);
        });
        outBytes = res.bytes;
        hit = res.hit;
        iterations = res.iterations;
      } else {
        const { scale, quality } = LEVELS[level];
        outBytes = await renderPdfAtParams(buf, scale, quality, (frac, s) => {
          setProgress(frac);
          setStatus(s);
        });
      }

      const blob = new Blob([outBytes as BlobPart], { type: "application/pdf" });
      setResult({ before: file.size, after: blob.size, hit, iterations });
      downloadBlob(blob, file.name.replace(/\.pdf$/i, "") + "-compressed.pdf");

      if (isTargetMode) {
        const kb = (blob.size / 1024).toFixed(0);
        if (hit) {
          toast.success(`Hit target — final size ${kb} KB (${iterations} passes)`);
        } else {
          toast.warning(
            `Closest we could get: ${kb} KB. ${targetLabel ?? `${targetKB}KB`} wasn't reachable without unreadable quality.`,
          );
        }
      } else {
        toast.success(`Reduced to ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to compress PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title={isTargetMode ? `Compress PDF to ${targetLabel ?? `${targetKB}KB`}` : "Compress PDF"}
      description={
        isTargetMode
          ? `Iteratively shrinks your PDF and stops when it fits under ${targetLabel ?? `${targetKB}KB`}. Runs entirely in your browser.`
          : "Shrink PDF file size while keeping content crisp. Choose your trade-off."
      }
      icon={<Minimize2 className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      {!isTargetMode && files.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {(Object.keys(LEVELS) as Level[]).map((k) => (
            <button
              key={k}
              onClick={() => setLevel(k)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                level === k
                  ? "border-primary bg-primary/10"
                  : "border-border bg-surface/40 hover:border-primary/60"
              }`}
            >
              <p className="font-display text-sm font-semibold capitalize">{k}</p>
              <p className="mt-1 text-xs text-muted-foreground">{LEVELS[k].label}</p>
            </button>
          ))}
        </div>
      )}

      {busy && <ProgressBar progress={progress} label="Compressing" status={status} />}

      {result && (
        <>
          <FileSizeResult before={result.before} after={result.after} />
          {isTargetMode && result.hit === false && (
            <p className="mt-3 text-sm text-amber-500">
              Your file has a lot of text/vectors — image downsampling alone can't hit{" "}
              {targetLabel ?? `${targetKB}KB`}. This is the smallest readable version we could
              produce ({result.iterations} passes).
            </p>
          )}
          <ShareCard
            toolSlug="compress-pdf"
            toolName="Compress PDF"
            context={{
              originalSize: `${(result.before / 1024 / 1024).toFixed(2)} MB`,
              newSize: `${(result.after / 1024 / 1024).toFixed(2)} MB`,
            }}
          />
        </>
      )}

      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {isTargetMode ? `Compress to ${targetLabel ?? `${targetKB}KB`}` : "Compress & download"}
      </button>
    </ToolShell>
  );
}
