import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ArrowUpDown, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { toast } from "sonner";

export function ReorderPdfPages() {
  const [files, setFiles] = useState<File[]>([]);
  const [order, setOrder] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (files.length === 0) {
        setOrder([]);
        return;
      }
      try {
        const src = await PDFDocument.load(await files[0].arrayBuffer(), {
          ignoreEncryption: true,
        });
        if (cancelled) return;
        setOrder(Array.from({ length: src.getPageCount() }, (_, i) => i));
      } catch {
        toast.error("Could not read PDF");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [files]);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  };

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    try {
      const src = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, order);
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "reordered.pdf");
      toast.success("Reordered PDF downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Failed to reorder");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Reorder Pages"
      description="Rearrange pages with up/down controls and save the new order."
      icon={<ArrowUpDown className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      {order.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {order.map((pageIdx, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm"
            >
              <span>
                <span className="mr-1 font-mono text-xs text-muted-foreground">{i + 1}.</span>
                Page {pageIdx + 1}
              </span>
              <div className="flex gap-0.5">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === order.length - 1}
                  className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Save new order
      </button>
    </ToolShell>
  );
}
