import { useState } from "react";
import { Presentation, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob, ProgressBar } from "./ToolShell";
import { loadPdfjs } from "@/lib/pdfjs";
import { toast } from "sonner";

export function PdfToPpt() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    setProgress(0);
    try {
      const file = files[0];
      const buf = await file.arrayBuffer();
      const pdfjs = await loadPdfjs();
      const PptxGenJS = (await import("pptxgenjs")).default;
      const src = await pdfjs.getDocument({ data: buf.slice(0) }).promise;
      const pptx = new PptxGenJS();
      pptx.layout = "LAYOUT_WIDE";

      for (let i = 1; i <= src.numPages; i++) {
        const page = await src.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

        const slide = pptx.addSlide();
        const ratio = canvas.height / canvas.width;
        const w = 13.333;
        const h = w * ratio;
        slide.addImage({ data: dataUrl, x: 0, y: Math.max(0, (7.5 - h) / 2), w, h });
        setProgress(i / src.numPages);
      }

      const blob = (await pptx.write({ outputType: "blob" })) as Blob;
      downloadBlob(blob, file.name.replace(/\.pdf$/i, "") + ".pptx");
      toast.success("PowerPoint ready");
    } catch (e) {
      console.error(e);
      toast.error("Conversion failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="PDF to PowerPoint"
      description="Convert each PDF page into a slide in an editable .pptx."
      icon={<Presentation className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      {busy && <ProgressBar progress={progress} label="Rendering slides" />}
      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Convert & download .pptx
      </button>
    </ToolShell>
  );
}
