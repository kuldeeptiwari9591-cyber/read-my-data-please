// 10 additional client-side PDF tools. Kept in one module so the lazy registry
// shares one chunk across them.
import { useState } from "react";
import { PDFDocument, PageSizes, rgb } from "pdf-lib";
import {
  FlipHorizontal,
  Maximize2,
  LayoutGrid,
  FilePlus2,
  CopyPlus,
  FileText as FileTextIcon,
  Tags,
  GitCompare,
  Binary,
  ArrowDownUp,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { FileDrop, ToolShell, downloadBlob, parseRanges } from "./ToolShell";
import { getPdfjs } from "@/lib/pdfjs";

/* ============ 1. Invert Colors PDF ============ */
export function InvertColorsPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const run = async () => {
    if (!files[0]) return toast.error("Add a PDF first");
    setBusy(true);
    setProgress(0);
    try {
      const pdfjsLib = await getPdfjs();
      const buf = await files[0].arrayBuffer();
      const src = await pdfjsLib.getDocument({ data: buf }).promise;
      const out = await PDFDocument.create();
      for (let i = 1; i <= src.numPages; i++) {
        const page = await src.getPage(i);
        const vp = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvas, canvasContext: ctx, viewport: vp }).promise;
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let p = 0; p < img.data.length; p += 4) {
          img.data[p] = 255 - img.data[p];
          img.data[p + 1] = 255 - img.data[p + 1];
          img.data[p + 2] = 255 - img.data[p + 2];
        }
        ctx.putImageData(img, 0, 0);
        const png = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/png"));
        const pngBytes = await png.arrayBuffer();
        const embed = await out.embedPng(pngBytes);
        const p = out.addPage([vp.width / 2, vp.height / 2]);
        p.drawImage(embed, { x: 0, y: 0, width: vp.width / 2, height: vp.height / 2 });
        setProgress(i / src.numPages);
      }
      const bytes = await out.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "inverted.pdf");
      toast.success("Inverted PDF ready");
    } catch (e) {
      console.error(e);
      toast.error("Failed to invert colors");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Invert Colors PDF"
      description="Flip black to white and back — great for dark-mode reading or saving printer ink."
      icon={<FlipHorizontal className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      {busy && <div className="mt-4 text-xs text-muted-foreground">Processing… {Math.round(progress * 100)}%</div>}
      <RunButton busy={busy} disabled={!files.length} onClick={run} label="Invert & download" />
    </ToolShell>
  );
}

/* ============ 2. Resize PDF (to standard page size) ============ */
export function ResizePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [size, setSize] = useState<"A4" | "Letter" | "Legal" | "A3" | "A5">("A4");
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!files[0]) return toast.error("Add a PDF");
    setBusy(true);
    try {
      const src = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const target = PageSizes[size];
      const [tw, th] = target;
      const copied = await out.copyPages(src, src.getPageIndices());
      for (const page of copied) {
        const { width: pw, height: ph } = page.getSize();
        const scale = Math.min(tw / pw, th / ph);
        page.scaleContent(scale, scale);
        page.setSize(tw, th);
        out.addPage(page);
      }
      const bytes = await out.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), `resized-${size}.pdf`);
      toast.success(`Resized to ${size}`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to resize");
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="Resize PDF"
      description="Convert every page to a standard size — A4, Letter, Legal, A3, or A5."
      icon={<Maximize2 className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      {files.length > 0 && (
        <div className="mt-6">
          <div className="text-sm text-muted-foreground">Target size</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["A4", "Letter", "Legal", "A3", "A5"] as const).map((s) => (
              <Chip key={s} active={size === s} onClick={() => setSize(s)}>{s}</Chip>
            ))}
          </div>
        </div>
      )}
      <RunButton busy={busy} disabled={!files.length} onClick={run} label="Resize & download" />
    </ToolShell>
  );
}

