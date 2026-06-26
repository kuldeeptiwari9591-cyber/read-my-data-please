import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Layers, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { toast } from "sonner";

export function FlattenPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const form = doc.getForm();
      try {
        form.flatten();
      } catch {
        // no form fields — that's fine
      }
      const bytes = await doc.save({ useObjectStreams: true });
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "flattened.pdf");
      toast.success("Form fields baked into pages");
    } catch (e) {
      console.error(e);
      toast.error("Failed to flatten PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Flatten PDF"
      description="Bake form fields, signatures, and annotations into the page so they can't be edited."
      icon={<Layers className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Flatten & download
      </button>
    </ToolShell>
  );
}
