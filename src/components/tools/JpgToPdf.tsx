import { useState } from "react";
import { PDFDocument, PageSizes } from "pdf-lib";
import { FileImage, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { toast } from "sonner";

type PageSize = "fit" | "a4" | "letter";

export function JpgToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("fit");
  const [margin, setMargin] = useState(20);
  const [busy, setBusy] = useState(false);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= files.length) return;
    const next = [...files];
    [next[i], next[j]] = [next[j], next[i]];
    setFiles(next);
  };

  const run = async () => {
    if (files.length === 0) return toast.error("Add at least one image");
    setBusy(true);
    try {
      const doc = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const isPng = f.type === "image/png" || f.name.toLowerCase().endsWith(".png");
        const img = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);

        let pageWidth = img.width;
        let pageHeight = img.height;
        if (pageSize === "a4") [pageWidth, pageHeight] = PageSizes.A4;
        if (pageSize === "letter") [pageWidth, pageHeight] = PageSizes.Letter;

        const page = doc.addPage([pageWidth, pageHeight]);
        const innerW = pageWidth - margin * 2;
        const innerH = pageHeight - margin * 2;
        const scale = Math.min(innerW / img.width, innerH / img.height, 1);
        const w = img.width * scale;
        const h = img.height * scale;
        page.drawImage(img, {
          x: (pageWidth - w) / 2,
          y: (pageHeight - h) / 2,
          width: w,
          height: h,
        });
      }
      const out = await doc.save();
      downloadBlob(new Blob([out as BlobPart], { type: "application/pdf" }), "images.pdf");
      toast.success(`Built PDF from ${files.length} images`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to build PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="JPG to PDF"
      description="Combine JPG or PNG images into a single sharable PDF."
      icon={<FileImage className="h-7 w-7 text-primary" />}
    >
      <FileDrop
        multiple
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        files={files}
        onFiles={setFiles}
        label="Drop JPG / PNG images"
      />

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

      {files.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-muted-foreground">Page size</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PageSize)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="fit">Fit to image</option>
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Margin: {margin}pt</label>
            <input
              type="range"
              min={0}
              max={80}
              value={margin}
              onChange={(e) => setMargin(parseInt(e.target.value))}
              className="mt-2 w-full accent-[color:var(--primary)]"
            />
          </div>
        </div>
      )}

      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Build PDF
      </button>
    </ToolShell>
  );
}
