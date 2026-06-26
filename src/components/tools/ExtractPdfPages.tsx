import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Copy, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob, parseRanges } from "./ToolShell";
import { toast } from "sonner";

export function ExtractPdfPages() {
  const [files, setFiles] = useState<File[]>([]);
  const [ranges, setRanges] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    if (!ranges.trim()) return toast.error("Enter pages to extract");
    setBusy(true);
    try {
      const src = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const total = src.getPageCount();
      const pages = parseRanges(ranges, total);
      if (pages.length === 0) return toast.error("No valid pages");

      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, pages.map((p) => p - 1));
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      downloadBlob(
        new Blob([bytes as BlobPart], { type: "application/pdf" }),
        `extracted-${pages.length}-pages.pdf`,
      );
      toast.success(`Extracted ${pages.length} pages`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to extract pages");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Extract Pages"
      description="Pull selected pages out of a PDF into a new document."
      icon={<Copy className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      {files.length > 0 && (
        <div className="mt-6">
          <label className="text-sm text-muted-foreground">Pages to extract</label>
          <input
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder="1,3-5,8"
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Pages are kept in ascending order. Example: <span className="font-mono">1,3-5,8</span>
          </p>
        </div>
      )}

      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Extract & download
      </button>
    </ToolShell>
  );
}
