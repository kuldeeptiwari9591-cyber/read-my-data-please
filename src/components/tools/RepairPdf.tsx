import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Wrench, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { toast } from "sonner";

export function RepairPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    try {
      const buf = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(buf, {
        ignoreEncryption: true,
        throwOnInvalidObject: false,
        updateMetadata: false,
      });
      const out = await PDFDocument.create();
      const copied = await out.copyPages(doc, doc.getPageIndices());
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save({ useObjectStreams: true });
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "repaired.pdf");
      toast.success(`Recovered ${copied.length} pages`);
    } catch (e) {
      console.error(e);
      toast.error("This PDF is too damaged to recover in-browser");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Repair PDF"
      description="Recover pages from a damaged or partially corrupted PDF."
      icon={<Wrench className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Repair & download
      </button>
    </ToolShell>
  );
}
