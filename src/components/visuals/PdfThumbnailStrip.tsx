import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { loadPdfjs } from "@/lib/pdfjs";

interface Thumb {
  src: string;
  page: number;
  fileIdx: number;
  fileName: string;
}

interface Props {
  files: File[];
  /** 1-indexed page numbers (across the first file) to highlight in indigo */
  highlightPages?: number[];
  maxPerFile?: number;
}

export function PdfThumbnailStrip({ files, highlightPages, maxPerFile = 5 }: Props) {
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [loading, setLoading] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (files.length === 0) {
      setThumbs([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setThumbs([]);

    (async () => {
      try {
        const pdfjs = await loadPdfjs();
        const out: Thumb[] = [];
        for (let fi = 0; fi < files.length; fi++) {
          const f = files[fi];
          if (!/pdf$/i.test(f.type) && !/\.pdf$/i.test(f.name)) continue;
          const buf = await f.arrayBuffer();
          const doc = await pdfjs.getDocument({ data: buf }).promise;
          const limit = Math.min(maxPerFile, doc.numPages);
          for (let p = 1; p <= limit; p++) {
            if (cancelled) return;
            const page = await doc.getPage(p);
            const viewport = page.getViewport({ scale: 0.25 });
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext("2d")!;
            await page.render({ canvasContext: ctx, viewport, canvas }).promise;
            out.push({
              src: canvas.toDataURL("image/jpeg", 0.75),
              page: p,
              fileIdx: fi,
              fileName: f.name,
            });
            if (!cancelled) setThumbs([...out]);
          }
          doc.destroy();
        }
      } catch (e) {
        console.warn("thumbnail render failed", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [files, maxPerFile]);

  if (files.length === 0) return null;

  return (
    <div className="mt-4 rounded-2xl border border-border/60 bg-surface/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Preview
        </p>
        {loading && (
          <span className="text-[10px] text-muted-foreground/70">rendering…</span>
        )}
      </div>

      {thumbs.length === 0 && loading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-[140px] w-[100px] shrink-0 animate-pulse rounded-md bg-gradient-to-br from-primary/15 to-secondary/10"
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {thumbs.map((t, i) => {
            const highlighted =
              t.fileIdx === 0 && highlightPages?.includes(t.page);
            return (
              <motion.div
                key={`${t.fileIdx}-${t.page}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: reduce ? 0 : i * 0.05 }}
                className={`shrink-0 overflow-hidden rounded-md border bg-background ${
                  highlighted
                    ? "border-primary shadow-[0_0_18px_rgba(99,102,241,0.5)]"
                    : "border-border/70"
                }`}
                style={{ willChange: "transform, opacity" }}
              >
                <img
                  src={t.src}
                  alt={`Page ${t.page}`}
                  className="block h-[140px] w-[100px] object-contain"
                  loading="lazy"
                />
                <div className="border-t border-border/50 px-2 py-1 text-center font-mono text-[10px] text-muted-foreground">
                  p.{t.page}
                  {files.length > 1 && (
                    <span className="ml-1 text-muted-foreground/60">
                      · {t.fileIdx + 1}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
