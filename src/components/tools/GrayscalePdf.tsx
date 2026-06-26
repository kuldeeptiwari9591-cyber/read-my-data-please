import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Palette, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { loadPdfjs } from "@/lib/pdfjs";
import { toast } from "sonner";

export function GrayscalePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    setProgress(0);
    try {
      const file = files[0];
      const pdfjs = await loadPdfjs();
      const src = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      const out = await PDFDocument.create();
      const scale = 1.5;

      for (let i = 1; i <= src.numPages; i++) {
        const page = await src.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;

        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = img.data;
        for (let p = 0; p < d.length; p += 4) {
          const g = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2];
          d[p] = d[p + 1] = d[p + 2] = g;
        }
        ctx.putImageData(img, 0, 0);

        const blob: Blob = await new Promise((res) =>
          canvas.toBlob((b) => res(b!), "image/jpeg", 0.88),
        );
        const embedded = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
        const orig = page.getViewport({ scale: 1 });
        const p = out.addPage([orig.width, orig.height]);
        p.drawImage(embedded, { x: 0, y: 0, width: orig.width, height: orig.height });
        setProgress(Math.round((i / src.numPages) * 100));
      }

      const bytes = await out.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "grayscale.pdf");
      toast.success("Grayscale PDF downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Failed to convert");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Grayscale PDF"
      description="Convert every page to black & white. Great for cheaper printing."
      icon={<Palette className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      {busy && (
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Convert & download
      </button>
    </ToolShell>
  );
}
