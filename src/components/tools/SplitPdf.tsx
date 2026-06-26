import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Scissors, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob, parseRanges } from "./ToolShell";
import { toast } from "sonner";

export function SplitPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<"ranges" | "each">("ranges");
  const [ranges, setRanges] = useState("1-3,5");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    try {
      const src = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const total = src.getPageCount();

      if (mode === "each") {
        // Download each page as separate file (zip-less; trigger multiple downloads)
        for (let i = 0; i < total; i++) {
          const out = await PDFDocument.create();
          const [p] = await out.copyPages(src, [i]);
          out.addPage(p);
          const bytes = await out.save();
          downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), `page-${i + 1}.pdf`);
          await new Promise((r) => setTimeout(r, 120));
        }
        toast.success(`Split into ${total} files`);
      } else {
        const pages = parseRanges(ranges, total);
        if (pages.length === 0) return toast.error("No valid pages in range");
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, pages.map((p) => p - 1));
        copied.forEach((p) => out.addPage(p));
        const bytes = await out.save();
        downloadBlob(
          new Blob([bytes as BlobPart], { type: "application/pdf" }),
          `split-${pages.length}-pages.pdf`,
        );
        toast.success(`Extracted ${pages.length} pages`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to split PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Split PDF"
      description="Extract a range of pages, or split every page into its own file."
      icon={<Scissors className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            {(["ranges", "each"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                  mode === m
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-surface text-muted-foreground hover:border-primary/60"
                }`}
              >
                {m === "ranges" ? "Custom ranges" : "Every page → separate PDF"}
              </button>
            ))}
          </div>

          {mode === "ranges" && (
            <div>
              <label className="text-sm text-muted-foreground">Pages to extract</label>
              <input
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                placeholder="1-3,5,8-10"
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Use commas and dashes. Example: <span className="font-mono">1-3,5,8-10</span>
              </p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Split & download
      </button>
    </ToolShell>
  );
}
