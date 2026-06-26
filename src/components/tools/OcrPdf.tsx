import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { ScanText, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob, ProgressBar } from "./ToolShell";
import { loadPdfjs } from "@/lib/pdfjs";
import { toast } from "sonner";

export function OcrPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    setProgress(0);
    setStatus("Loading OCR engine…");
    try {
      const file = files[0];
      const buf = await file.arrayBuffer();
      const pdfjs = await loadPdfjs();
      const Tesseract = (await import("tesseract.js")).default;

      const src = await pdfjs.getDocument({ data: buf.slice(0) }).promise;
      const out = await PDFDocument.create();
      const worker = await Tesseract.createWorker("eng", 1, {
        logger: (m) => {
          if (m.status) setStatus(m.status);
        },
      });

      for (let i = 1; i <= src.numPages; i++) {
        setStatus(`OCR page ${i} of ${src.numPages}`);
        const page = await src.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;

        const { data } = await worker.recognize(canvas);

        const orig = page.getViewport({ scale: 1 });
        const newPage = out.addPage([orig.width, orig.height]);
        const jpegBlob: Blob = await new Promise((res) =>
          canvas.toBlob((b) => res(b!), "image/jpeg", 0.85),
        );
        const jpgBytes = new Uint8Array(await jpegBlob.arrayBuffer());
        const img = await out.embedJpg(jpgBytes);
        newPage.drawImage(img, { x: 0, y: 0, width: orig.width, height: orig.height });

        // Draw invisible text layer so the PDF becomes searchable.
        const scaleX = orig.width / canvas.width;
        const scaleY = orig.height / canvas.height;
        for (const w of data.words ?? []) {
          if (!w.text?.trim() || !w.bbox) continue;
          const x = w.bbox.x0 * scaleX;
          const y = orig.height - w.bbox.y1 * scaleY;
          const h = (w.bbox.y1 - w.bbox.y0) * scaleY;
          newPage.drawText(w.text, {
            x,
            y,
            size: Math.max(4, h * 0.85),
            color: rgb(0, 0, 0),
            opacity: 0.001,
          });
        }
        setProgress(i / src.numPages);
      }

      await worker.terminate();

      const bytes = await out.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      downloadBlob(blob, file.name.replace(/\.pdf$/i, "") + "-ocr.pdf");
      toast.success("Searchable PDF ready");
    } catch (e) {
      console.error(e);
      toast.error("OCR failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="OCR PDF"
      description="Make scanned PDFs searchable. Runs Tesseract OCR fully in your browser."
      icon={<ScanText className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      {busy && <ProgressBar progress={progress} label="Running OCR" status={status} />}
      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Run OCR & download
      </button>
    </ToolShell>
  );
}
