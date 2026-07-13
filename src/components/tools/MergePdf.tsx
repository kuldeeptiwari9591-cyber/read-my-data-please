import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Combine, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob, ShareCard } from "./ToolShell";
import { toast } from "sonner";
import { useRateLimit } from "@/lib/rate-limit";
import { logOperation } from "@/lib/ops-log";

/**
 * Parse a page range like "1-3,5,8-10" into zero-based page indices.
 * Empty string / whitespace means "all pages".
 * Returns null if the input is malformed.
 */
function parseRange(range: string, pageCount: number): number[] | null {
  const trimmed = range.trim();
  if (!trimmed) return Array.from({ length: pageCount }, (_, i) => i);
  const out: number[] = [];
  for (const part of trimmed.split(",")) {
    const seg = part.trim();
    if (!seg) continue;
    const m = seg.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) return null;
    const a = parseInt(m[1], 10);
    const b = m[2] ? parseInt(m[2], 10) : a;
    if (a < 1 || b < 1 || a > pageCount || b > pageCount || a > b) return null;
    for (let i = a; i <= b; i++) out.push(i - 1);
  }
  return out;
}

interface Item {
  file: File;
  range: string;
  pageCount: number;
}

export function MergePdf() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const rl = useRateLimit("merge-pdf");

  const onFiles = async (files: File[]) => {
    const next: Item[] = [];
    for (const f of files) {
      let count = 0;
      try {
        const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
        count = doc.getPageCount();
      } catch {
        count = 0;
      }
      next.push({ file: f, range: "", pageCount: count });
    }
    setItems(next);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };

  const setRange = (i: number, r: string) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, range: r } : it)));
  };

  const run = async () => {
    if (items.length < 2) {
      toast.error("Add at least 2 PDFs to merge");
      return;
    }
    // Validate ranges up front for clearer feedback
    for (const [i, it] of items.entries()) {
      const idxs = parseRange(it.range, it.pageCount);
      if (idxs === null) {
        toast.error(`Invalid page range on file ${i + 1}: "${it.range}"`);
        return;
      }
    }
    const gate = rl.consume();
    if (gate.blocked) {
      toast.error(`Slow down — try again in ${Math.ceil(gate.retryInMs / 1000)}s`);
      return;
    }
    setBusy(true);
    const started = performance.now();
    const bytesIn = items.reduce((s, it) => s + it.file.size, 0);
    try {
      const out = await PDFDocument.create();
      for (const it of items) {
        const src = await PDFDocument.load(await it.file.arrayBuffer(), { ignoreEncryption: true });
        const idxs = parseRange(it.range, it.pageCount) ?? src.getPageIndices();
        const pages = await out.copyPages(src, idxs);
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "merged.pdf");
      setDone(true);
      toast.success("Merged PDF downloaded");
      logOperation({
        toolSlug: "merge-pdf",
        fileCount: items.length,
        bytesIn,
        durationMs: Math.round(performance.now() - started),
        success: true,
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to merge PDFs");
      logOperation({
        toolSlug: "merge-pdf",
        fileCount: items.length,
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
      description="Combine multiple PDFs — reorder them, and optionally pick which pages from each to include."
      icon={<Combine className="h-7 w-7 text-primary" />}
    >
      <FileDrop
        multiple
        files={items.map((it) => it.file)}
        onFiles={onFiles}
        label="Drop PDFs to merge"
      />

      {items.length > 0 && (
        <div className="mt-4 space-y-2">
          {items.map((it, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-surface/40 px-3 py-2 text-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate">
                  <span className="mr-2 font-mono text-xs text-muted-foreground">{i + 1}.</span>
                  {it.file.name}
                  {it.pageCount > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      · {it.pageCount} page{it.pageCount === 1 ? "" : "s"}
                    </span>
                  )}
                </span>
                <div className="flex flex-shrink-0 gap-1">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {it.pageCount > 1 && (
                <div className="mt-2 flex items-center gap-2">
                  <label className="text-xs text-muted-foreground" htmlFor={`range-${i}`}>
                    Pages
                  </label>
                  <input
                    id={`range-${i}`}
                    type="text"
                    value={it.range}
                    onChange={(e) => setRange(i, e.target.value)}
                    placeholder={`All (e.g. 1-${it.pageCount} or 1,3-5)`}
                    className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs outline-none focus:border-primary"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={run}
        disabled={busy || items.length < 2}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Merge & download
      </button>

      {done && (
        <ShareCard
          toolSlug="merge-pdf"
          toolName="Merge PDF"
          context={{ count: String(items.length) }}
        />
      )}
    </ToolShell>
  );
}
