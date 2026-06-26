import { useState } from "react";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob, ProgressBar } from "./ToolShell";
import { toast } from "sonner";

export function ExcelToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const run = async () => {
    if (files.length === 0) return toast.error("Add an Excel file");
    setBusy(true);
    setProgress(0.1);
    try {
      const file = files[0];
      const buf = await file.arrayBuffer();
      const XLSX = await import("xlsx");
      const jsPDFMod = await import("jspdf");
      const jsPDF = jsPDFMod.default || jsPDFMod.jsPDF;
      const autoTable = (await import("jspdf-autotable")).default;

      const wb = XLSX.read(buf, { type: "array" });
      const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });

      wb.SheetNames.forEach((name, idx) => {
        if (idx > 0) pdf.addPage();
        pdf.setFontSize(14);
        pdf.text(name, 40, 36);
        const sheet = wb.Sheets[name];
        const aoa = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, blankrows: false });
        if (aoa.length === 0) return;
        const [head, ...body] = aoa;
        autoTable(pdf, {
          head: [head.map((c) => String(c ?? ""))],
          body: body.map((r) => r.map((c) => String(c ?? ""))),
          startY: 50,
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [99, 102, 241] },
        });
        setProgress((idx + 1) / wb.SheetNames.length);
      });

      const blob = pdf.output("blob");
      downloadBlob(blob, file.name.replace(/\.(xlsx?|XLSX?)$/, "") + ".pdf");
      toast.success("PDF ready");
    } catch (e) {
      console.error(e);
      toast.error("Conversion failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Excel to PDF"
      description="Render every sheet of an .xlsx file as a landscape PDF table."
      icon={<FileSpreadsheet className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" label="Drop your .xlsx here, or click to browse" />
      {busy && <ProgressBar progress={progress} label="Rendering tables" />}
      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Convert & download PDF
      </button>
    </ToolShell>
  );
}
