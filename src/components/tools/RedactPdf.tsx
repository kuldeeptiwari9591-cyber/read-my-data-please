import { useEffect, useRef, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { EyeOff, Loader2, Trash2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { loadPdfjs } from "@/lib/pdfjs";
import { toast } from "sonner";

interface Rect {
  page: number;
  x: number; // ratio 0..1 top-left
  y: number;
  w: number;
  h: number;
}

export function RedactPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [rects, setRects] = useState<Rect[]>([]);
  const [busy, setBusy] = useState(false);
  const dragging = useRef<{ page: number; startX: number; startY: number; rect: DOMRect } | null>(null);
  const [draft, setDraft] = useState<Rect | null>(null);

  useEffect(() => {
    if (files.length === 0) {
      setPreviews([]);
      setRects([]);
      return;
    }
    let cancel = false;
    (async () => {
      try {
        const pdfjs = await loadPdfjs();
        const buf = await files[0].arrayBuffer();
        const doc = await pdfjs.getDocument({ data: buf }).promise;
        const imgs: string[] = [];
        for (let i = 1; i <= doc.numPages; i++) {
          if (cancel) return;
          const page = await doc.getPage(i);
          const vp = page.getViewport({ scale: 1.2 });
          const c = document.createElement("canvas");
          c.width = vp.width;
          c.height = vp.height;
          await page.render({ canvas: c, canvasContext: c.getContext("2d")!, viewport: vp }).promise;
          imgs.push(c.toDataURL("image/jpeg", 0.8));
        }
        if (!cancel) {
          setPreviews(imgs);
          setRects([]);
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

  const onDown = (pageIdx: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dragging.current = {
      page: pageIdx,
      startX: (e.clientX - rect.left) / rect.width,
      startY: (e.clientY - rect.top) / rect.height,
      rect,
    };
    setDraft({ page: pageIdx, x: 0, y: 0, w: 0, h: 0 });
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const d = dragging.current;
    if (!d) return;
    const cx = (e.clientX - d.rect.left) / d.rect.width;
    const cy = (e.clientY - d.rect.top) / d.rect.height;
    setDraft({
      page: d.page,
      x: Math.min(d.startX, cx),
      y: Math.min(d.startY, cy),
      w: Math.abs(cx - d.startX),
      h: Math.abs(cy - d.startY),
    });
  };

  const onUp = () => {
    const d = draft;
    dragging.current = null;
    setDraft(null);
    if (d && d.w > 0.005 && d.h > 0.005) {
      setRects((rs) => [...rs, d]);
    }
  };

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    if (rects.length === 0) return toast.error("Drag to draw at least one redaction box");
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const pages = doc.getPages();
      for (const r of rects) {
        const page = pages[r.page];
        if (!page) continue;
        const { width, height } = page.getSize();
        const x = r.x * width;
        const w = r.w * width;
        const h = r.h * height;
        const y = height - (r.y + r.h) * height;
        page.drawRectangle({ x, y, width: w, height: h, color: rgb(0, 0, 0) });
      }
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "redacted.pdf");
      toast.success("Redacted PDF ready");
    } catch (e) {
      console.error(e);
      toast.error("Redaction failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Redact PDF"
      description="Drag boxes over anything you want hidden. We paint solid black rectangles over those regions."
      icon={<EyeOff className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      {previews.length > 0 && (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_240px]">
          <div className="space-y-6">
            {previews.map((src, i) => (
              <div key={i}>
                <div className="mb-2 text-xs text-muted-foreground">Page {i + 1} — drag to redact</div>
                <div
                  className="relative cursor-crosshair overflow-hidden rounded-xl border border-border bg-background shadow-sm select-none"
                  onMouseDown={onDown(i)}
                  onMouseMove={onMove}
                  onMouseUp={onUp}
                  onMouseLeave={onUp}
                >
                  <img src={src} alt={`Page ${i + 1}`} draggable={false} className="block w-full" />
                  {rects
                    .map((r, idx) => ({ r, idx }))
                    .filter(({ r }) => r.page === i)
                    .map(({ r, idx }) => (
                      <div
                        key={idx}
                        className="absolute bg-black"
                        style={{
                          left: `${r.x * 100}%`,
                          top: `${r.y * 100}%`,
                          width: `${r.w * 100}%`,
                          height: `${r.h * 100}%`,
                        }}
                      />
                    ))}
                  {draft && draft.page === i && (
                    <div
                      className="absolute border-2 border-primary bg-primary/20"
                      style={{
                        left: `${draft.x * 100}%`,
                        top: `${draft.y * 100}%`,
                        width: `${draft.w * 100}%`,
                        height: `${draft.h * 100}%`,
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-surface/40 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold">Redactions</span>
                <span className="text-xs text-muted-foreground">{rects.length}</span>
              </div>
              {rects.length === 0 ? (
                <p className="text-xs text-muted-foreground">No regions yet. Drag on a page to add one.</p>
              ) : (
                <ul className="space-y-1.5">
                  {rects.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded-md bg-background px-2 py-1.5 text-xs"
                    >
                      <span>Page {r.page + 1}</span>
                      <button
                        onClick={() => setRects((rs) => rs.filter((_, j) => j !== i))}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={run}
                disabled={busy || rects.length === 0}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Apply & download
              </button>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Boxes are drawn permanently into the page stream. For ultra-sensitive content, also flatten the result.
              </p>
            </div>
          </aside>
        </div>
      )}
    </ToolShell>
  );
}