/* ============ 3. N-up (2/4 pages per sheet) ============ */
export function NupPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [n, setN] = useState<2 | 4>(2);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!files[0]) return toast.error("Add a PDF");
    setBusy(true);
    try {
      const src = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const indices = src.getPageIndices();
      const embedded = await out.embedPages(src.getPages());
      const [w, h] = PageSizes.A4; // landscape for n-up
      const sheetW = h;
      const sheetH = w;
      const cols = n === 2 ? 2 : 2;
      const rows = n === 2 ? 1 : 2;
      const cellW = sheetW / cols;
      const cellH = sheetH / rows;
      for (let i = 0; i < indices.length; i += n) {
        const page = out.addPage([sheetW, sheetH]);
        for (let k = 0; k < n; k++) {
          const idx = i + k;
          if (idx >= indices.length) break;
          const emb = embedded[idx];
          const scale = Math.min(cellW / emb.width, cellH / emb.height) * 0.95;
          const col = k % cols;
          const row = Math.floor(k / cols);
          const x = col * cellW + (cellW - emb.width * scale) / 2;
          const y = sheetH - (row + 1) * cellH + (cellH - emb.height * scale) / 2;
          page.drawPage(emb, { x, y, xScale: scale, yScale: scale });
        }
      }
      const bytes = await out.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), `${n}-up.pdf`);
      toast.success(`${n}-up PDF ready`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to create n-up PDF");
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="N-up PDF"
      description="Fit 2 or 4 pages onto a single sheet — save paper and ink."
      icon={<LayoutGrid className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      {files.length > 0 && (
        <div className="mt-6">
          <div className="text-sm text-muted-foreground">Pages per sheet</div>
          <div className="mt-2 flex gap-2">
            {([2, 4] as const).map((v) => (
              <Chip key={v} active={n === v} onClick={() => setN(v)}>{v}-up</Chip>
            ))}
          </div>
        </div>
      )}
      <RunButton busy={busy} disabled={!files.length} onClick={run} label="Create & download" />
    </ToolShell>
  );
}

