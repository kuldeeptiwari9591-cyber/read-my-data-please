import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Crop, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { toast } from "sonner";

export function CropPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [margin, setMargin] = useState(36); // points (~0.5 inch)
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      doc.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const m = Math.min(margin, width / 3, height / 3);
        page.setCropBox(m, m, width - m * 2, height - m * 2);
      });
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "cropped.pdf");
      toast.success("Cropped PDF downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Crop PDF"
      description="Trim equal margins from every page. Output preserves text and vectors."
      icon={<Crop className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      {files.length > 0 && (
        <div className="mt-6">
          <label className="text-sm text-muted-foreground">
            Margin to trim: {margin} pt (~{(margin / 72).toFixed(2)} in)
          </label>
          <input
            type="range"
            min={6}
            max={108}
            value={margin}
            onChange={(e) => setMargin(parseInt(e.target.value))}
            className="mt-2 w-full accent-[color:var(--primary)]"
          />
        </div>
      )}

      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Crop & download
      </button>
    </ToolShell>
  );
}
