import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Combine, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { toast } from "sonner";
import { useRateLimit } from "@/lib/rate-limit";
import { logOperation } from "@/lib/ops-log";

export function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const rl = useRateLimit("merge-pdf");

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= files.length) return;
    const next = [...files];
    [next[i], next[j]] = [next[j], next[i]];
    setFiles(next);
  };

  const run = async () => {
    if (files.length < 2) {
      toast.error("Add at least 2 PDFs to merge");
      return;
    }
    const gate = rl.consume();
    if (gate.blocked) {
      toast.error(`Slow down — try again in ${Math.ceil(gate.retryInMs / 1000)}s`);
      return;
    }
    setBusy(true);
    const started = performance.now();
    const bytesIn = files.reduce((s, f) => s + f.size, 0);
    try {
      const out = await PDFDocument.create();
      for (const f of files) {
        const src = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "merged.pdf");
      toast.success("Merged PDF downloaded");
      logOperation({
        toolSlug: "merge-pdf",
        fileCount: files.length,
        bytesIn,
        durationMs: Math.round(performance.now() - started),
        success: true,
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to merge PDFs");
      logOperation({
        toolSlug: "merge-pdf",
        fileCount: files.length,
        bytesIn,
        durationMs: Math.round(performance.now() - started),
        success: false,
        error: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setBusy(false);
    }
  };


  return (
    <ToolShell
      title="Merge PDF"
      description="Combine multiple PDFs into a single document. Drag to reorder before merging."
      icon={<Combine className="h-7 w-7 text-primary" />}
    >
      <FileDrop multiple files={files} onFiles={setFiles} label="Drop PDFs to merge" />

      {files.length > 1 && (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-border bg-surface/40 px-3 py-2 text-sm"
            >
              <span className="truncate">
                <span className="mr-2 font-mono text-xs text-muted-foreground">{i + 1}.</span>
                {f.name}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === files.length - 1}
                  className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={run}
        disabled={busy || files.length < 2}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Merge & download
      </button>
    </ToolShell>
  );
}
