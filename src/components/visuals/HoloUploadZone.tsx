import { useCallback, useRef, useState, type ReactNode } from "react";
import { Upload, FileText, X, Sparkles } from "lucide-react";

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
 * Holographic drop zone — conic gradient border, sweeping shimmer,
 * pointer-following spotlight. Pure CSS/JS, no WebGL.
 */
export function HoloUploadZone({
  multiple = false,
  accept = "application/pdf,.pdf",
  files,
  onFiles,
  label = "Drop your PDF here, or click to browse",
  hint,
}: HoloUploadZoneProps) {
  const [drag, setDrag] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list) return;
      const arr = Array.from(list).filter((f) =>
        accept.split(",").some((a) => {
          const ax = a.trim().toLowerCase();
          if (ax.startsWith(".")) return f.name.toLowerCase().endsWith(ax);
          return f.type === ax || (ax.endsWith("/*") && f.type.startsWith(ax.slice(0, -1)));
        }),
      );
      if (arr.length === 0) return;
      onFiles(multiple ? [...files, ...arr] : arr.slice(0, 1));
    },
    [accept, files, multiple, onFiles],
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setPos({
            x: ((e.clientX - r.left) / r.width) * 100,
            y: ((e.clientY - r.top) / r.height) * 100,
          });
        }}
        onClick={() => inputRef.current?.click()}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl p-[1.5px] transition-all ${
          drag ? "scale-[1.01]" : ""
        }`}
        style={{
          background: drag
            ? "conic-gradient(from 0deg, #6366F1, #8B5CF6, #06B6D4, #6366F1)"
            : "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4), rgba(99,102,241,0.1))",
        }}
      >
        <div
          className="relative flex flex-col items-center justify-center rounded-[14px] bg-surface/80 px-8 py-14 text-center backdrop-blur-xl"
          style={{
            backgroundImage: `radial-gradient(380px circle at ${pos.x}% ${pos.y}%, rgba(99,102,241,0.18), transparent 60%)`,
          }}
        >
          {/* shimmer sweep */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 ring-1 ring-primary/40 shadow-[0_0_40px_rgba(99,102,241,0.35)]">
            <Upload className="h-7 w-7 text-primary" />
            <Sparkles className="absolute -right-1.5 -top-1.5 h-4 w-4 text-secondary animate-pulse" />
          </div>
          <p className="mt-5 font-display text-lg font-semibold">{label}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {hint ?? (multiple ? "Add multiple PDFs — drag-and-drop or click" : "PDF up to ~100 MB · stays on your device")}
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

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2 truncate">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{f.name}</span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {(f.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFiles(files.filter((_, j) => j !== i));
                }}
                className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
