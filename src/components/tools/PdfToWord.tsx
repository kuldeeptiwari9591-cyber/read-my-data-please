import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob, ProgressBar } from "./ToolShell";
import { loadPdfjs } from "@/lib/pdfjs";
import { toast } from "sonner";

export function PdfToWord() {
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
      const { Document, Packer, Paragraph, TextRun, PageBreak, HeadingLevel } = await import("docx");
      const src = await pdfjs.getDocument({ data: buf.slice(0) }).promise;

      const children: InstanceType<typeof Paragraph>[] = [];
      for (let i = 1; i <= src.numPages; i++) {
        const page = await src.getPage(i);
        const content = await page.getTextContent();
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: `Page ${i}`, bold: true })],
          }),
        );
        let line = "";
        let lastY: number | null = null;
        for (const item of content.items as Array<{ str: string; transform: number[] }>) {
          const y = item.transform[5];
          if (lastY !== null && Math.abs(y - lastY) > 4) {
            if (line.trim()) children.push(new Paragraph({ children: [new TextRun(line.trim())] }));
            line = "";
          }
          line += item.str + " ";
          lastY = y;
        }
        if (line.trim()) children.push(new Paragraph({ children: [new TextRun(line.trim())] }));
        if (i < src.numPages) {
          children.push(new Paragraph({ children: [new PageBreak()] }));
        }
        setProgress(i / src.numPages);
      }

      const doc = new Document({ sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
      downloadBlob(blob, file.name.replace(/\.pdf$/i, "") + ".docx");
      toast.success("Word document ready");
    } catch (e) {
      console.error(e);
      toast.error("Conversion failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="PDF to Word"
      description="Extract text from a PDF into an editable .docx file. Layout is simplified."
      icon={<FileText className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      {busy && <ProgressBar progress={progress} label="Extracting text" />}
      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Convert & download .docx
      </button>
    </ToolShell>
  );
}
