import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { Upload, FileText, X, Check, Sparkles, AlertCircle } from "lucide-react";
import { loadPdfjs } from "@/lib/pdfjs";
import { validateFile, inferExpected } from "@/utils/validateFile";

interface HoloUploadZoneProps {
  multiple?: boolean;
  accept?: string;
  files: File[];
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
  children?: ReactNode;
}

/**
 * Physics drag-drop upload zone (Animation 1).
 * - Idle pulse glow, hover tint, drag-over spring scale + indigo particles
 * - Drop success ripple + green flash + bouncing check
 * - File chip in JetBrains Mono with PDF page count
 */
export function HoloUploadZone({
  multiple = false,
  accept = "application/pdf,.pdf",
  files,
  onFiles,
  label = "Drop your PDF here, or click to browse",
  hint,
}: HoloUploadZoneProps) {
  const reduce = useReducedMotion();
  const [drag, setDrag] = useState(false);
  const [dropPoint, setDropPoint] = useState<{ x: number; y: number } | null>(null);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scale = useSpring(1, { stiffness: 300, damping: 20 });
  useEffect(() => {
    scale.set(drag ? 1.03 : 1);
  }, [drag, scale]);

  // Pulse glow loop (transform/opacity only)
  const pulseAnim = reduce
    ? undefined
    : { scale: [1, 1.02, 1], opacity: [0.85, 1, 0.85] };

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list) return;
      const arr = Array.from(list).filter((f) =>
        accept.split(",").some((a) => {
          const ax = a.trim().toLowerCase();
          if (ax.startsWith(".")) return f.name.toLowerCase().endsWith(ax);
          return (
            f.type === ax ||
            (ax.endsWith("/*") && f.type.startsWith(ax.slice(0, -1)))
          );
        }),
      );
      if (arr.length === 0) return;
      onFiles(multiple ? [...files, ...arr] : arr.slice(0, 1));
      setFlash(true);
      window.setTimeout(() => setFlash(false), 400);
    },
    [accept, files, multiple, onFiles],
  );

  return (
    <div>
      <motion.div
        style={{ scale, willChange: "transform" }}
        className="relative"
      >
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            const r = e.currentTarget.getBoundingClientRect();
            setDropPoint({
              x: ((e.clientX - r.left) / r.width) * 100,
              y: ((e.clientY - r.top) / r.height) * 100,
            });
            setDrag(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 transition-colors ${
            flash
              ? "border-success bg-success/5"
              : drag
                ? "border-primary bg-primary/[0.05]"
                : "border-dashed border-primary/40 bg-surface/40"
          }`}
        >
          {/* Idle pulse glow */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              animate={pulseAnim}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 50%, rgba(99,102,241,0.10), transparent 70%)",
                willChange: "transform, opacity",
              }}
            />
          )}

          {/* Drag particles */}
          <AnimatePresence>
            {drag && !reduce && (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.span
                    key={i}
                    aria-hidden
                    className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-primary"
                    initial={{ opacity: 0, y: 20, x: 0 }}
                    animate={{ opacity: [0, 1, 0], y: -60, x: (i - 3) * 8 }}
                    transition={{
                      duration: 1.6,
                      delay: i * 0.08,
                      repeat: Infinity,
                    }}
                    style={{
                      left: `${20 + i * 12}%`,
                      bottom: 20,
                      willChange: "transform, opacity",
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Drop ripple */}
          <AnimatePresence>
            {dropPoint && (
              <motion.span
                key={`${dropPoint.x}-${dropPoint.y}`}
                aria-hidden
                className="pointer-events-none absolute h-24 w-24 rounded-full bg-success/40"
                style={{
                  left: `${dropPoint.x}%`,
                  top: `${dropPoint.y}%`,
                  translateX: "-50%",
                  translateY: "-50%",
                  willChange: "transform, opacity",
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onAnimationComplete={() => setDropPoint(null)}
              />
            )}
          </AnimatePresence>

          <div className="relative flex flex-col items-center justify-center px-8 py-14 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-secondary/25 ring-1 ring-primary/40">
              <AnimatePresence mode="wait">
                {flash ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <Check className="h-7 w-7 text-success" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="up"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Upload className="h-7 w-7 text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
              <Sparkles className="absolute -right-1.5 -top-1.5 h-4 w-4 text-secondary" />
            </div>

            <p className="mt-5 font-display text-lg font-semibold">
              {drag ? "Drop it here!" : label}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {hint ??
                (multiple
                  ? "Add multiple PDFs — drag-and-drop or click"
                  : "PDF up to ~100 MB · stays on your device")}
            </p>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>
      </motion.div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f, i) => (
            <FileChip
              key={`${f.name}-${i}`}
              file={f}
              onRemove={() => onFiles(files.filter((_, j) => j !== i))}
              onChange={() => inputRef.current?.click()}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function FileChip({
  file,
  onRemove,
  onChange,
}: {
  file: File;
  onRemove: () => void;
  onChange: () => void;
}) {
  const [pageCount, setPageCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!/pdf$/i.test(file.type) && !/\.pdf$/i.test(file.name)) return;
    (async () => {
      try {
        const pdfjs = await loadPdfjs();
        const buf = await file.arrayBuffer();
        const doc = await pdfjs.getDocument({ data: buf }).promise;
        if (!cancelled) setPageCount(doc.numPages);
        void doc.cleanup();
      } catch {
        /* ignore — non-PDF or encrypted */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-8 w-7 shrink-0 items-center justify-center rounded bg-primary/10">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-mono text-xs">{file.name}</p>
          <p className="font-mono text-[10px] text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
            {pageCount != null && ` · ${pageCount} page${pageCount === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChange();
          }}
          className="rounded px-2 py-1 text-[11px] text-primary hover:underline"
        >
          Change
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label="Remove"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.li>
  );
}