/* ============ 4. Insert Blank Pages ============ */
export function BlankPagePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [positions, setPositions] = useState("1");
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!files[0]) return toast.error("Add a PDF");
    setBusy(true);
    try {
      const src = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const total = src.getPageCount();
      const insertAfter = parseRanges(positions, total);
      const out = await PDFDocument.create();
      const all = await out.copyPages(src, src.getPageIndices());
      for (let i = 0; i < all.length; i++) {
        out.addPage(all[i]);
        if (insertAfter.includes(i + 1)) {
          const { width, height } = all[i].getSize();
          const blank = out.addPage([width, height]);
          blank.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });
        }
      }
      const bytes = await out.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "with-blanks.pdf");
      toast.success("Blank pages inserted");
    } catch (e) {
      console.error(e);
      toast.error("Failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="Insert Blank Pages"
      description="Drop blank pages after any page numbers — useful for double-sided printing."
      icon={<FilePlus2 className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      {files.length > 0 && (
        <div className="mt-6">
          <div className="text-sm text-muted-foreground">Insert blank page after page(s)</div>
          <input
            value={positions}
            onChange={(e) => setPositions(e.target.value)}
            placeholder="1, 3, 5-7"
            className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
          />
        </div>
      )}
      <RunButton busy={busy} disabled={!files.length} onClick={run} label="Insert & download" />
    </ToolShell>
  );
}

/* ============ 5. Duplicate Pages ============ */
export function DuplicatePagesPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [ranges, setRanges] = useState("1");
  const [times, setTimes] = useState(1);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!files[0]) return toast.error("Add a PDF");
    setBusy(true);
    try {
      const src = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const total = src.getPageCount();
      const targets = new Set(parseRanges(ranges, total));
      const out = await PDFDocument.create();
      for (let i = 0; i < total; i++) {
        const [page] = await out.copyPages(src, [i]);
        out.addPage(page);
        if (targets.has(i + 1)) {
          for (let k = 0; k < times; k++) {
            const [dup] = await out.copyPages(src, [i]);
            out.addPage(dup);
          }
        }
      }
      const bytes = await out.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "duplicated.pdf");
      toast.success("Pages duplicated");
    } catch (e) {
      console.error(e);
      toast.error("Failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="Duplicate Pages"
      description="Duplicate selected pages one or more times."
      icon={<CopyPlus className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Pages to duplicate</div>
            <input
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              placeholder="1-3, 5"
              className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Times to duplicate</div>
            <input
              type="number"
              min={1}
              max={10}
              value={times}
              onChange={(e) => setTimes(Math.max(1, Math.min(10, +e.target.value)))}
              className="mt-2 w-24 rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      )}
      <RunButton busy={busy} disabled={!files.length} onClick={run} label="Duplicate & download" />
    </ToolShell>
  );
}

/* ============ 6. Extract Text (.txt) ============ */
export function ExtractTextPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!files[0]) return toast.error("Add a PDF");
    setBusy(true);
    try {
      const pdfjsLib = await getPdfjs();
      const buf = await files[0].arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;
      const parts: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const tc = await page.getTextContent();
        const txt = tc.items.map((it: any) => it.str).join(" ");
        parts.push(`--- Page ${i} ---\n${txt}\n`);
      }
      downloadBlob(new Blob([parts.join("\n")], { type: "text/plain" }), "extracted.txt");
      toast.success("Text extracted");
    } catch (e) {
      console.error(e);
      toast.error("Failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="Extract Text"
      description="Pull all selectable text out of a PDF as a plain .txt file."
      icon={<FileTextIcon className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      <RunButton busy={busy} disabled={!files.length} onClick={run} label="Extract & download" />
    </ToolShell>
  );
}

/* ============ 7. Edit PDF Metadata ============ */
export function EditMetadataPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!files[0]) return toast.error("Add a PDF");
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      if (title) doc.setTitle(title);
      if (author) doc.setAuthor(author);
      if (subject) doc.setSubject(subject);
      if (keywords) doc.setKeywords(keywords.split(",").map((k) => k.trim()).filter(Boolean));
      doc.setModificationDate(new Date());
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "metadata-updated.pdf");
      toast.success("Metadata updated");
    } catch (e) {
      console.error(e);
      toast.error("Failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="Edit PDF Metadata"
      description="Update title, author, subject, and keywords stored in the PDF."
      icon={<Tags className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      {files.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <LabeledInput label="Title" value={title} onChange={setTitle} />
          <LabeledInput label="Author" value={author} onChange={setAuthor} />
          <LabeledInput label="Subject" value={subject} onChange={setSubject} />
          <LabeledInput label="Keywords (comma-separated)" value={keywords} onChange={setKeywords} />
        </div>
      )}
      <RunButton busy={busy} disabled={!files.length} onClick={run} label="Save & download" />
    </ToolShell>
  );
}

