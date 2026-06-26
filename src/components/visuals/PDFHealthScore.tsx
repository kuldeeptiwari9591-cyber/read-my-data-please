import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, FileText, Sparkles } from "lucide-react";
import { loadPdfjs } from "@/lib/pdfjs";
import type { AnalyzerResult } from "@/lib/pdf-analyzer.worker";

interface Props {
  file: File;
}

interface FullAnalysis extends AnalyzerResult {
  pageCount: number;
  hasSelectableText: boolean;
  estimatedReadingMinutes: number;
}

function score(a: FullAnalysis): number {
  let s = 0;
  const sizePerPage = a.pageCount > 0 ? a.fileSize / a.pageCount : a.fileSize;
  if (sizePerPage < 250 * 1024) s += 20;
  else if (sizePerPage < 500 * 1024) s += 12;
  if (a.hasSelectableText) s += 20;
  if (a.hasEmbeddedFonts) s += 15;
  if (!a.isEncrypted) s += 10;
  if (a.pdfVersion && parseFloat(a.pdfVersion) >= 1.7) s += 10;
  if (a.pageCount > 0 && a.pageCount <= 500) s += 10;
  if (a.hasMetadata) s += 15;
  return Math.max(0, Math.min(100, s));
}

function gradeOf(s: number): { label: string; color: string } {
  if (s >= 80) return { label: "Excellent", color: "#22c55e" };
  if (s >= 50) return { label: "Good", color: "#f59e0b" };
  return { label: "Needs attention", color: "#ef4444" };
}

function suggestions(a: FullAnalysis): Array<{ to: string; label: string }> {
  const out: Array<{ to: string; label: string }> = [];
  if (!a.hasSelectableText)
    out.push({ to: "/ocr-pdf", label: "Use OCR to make this PDF searchable" });
  if (a.fileSize > 2 * 1024 * 1024)
    out.push({ to: "/compress-pdf", label: "Compress this PDF to reduce size" });
  if (!a.isEncrypted)
    out.push({ to: "/protect-pdf", label: "Protect this PDF with a password" });
  if (a.estimatedImageCount > 5 && a.fileSize > 1024 * 1024)
    out.push({ to: "/compress-pdf", label: "Image-heavy PDF — compress to slim it down" });
  return out.slice(0, 3);
}

function useCountUp(target: number, dur = 1500) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? target : 0);
  useEffect(() => {
    if (reduce) {
      setV(target);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      setV(Math.round(target * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, dur, reduce]);
  return v;
}

/**
 * PDF Health Score (Animation 8). Off-main-thread byte analysis in a Web
 * Worker, plus async pdf.js text/page check on main thread.
 */
export function PDFHealthScore({ file }: Props) {
  const [open, setOpen] = useState(true);
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setAnalysis(null);
    setError(null);
    if (!/pdf$/i.test(file.type) && !/\.pdf$/i.test(file.name)) {
      setError("Only PDFs can be scored");
      return;
    }

    const run = async () => {
      try {
        const buf = await file.arrayBuffer();

        // 1) Worker: lightweight byte-level analysis
        const worker = new Worker(
          new URL("@/lib/pdf-analyzer.worker.ts", import.meta.url),
          { type: "module" },
        );
        const workerResult = await new Promise<AnalyzerResult>((resolve, reject) => {
          worker.onmessage = (e: MessageEvent<AnalyzerResult>) => resolve(e.data);
          worker.onerror = (e) => reject(e);
          worker.postMessage(
            { buffer: buf.slice(0), fileSize: file.size },
            [buf.slice(0)],
          );
        }).finally(() => worker.terminate());

        if (cancelled) return;

        // 2) Main thread pdfjs: page count + selectable-text test
        let pageCount = 0;
        let hasSelectableText = false;
        let chars = 0;
        try {
          const pdfjs = await loadPdfjs();
          const doc = await pdfjs.getDocument({ data: buf }).promise;
          pageCount = doc.numPages;
          const probePages = Math.min(3, pageCount);
          for (let p = 1; p <= probePages; p++) {
            const page = await doc.getPage(p);
            const tc = await page.getTextContent();
            for (const item of tc.items as Array<{ str: string }>) {
              chars += item.str.length;
              if (chars > 80) break;
            }
            if (chars > 80) break;
          }
          hasSelectableText = chars > 80;
          void doc.cleanup();
        } catch {
          // Encrypted or unreadable — treat as no selectable text
        }

        if (cancelled) return;

        const wpm = 220;
        const wordsEstimate = pageCount * 350 * (hasSelectableText ? 1 : 0);
        const estimatedReadingMinutes = Math.max(
          1,
          Math.round(wordsEstimate / wpm),
        );

        setAnalysis({
          ...workerResult,
          pageCount,
          hasSelectableText,
          estimatedReadingMinutes,
        });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Analysis failed");
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <div className="mt-4 rounded-2xl border border-border/60 bg-surface/40 backdrop-blur-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-primary" />
          PDF Health Score
          {!analysis && !error && (
            <span className="font-mono text-[10px] text-muted-foreground">
              analyzing…
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "" : "-rotate-90"
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4"
          >
            {error && (
              <p className="text-xs text-muted-foreground">Couldn't analyze: {error}</p>
            )}
            {analysis && <Body a={analysis} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Body({ a }: { a: FullAnalysis }) {
  const total = score(a);
  const grade = gradeOf(total);
  const animated = useCountUp(total);
  const circumference = 2 * Math.PI * 44;
  const dash = (animated / 100) * circumference;
  const sugg = suggestions(a);

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <div className="relative h-28 w-28 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="8" />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={grade.color}
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${dash} ${circumference}` }}
            transition={{ duration: 0.05 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold tabular-nums">
            {animated}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {grade.label}
          </span>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap gap-1.5">
          <Tag>{a.pageCount} pages</Tag>
          <Tag>{(a.fileSize / 1024 / 1024).toFixed(2)} MB</Tag>
          <Tag>{a.hasSelectableText ? "Text-based" : "Scanned"}</Tag>
          {a.pdfVersion && <Tag>PDF {a.pdfVersion}</Tag>}
          {a.estimatedImageCount > 0 && <Tag>{a.estimatedImageCount} images</Tag>}
          {a.isEncrypted && <Tag tone="warn">Encrypted</Tag>}
          {a.hasEmbeddedFonts && <Tag>Embedded fonts</Tag>}
          {a.hasMetadata && <Tag>Has metadata</Tag>}
          {a.hasSelectableText && (
            <Tag>~{a.estimatedReadingMinutes} min read</Tag>
          )}
        </div>

        {sugg.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {sugg.map((s) => (
              <Link
                key={s.to}
                to={s.to as never}
                className="flex items-center gap-2 text-xs text-primary hover:underline"
              >
                <FileText className="h-3.5 w-3.5" />
                {s.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Tag({ children, tone }: { children: React.ReactNode; tone?: "warn" }) {
  const cls =
    tone === "warn"
      ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
      : "border-border/60 bg-background/60 text-muted-foreground";
  return (
    <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${cls}`}>
      {children}
    </span>
  );
}
