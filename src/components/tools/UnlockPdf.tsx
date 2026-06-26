import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Unlock, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { toast } from "sonner";

export function UnlockPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    try {
      const src = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, src.getPageIndices());
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "unlocked.pdf");
      toast.success("Restrictions removed");
    } catch (e) {
      console.error(e);
      toast.error("Could not unlock — file may need a user password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Unlock PDF"
      description="Remove owner-level restrictions (printing, copying) from a PDF you own."
      icon={<Unlock className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      <p className="mt-4 text-xs text-muted-foreground">
        Note: Files requiring a user password to open need that password supplied first — that
        flow needs a backend and is on the roadmap.
      </p>
      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Unlock & download
      </button>
    </ToolShell>
  );
}
