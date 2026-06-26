import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Trash2, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob, parseRanges } from "./ToolShell";
import { toast } from "sonner";

export function DeletePdfPages() {
  const [files, setFiles] = useState<File[]>([]);
  const [ranges, setRanges] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    if (!ranges.trim()) return toast.error("Enter pages to delete");
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const total = doc.getPageCount();
      const toDelete = new Set(parseRanges(ranges, total));
      if (toDelete.size === 0) return toast.error("No valid pages");
      if (toDelete.size >= total) return toast.error("Cannot delete all pages");

      // Delete from highest index down
      const sorted = [...toDelete].sort((a, b) => b - a);
      sorted.forEach((p) => doc.removePage(p - 1));

      const bytes = await doc.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "trimmed.pdf");
      toast.success(`Removed ${toDelete.size} pages`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete pages");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Delete Pages"
      description="Remove unwanted pages from your PDF in one click."
      icon={<Trash2 className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      {files.length > 0 && (
        <div className="mt-6">
          <label className="text-sm text-muted-foreground">Pages to delete</label>
          <input
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder="2,4-6"
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Use commas and dashes. Example: <span className="font-mono">2,4-6,9</span>
          </p>
        </div>
      )}

      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Delete & download
      </button>
    </ToolShell>
  );
}
