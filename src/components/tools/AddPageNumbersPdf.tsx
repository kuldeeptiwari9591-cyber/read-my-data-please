import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Hash, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { toast } from "sonner";

type Position = "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left";

export function AddPageNumbersPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [format, setFormat] = useState("Page {n} of {total}");
  const [fontSize, setFontSize] = useState(12);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const total = pages.length;
      pages.forEach((page, i) => {
        const text = format.replace("{n}", String(i + 1)).replace("{total}", String(total));
        const w = page.getWidth();
        const h = page.getHeight();
        const tw = font.widthOfTextAtSize(text, fontSize);
        const margin = 28;
        let x = (w - tw) / 2;
        let y = margin;
        if (position.endsWith("right")) x = w - tw - margin;
        if (position.endsWith("left")) x = margin;
        if (position.startsWith("top")) y = h - margin - fontSize;
        page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.25) });
      });
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "numbered.pdf");
      toast.success(`Numbered ${total} pages`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to add page numbers");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Add Page Numbers"
      description="Insert customizable page numbers across your PDF."
      icon={<Hash className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      {files.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-muted-foreground">Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as Position)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="bottom-center">Bottom · Center</option>
              <option value="bottom-right">Bottom · Right</option>
              <option value="bottom-left">Bottom · Left</option>
              <option value="top-center">Top · Center</option>
              <option value="top-right">Top · Right</option>
              <option value="top-left">Top · Left</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Font size</label>
            <input
              type="number"
              min={6}
              max={48}
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value) || 12)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-muted-foreground">Format</label>
            <input
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Use <span className="font-mono">{"{n}"}</span> for current page,{" "}
              <span className="font-mono">{"{total}"}</span> for total.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Number & download
      </button>
    </ToolShell>
  );
}
