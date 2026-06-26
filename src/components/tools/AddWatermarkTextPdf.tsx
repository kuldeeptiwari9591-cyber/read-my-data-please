import { useState } from "react";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import { Type, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { toast } from "sonner";

export function AddWatermarkTextPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.15);
  const [size, setSize] = useState(72);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    if (!text.trim()) return toast.error("Enter watermark text");
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      doc.getPages().forEach((page) => {
        const w = page.getWidth();
        const h = page.getHeight();
        const tw = font.widthOfTextAtSize(text, size);
        page.drawText(text, {
          x: w / 2 - tw / 2,
          y: h / 2,
          size,
          font,
          color: rgb(0.4, 0.4, 0.55),
          opacity,
          rotate: degrees(-30),
        });
      });
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "watermarked.pdf");
      toast.success("Watermark added");
    } catch (e) {
      console.error(e);
      toast.error("Failed to add watermark");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Add Watermark Text"
      description="Add a diagonal text watermark to every page."
      icon={<Type className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      {files.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm text-muted-foreground">Watermark text</label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">
              Opacity: {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min={5}
              max={80}
              value={opacity * 100}
              onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
              className="mt-2 w-full accent-[color:var(--primary)]"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Font size: {size}px</label>
            <input
              type="range"
              min={24}
              max={160}
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
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
        Watermark & download
      </button>
    </ToolShell>
  );
}
