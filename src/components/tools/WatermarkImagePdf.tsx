import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Stamp, Loader2, X } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { toast } from "sonner";

export function WatermarkImagePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(0.3);
  const [scale, setScale] = useState(40);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!image) return setPreview(null);
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    if (!image) return toast.error("Add a watermark image");
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const imgBytes = new Uint8Array(await image.arrayBuffer());
      const img = /png/i.test(image.type)
        ? await doc.embedPng(imgBytes)
        : await doc.embedJpg(imgBytes);

      doc.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const targetW = (width * scale) / 100;
        const ratio = img.height / img.width;
        const targetH = targetW * ratio;
        page.drawImage(img, {
          x: (width - targetW) / 2,
          y: (height - targetH) / 2,
          width: targetW,
          height: targetH,
          opacity,
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
      title="Watermark PDF"
      description="Stamp a logo or image watermark across every page."
      icon={<Stamp className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      <div className="mt-6">
        <label className="text-sm font-medium">Watermark image (PNG or JPG)</label>
        {!image ? (
          <label className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface/40 px-6 py-8 hover:border-primary/60">
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            />
            <span className="text-sm text-muted-foreground">Click to choose image</span>
          </label>
        ) : (
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-surface/60 p-3">
            {preview && (
              <img src={preview} alt="" className="h-16 w-16 rounded-md object-contain bg-white/5" />
            )}
            <div className="flex-1 truncate text-sm">{image.name}</div>
            <button
              onClick={() => setImage(null)}
              className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {files.length > 0 && image && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-muted-foreground">
              Opacity: {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min={5}
              max={100}
              value={opacity * 100}
              onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
              className="mt-2 w-full accent-[color:var(--primary)]"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Size: {scale}% of page width</label>
            <input
              type="range"
              min={10}
              max={90}
              value={scale}
              onChange={(e) => setScale(parseInt(e.target.value))}
              className="mt-2 w-full accent-[color:var(--primary)]"
            />
          </div>
        </div>
      )}

      <button
        onClick={run}
        disabled={busy || files.length === 0 || !image}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Watermark & download
      </button>
    </ToolShell>
  );
}
