import { useState } from "react";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob, ProgressBar } from "./ToolShell";
import { loadPdfjs } from "@/lib/pdfjs";
import { toast } from "sonner";

export function PdfToExcel() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    setProgress(0);
    try {
      const file = files[0];
      const buf = await file.arrayBuffer();
      const pdfjs = await loadPdfjs();
      const XLSX = await import("@e965/xlsx");
      const src = await pdfjs.getDocument({ data: buf.slice(0) }).promise;
      const wb = XLSX.utils.book_new();

      for (let i = 1; i <= src.numPages; i++) {
        const page = await src.getPage(i);
        const content = await page.getTextContent();
        type Item = { str: string; x: number; y: number };
        const items: Item[] = (content.items as Array<{ str: string; transform: number[] }>).map(
          (it) => ({ str: it.str, x: it.transform[4], y: it.transform[5] }),
        );

        // Group items into rows by similar Y, then sort each row by X.
        const rows: Item[][] = [];
        const sorted = [...items].sort((a, b) => b.y - a.y);
        for (const it of sorted) {
          const row = rows.find((r) => Math.abs(r[0].y - it.y) < 4);
          if (row) row.push(it);
          else rows.push([it]);
        }
        const aoa = rows.map((r) =>
          r.sort((a, b) => a.x - b.x).map((c) => c.str.trim()).filter(Boolean),
        );

        const ws = XLSX.utils.aoa_to_sheet(aoa);
        XLSX.utils.book_append_sheet(wb, ws, `Page ${i}`.slice(0, 31));
        setProgress(i / src.numPages);
      }

      const out = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const blob = new Blob([out], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      downloadBlob(blob, file.name.replace(/\.pdf$/i, "") + ".xlsx");
      toast.success("Excel ready");
    } catch (e) {
      console.error(e);
      toast.error("Conversion failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="PDF to Excel"
      description="Pull tabular content out of a PDF into a multi-sheet .xlsx (one sheet per page)."
      icon={<FileSpreadsheet className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      {busy && <ProgressBar progress={progress} label="Extracting tables" />}
      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Convert & download .xlsx
      </button>
    </ToolShell>
  );
}
