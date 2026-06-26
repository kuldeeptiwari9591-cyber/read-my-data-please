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

export function CompressPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [level, setLevel] = useState<Level>("medium");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ before: number; after: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    setResult(null);
    try {
      const file = files[0];
      const buf = await file.arrayBuffer();
      const pdfjs = await loadPdfjs();
      const src = await pdfjs.getDocument({ data: buf.slice(0) }).promise;
      const out = await PDFDocument.create();
      const { scale, quality } = LEVELS[level];

      for (let i = 1; i <= src.numPages; i++) {
        setStatus(`Rendering page ${i} of ${src.numPages}`);
        setProgress((i - 1) / src.numPages);
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

      const outBytes = await out.save({ useObjectStreams: true });
      const blob = new Blob([outBytes as BlobPart], { type: "application/pdf" });
      setResult({ before: file.size, after: blob.size });
      downloadBlob(blob, file.name.replace(/\.pdf$/i, "") + "-compressed.pdf");
      toast.success(`Reduced to ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to compress PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Compress PDF"
      description="Shrink PDF file size while keeping content crisp. Choose your trade-off."
      icon={<Minimize2 className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      {files.length > 0 && (
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
        Compress & download
      </button>
    </ToolShell>
  );
}
