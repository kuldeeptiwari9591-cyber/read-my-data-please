import { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { PenLine, Loader2, RotateCcw, Plus, Trash2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { loadPdfjs } from "@/lib/pdfjs";
import { toast } from "sonner";

interface Placement {
  page: number;
  // ratios of page width/height (0..1) from top-left of page
  x: number;
  y: number;
  w: number;
}

export function EsignPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [pageSizes, setPageSizes] = useState<{ w: number; h: number }[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [busy, setBusy] = useState(false);
  const padRef = useRef<HTMLCanvasElement>(null);
  const padInstance = useRef<{ clear: () => void; toDataURL: () => string; isEmpty: () => boolean } | null>(null);

  // Init signature pad — theme-aware background + ink color
  useEffect(() => {
    let mounted = true;
    (async () => {
      const SignaturePad = (await import("signature_pad")).default;
      if (!padRef.current || !mounted) return;
      const c = padRef.current;
      const ratio = window.devicePixelRatio || 1;
      c.width = c.offsetWidth * ratio;
      c.height = c.offsetHeight * ratio;
      const ctx = c.getContext("2d")!;
      ctx.scale(ratio, ratio);
      const isDark = document.documentElement.classList.contains("dark");
      const bg = isDark ? "#13131A" : "#ffffff";
      const ink = isDark ? "#f1f5f9" : "#0f172a";
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, c.width, c.height);
      const pad = new SignaturePad(c, {
        penColor: ink,
        backgroundColor: bg,
        minWidth: 0.8,
        maxWidth: 2.4,
      });
      padInstance.current = pad;
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Render PDF page previews
  useEffect(() => {
    if (files.length === 0) {
      setPreviews([]);
      setPageSizes([]);
      setPlacements([]);
      return;
    }
    let cancel = false;
    (async () => {
      try {
        const pdfjs = await loadPdfjs();
        const buf = await files[0].arrayBuffer();
        const doc = await pdfjs.getDocument({ data: buf }).promise;
        const imgs: string[] = [];
        const sizes: { w: number; h: number }[] = [];
        for (let i = 1; i <= doc.numPages; i++) {
          if (cancel) return;
          const page = await doc.getPage(i);
          const vp = page.getViewport({ scale: 1.2 });
          const canvas = document.createElement("canvas");
          canvas.width = vp.width;
          canvas.height = vp.height;
          await page.render({ canvas, canvasContext: canvas.getContext("2d")!, viewport: vp }).promise;
          imgs.push(canvas.toDataURL("image/jpeg", 0.8));
          const base = page.getViewport({ scale: 1 });
          sizes.push({ w: base.width, h: base.height });
        }
        if (!cancel) {
          setPreviews(imgs);
          setPageSizes(sizes);
          setPlacements([]);
        }
      } catch (e) {
        console.error(e);
        toast.error("Could not preview PDF");
      }
    })();
    return () => {
      cancel = true;
    };
  }, [files]);

  const captureSignature = () => {
    if (!padInstance.current || padInstance.current.isEmpty()) {
      return toast.error("Draw your signature first");
    }
    setSignature(padInstance.current.toDataURL());
    toast.success("Signature captured — click a page to place it");
  };

  const clearPad = () => padInstance.current?.clear();

  const placeOnPage = (pageIdx: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (!signature) return toast.error("Capture a signature first");
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPlacements((p) => [...p, { page: pageIdx, x, y, w: 0.22 }]);
  };

  const removePlacement = (i: number) =>
    setPlacements((p) => p.filter((_, j) => j !== i));

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    if (!signature) return toast.error("Capture a signature first");
    if (placements.length === 0) return toast.error("Click on a page to place your signature");
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const sigBytes = await (await fetch(signature)).arrayBuffer();
      const sigImg = await doc.embedPng(new Uint8Array(sigBytes));
      const ratio = sigImg.height / sigImg.width;
      const pages = doc.getPages();
      for (const p of placements) {
        const page = pages[p.page];
        if (!page) continue;
        const { width, height } = page.getSize();
        const w = width * p.w;
        const h = w * ratio;
        const x = width * p.x - w / 2;
        const y = height - height * p.y - h / 2;
        page.drawImage(sigImg, { x, y, width: w, height: h });
      }
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "signed.pdf");
      toast.success("Signed PDF ready");
    } catch (e) {
      console.error(e);
      toast.error("Signing failed");
    } finally {
      setBusy(false);
    }
  };

  void pageSizes;

  return (
    <ToolShell
      title="eSign PDF"
      description="Draw your signature, click anywhere on a page to drop it, and download the signed PDF."
      icon={<PenLine className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {previews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center text-sm text-muted-foreground">
              Upload a PDF to preview pages here.
            </div>
          ) : (
            <div className="space-y-6">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Page {i + 1}</span>
                    <span>{signature ? "Click to place signature" : "Capture a signature first →"}</span>
                  </div>
                  <div
                    className="relative cursor-crosshair overflow-hidden rounded-xl border border-border bg-background shadow-sm"
                    onClick={(e) => placeOnPage(i, e)}
                  >
                    <img src={src} alt={`Page ${i + 1}`} className="block w-full" />
                    {placements
                      .map((p, idx) => ({ p, idx }))
                      .filter(({ p }) => p.page === i)
                      .map(({ p, idx }) => (
                        <div
                          key={idx}
                          className="absolute -translate-x-1/2 -translate-y-1/2 rounded border-2 border-primary bg-primary/10"
                          style={{
                            left: `${p.x * 100}%`,
                            top: `${p.y * 100}%`,
                            width: `${p.w * 100}%`,
                          }}
                        >
                          {signature && (
                            <img src={signature} alt="" className="block w-full" />
                          )}
                          <button
                            type="button"
                            aria-label="Remove signature placement"
                            onClick={(e) => {
                              e.stopPropagation();
                              removePlacement(idx);
                            }}
                            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface/40 p-4">
            <div className="mb-2 text-sm font-semibold">Your signature</div>
            <canvas
              ref={padRef}
              className="h-40 w-full rounded-md border border-border bg-background"
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={clearPad}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-surface"
              >
                <RotateCcw className="h-3 w-3" /> Clear
              </button>
              <button
                onClick={captureSignature}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                <Plus className="h-3 w-3" /> Use this
              </button>
            </div>
            {signature && (
              <div className="mt-3 rounded-md border border-border bg-background p-2">
                <img src={signature} alt="signature preview" className="block h-12 w-full object-contain" />
              </div>
            )}
          </div>

          <button
            onClick={run}
            disabled={busy || placements.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Apply & download ({placements.length})
          </button>
        </aside>
      </div>
    </ToolShell>
  );
}
