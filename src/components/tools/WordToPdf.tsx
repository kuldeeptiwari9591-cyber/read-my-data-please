import { useState } from "react";
import { FileType, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob, ProgressBar } from "./ToolShell";
import { toast } from "sonner";

export function WordToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a Word document");
    setBusy(true);
    setProgress(0.1);
    try {
      const file = files[0];
      const buf = await file.arrayBuffer();
      const mammoth = await import("mammoth");
      const jsPDFMod = await import("jspdf");
      const jsPDF = jsPDFMod.default || jsPDFMod.jsPDF;

      setProgress(0.3);
      const { value: text } = await mammoth.extractRawText({ arrayBuffer: buf });
      setProgress(0.7);

      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 56;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const maxWidth = pageWidth - margin * 2;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);

      const paragraphs = text.split(/\n+/);
      let y = margin;
      for (const para of paragraphs) {
        const lines = pdf.splitTextToSize(para, maxWidth);
        for (const line of lines) {
          if (y > pageHeight - margin) {
            pdf.addPage();
            y = margin;
          }
          pdf.text(line, margin, y);
          y += 16;
        }
        y += 8;
      }

      const blob = pdf.output("blob");
      setProgress(1);
      downloadBlob(blob, file.name.replace(/\.(docx?|DOCX?)$/, "") + ".pdf");
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
      title="Word to PDF"
      description="Convert .docx files to a clean PDF. Text-faithful (no complex layout)."
      icon={<FileType className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} accept=".doc,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" label="Drop your .docx here, or click to browse" />
      {busy && <ProgressBar progress={progress} label="Converting" />}
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
