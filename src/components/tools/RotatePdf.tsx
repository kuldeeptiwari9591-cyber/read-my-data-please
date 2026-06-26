import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { RotateCw, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob, parseRanges } from "./ToolShell";
import { toast } from "sonner";

export function RotatePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [scope, setScope] = useState<"all" | "range">("all");
  const [ranges, setRanges] = useState("1");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const total = doc.getPageCount();
      const targets =
        scope === "all"
          ? Array.from({ length: total }, (_, i) => i)
          : parseRanges(ranges, total).map((p) => p - 1);

      targets.forEach((i) => {
        const page = doc.getPage(i);
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + angle) % 360));
      });
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "rotated.pdf");
      toast.success("Rotated PDF downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Failed to rotate PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Rotate PDF"
      description="Rotate pages 90°, 180°, or 270° — all pages or a custom range."
      icon={<RotateCw className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      {files.length > 0 && (
        <div className="mt-6 space-y-5">
          <div>
            <div className="text-sm text-muted-foreground">Rotation</div>
            <div className="mt-2 flex gap-2">
              {([90, 180, 270] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAngle(a)}
                  className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                    angle === a
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-surface text-muted-foreground hover:border-primary/60"
                  }`}
                >
                  {a}°
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Apply to</div>
            <div className="mt-2 flex gap-2">
              {(["all", "range"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setScope(s)}
                  className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                    scope === s
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-surface text-muted-foreground hover:border-primary/60"
                  }`}
                >
                  {s === "all" ? "All pages" : "Custom range"}
                </button>
              ))}
            </div>
            {scope === "range" && (
              <input
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                placeholder="1-3,5"
                className="mt-3 w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
              />
            )}
          </div>
        </div>
      )}

      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Rotate & download
      </button>
    </ToolShell>
  );
}
