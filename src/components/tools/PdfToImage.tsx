import { useState } from "react";
import JSZip from "jszip";
import { ImageIcon, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { loadPdfjs } from "@/lib/pdfjs";
import { toast } from "sonner";

interface Props {
  format: "jpeg" | "png";
  title: string;
  description: string;
}

export function PdfToImage({ format, title, description }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [dpi, setDpi] = useState(150);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    setProgress(0);
    try {
      const file = files[0];
      const pdfjs = await loadPdfjs();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      const zip = new JSZip();
      const scale = dpi / 72;
      const ext = format === "jpeg" ? "jpg" : "png";
      const mime = format === "jpeg" ? "image/jpeg" : "image/png";

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d")!;
        if (format === "jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        const blob: Blob = await new Promise((res) =>
          canvas.toBlob((b) => res(b!), mime, 0.92),
        );
        zip.file(`page-${String(i).padStart(3, "0")}.${ext}`, await blob.arrayBuffer());
        setProgress(Math.round((i / doc.numPages) * 100));
      }

      const out = await zip.generateAsync({ type: "blob" });
      downloadBlob(out, file.name.replace(/\.pdf$/i, "") + `-${ext}.zip`);
      toast.success(`Rendered ${doc.numPages} pages`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to render PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title={title}
      description={description}
      icon={<ImageIcon className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      {files.length > 0 && (
        <div className="mt-6">
          <label className="text-sm text-muted-foreground">Resolution: {dpi} DPI</label>
          <input
            type="range"
            min={72}
            max={300}
            step={6}
            value={dpi}
            onChange={(e) => setDpi(parseInt(e.target.value))}
            className="mt-2 w-full accent-[color:var(--primary)]"
          />
          <div className="flex justify-between font-mono text-xs text-muted-foreground">
            <span>screen</span>
            <span>print</span>
          </div>
        </div>
      )}

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
        Render & download ZIP
      </button>
    </ToolShell>
  );
}

export const PdfToJpg = () => (
  <PdfToImage
    format="jpeg"
    title="PDF to JPG"
    description="Render each PDF page as a high-quality JPG image, packaged in a ZIP."
  />
);

export const PdfToPng = () => (
  <PdfToImage
    format="png"
    title="PDF to PNG"
    description="Render each PDF page as a lossless PNG image, packaged in a ZIP."
  />
);