/* ============ 8. Compare PDFs (text diff) ============ */
export function ComparePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<string>("");
  const run = async () => {
    if (files.length < 2) return toast.error("Add 2 PDFs");
    setBusy(true);
    try {
      const pdfjsLib = await getPdfjs();
      const extract = async (f: File) => {
        const doc = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
        const lines: string[] = [];
        for (let i = 1; i <= doc.numPages; i++) {
          const p = await doc.getPage(i);
          const tc = await p.getTextContent();
          lines.push(tc.items.map((it: any) => it.str).join(" "));
        }
        return lines;
      };
      const [a, b] = await Promise.all([extract(files[0]), extract(files[1])]);
      const out: string[] = [`Comparing ${files[0].name} ↔ ${files[1].name}`, ""];
      const max = Math.max(a.length, b.length);
      let diffs = 0;
      for (let i = 0; i < max; i++) {
        if (a[i] !== b[i]) {
          diffs++;
          out.push(`--- Page ${i + 1} differs ---`);
          out.push(`A: ${(a[i] ?? "(missing)").slice(0, 400)}`);
          out.push(`B: ${(b[i] ?? "(missing)").slice(0, 400)}`);
          out.push("");
        }
      }
      out.unshift(`Pages with differences: ${diffs}/${max}`, "");
      const text = out.join("\n");
      setReport(text);
      downloadBlob(new Blob([text], { type: "text/plain" }), "pdf-diff.txt");
      toast.success(diffs === 0 ? "Identical text content" : `${diffs} page(s) differ`);
    } catch (e) {
      console.error(e);
      toast.error("Failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="Compare PDFs"
      description="Side-by-side text diff between two PDFs, page by page."
      icon={<GitCompare className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} multiple />
      <RunButton busy={busy} disabled={files.length < 2} onClick={run} label="Compare & download diff" />
      {report && (
        <pre className="mt-6 max-h-72 overflow-auto rounded-xl border border-border bg-surface/60 p-4 text-xs">
          {report}
        </pre>
      )}
    </ToolShell>
  );
}

/* ============ 9. PDF ↔ Base64 ============ */
export function Base64Pdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [base64Input, setBase64Input] = useState("");
  const [base64Out, setBase64Out] = useState("");
  const [busy, setBusy] = useState(false);
  const encode = async () => {
    if (!files[0]) return toast.error("Add a PDF");
    setBusy(true);
    try {
      const buf = await files[0].arrayBuffer();
      const bytes = new Uint8Array(buf);
      let bin = "";
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
      }
      setBase64Out(btoa(bin));
      toast.success("Encoded to Base64");
    } finally {
      setBusy(false);
    }
  };
  const decode = async () => {
    try {
      const cleaned = base64Input.replace(/^data:application\/pdf;base64,/, "").replace(/\s/g, "");
      const bin = atob(cleaned);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      downloadBlob(new Blob([bytes], { type: "application/pdf" }), "decoded.pdf");
      toast.success("Decoded PDF downloaded");
    } catch {
      toast.error("Invalid Base64");
    }
  };
  return (
    <ToolShell
      title="PDF ↔ Base64"
      description="Encode a PDF to Base64 for inline embedding, or decode Base64 back to a PDF file."
      icon={<Binary className="h-7 w-7 text-primary" />}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-display text-sm font-semibold">PDF → Base64</h3>
          <div className="mt-3"><FileDrop files={files} onFiles={setFiles} /></div>
          <RunButton busy={busy} disabled={!files.length} onClick={encode} label="Encode" />
          {base64Out && (
            <textarea
              readOnly
              value={base64Out}
              className="mt-4 h-32 w-full rounded-md border border-border bg-surface p-2 font-mono text-[10px]"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
          )}
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold">Base64 → PDF</h3>
          <textarea
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            placeholder="Paste Base64 here…"
            className="mt-3 h-40 w-full rounded-md border border-border bg-surface p-2 font-mono text-xs focus:border-primary focus:outline-none"
          />
          <RunButton busy={false} disabled={!base64Input} onClick={decode} label="Decode & download" />
        </div>
      </div>
    </ToolShell>
  );
}

/* ============ 10. Reverse Page Order ============ */
export function ReversePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!files[0]) return toast.error("Add a PDF");
    setBusy(true);
    try {
      const src = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const indices = src.getPageIndices().slice().reverse();
      const pages = await out.copyPages(src, indices);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "reversed.pdf");
      toast.success("Pages reversed");
    } catch (e) {
      console.error(e);
      toast.error("Failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="Reverse PDF"
      description="Flip the page order so the last page becomes the first."
      icon={<ArrowDownUp className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />
      <RunButton busy={busy} disabled={!files.length} onClick={run} label="Reverse & download" />
    </ToolShell>
  );
}

/* ============ shared bits ============ */
function RunButton({
  busy,
  disabled,
  onClick,
  label,
}: {
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={busy || disabled}
      className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </button>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-4 py-2 text-sm transition-colors ${
        active
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-surface text-muted-foreground hover:border-primary/60"
      }`}
    >
      {children}
    </button>
  );
}

function LabeledInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}
