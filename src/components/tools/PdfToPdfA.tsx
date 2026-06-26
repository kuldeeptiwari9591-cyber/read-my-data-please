import { useState } from "react";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";
import { ShieldCheck, Loader2 } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob } from "./ToolShell";
import { toast } from "sonner";

export function PdfToPdfA() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    setBusy(true);
    try {
      const file = files[0];
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });

      // Ensure required metadata fields for archival.
      const now = new Date();
      doc.setCreationDate(doc.getCreationDate() ?? now);
      doc.setModificationDate(now);
      doc.setProducer("CrispPDF — PDF/A-2B Profile");
      if (!doc.getTitle()) doc.setTitle(file.name.replace(/\.pdf$/i, ""));

      // Inject a minimal XMP metadata stream that declares PDF/A-2B conformance.
      const xmp = `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/"
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:xmp="http://ns.adobe.com/xap/1.0/">
      <pdfaid:part>2</pdfaid:part>
      <pdfaid:conformance>B</pdfaid:conformance>
      <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${(doc.getTitle() ?? "Document").replace(/[<>&]/g, "")}</rdf:li></rdf:Alt></dc:title>
      <xmp:CreatorTool>CrispPDF</xmp:CreatorTool>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

      const metaStream = doc.context.stream(xmp, {
        Type: "Metadata",
        Subtype: "XML",
      });
      const metaRef = doc.context.register(metaStream);
      doc.catalog.set(PDFName.of("Metadata"), metaRef);

      // Mark document language (PDF/A best-practice).
      doc.catalog.set(PDFName.of("Lang"), PDFString.of("en-US"));

      const bytes = await doc.save({ useObjectStreams: false });
      downloadBlob(
        new Blob([bytes as BlobPart], { type: "application/pdf" }),
        file.name.replace(/\.pdf$/i, "") + "-pdfa.pdf",
      );
      toast.success("PDF/A-2B profile applied");
    } catch (e) {
      console.error(e);
      toast.error("Conversion failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="PDF to PDF/A"
      description="Add the PDF/A-2B archival profile, XMP metadata, and language tagging to your PDF."
      icon={<ShieldCheck className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      <p className="mt-4 text-xs text-muted-foreground">
        Note: this applies the PDF/A-2B identification & metadata profile. Full ISO 19005-2
        validation (font embedding audit, color-profile checks) requires a backend validator
        and is on the roadmap.
      </p>
      <button
        onClick={run}
        disabled={busy || files.length === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Convert & download
      </button>
    </ToolShell>
  );
}
