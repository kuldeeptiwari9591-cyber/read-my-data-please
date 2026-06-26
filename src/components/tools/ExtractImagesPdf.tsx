import { useState } from "react";
import JSZip from "jszip";
import { Images, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { loadPdfjs } from "@/lib/pdfjs";
import { toast } from "sonner";

interface ImgData {
  data: Uint8ClampedArray | Uint8Array;
  width: number;
  height: number;
  kind?: number;
}

function imgToCanvas(img: ImgData): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(img.width, img.height);
  const src = img.data;
  const dst = imageData.data;
  // kind: 1=grayscale, 2=RGB, 3=RGBA (per pdf.js ImageKind)
  if (img.kind === 3 || src.length === img.width * img.height * 4) {
    dst.set(src);
  } else if (img.kind === 2 || src.length === img.width * img.height * 3) {
    for (let i = 0, j = 0; i < src.length; i += 3, j += 4) {
      dst[j] = src[i];
      dst[j + 1] = src[i + 1];
      dst[j + 2] = src[i + 2];
      dst[j + 3] = 255;
    }
  } else {
    // grayscale fallback
    for (let i = 0, j = 0; i < src.length; i++, j += 4) {
      dst[j] = dst[j + 1] = dst[j + 2] = src[i];
      dst[j + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function ExtractImagesPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    setProgress(0);
    try {
      const pdfjs = await loadPdfjs();
      const doc = await pdfjs.getDocument({ data: await files[0].arrayBuffer() }).promise;
      const zip = new JSZip();
      let count = 0;
      const seen = new Set<string>();

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const ops = await page.getOperatorList();
        for (let k = 0; k < ops.fnArray.length; k++) {
          const fn = ops.fnArray[k];
          if (
            fn === pdfjs.OPS.paintImageXObject ||
            fn === pdfjs.OPS.paintInlineImageXObject
          ) {
            const name = ops.argsArray[k][0];
            const key = `${i}:${name}`;
            if (seen.has(key)) continue;
            seen.add(key);
            try {
              const img: ImgData | null = await new Promise((res) => {
                try {
                  page.objs.get(name, (o: ImgData) => res(o));
                } catch {
                  res(null);
                }
              });
              if (!img || !img.width || !img.height) continue;
              const canvas = imgToCanvas(img);
              const blob: Blob = await new Promise((r) =>
                canvas.toBlob((b) => r(b!), "image/png"),
              );
              count++;
              zip.file(
                `page-${String(i).padStart(3, "0")}-img-${String(count).padStart(3, "0")}.png`,
                await blob.arrayBuffer(),
              );
            } catch {
              // skip problematic image
            }
          }
        }
        setProgress(Math.round((i / doc.numPages) * 100));
      }

      if (count === 0) {
        toast.error("No embedded images found");
        return;
      }
      const out = await zip.generateAsync({ type: "blob" });
      downloadBlob(out, files[0].name.replace(/\.pdf$/i, "") + "-images.zip");
      toast.success(`Extracted ${count} images`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to extract images");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Extract Images"
      description="Pull every embedded image out of a PDF, packaged as a ZIP of PNGs."
      icon={<Images className="h-7 w-7 text-primary" />}
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
        Extract & download
      </button>
    </ToolShell>
  );
}
