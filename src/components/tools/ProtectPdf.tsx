import { useState } from "react";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { FileDrop, ToolShell, downloadBlob, ProgressBar } from "./ToolShell";
import { loadPdfjs } from "@/lib/pdfjs";
import { toast } from "sonner";

export function ProtectPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF first");
    if (password.length < 4) return toast.error("Password must be at least 4 characters");
    if (password !== confirm) return toast.error("Passwords don't match");

    setBusy(true);
    setProgress(0);
    try {
      const file = files[0];
      const buf = await file.arrayBuffer();
      const pdfjs = await loadPdfjs();

      // PDFKit is a CommonJS-ish lib that expects Buffer/process polyfills.
      // Use the prebuilt standalone bundle plus blob-stream for output.
      const PDFDocument = (await import("pdfkit/js/pdfkit.standalone.js")).default;
      const blobStream = (await import("blob-stream")).default;

      const src = await pdfjs.getDocument({ data: buf.slice(0) }).promise;
      const first = await src.getPage(1);
      const v0 = first.getViewport({ scale: 1 });

      const doc = new PDFDocument({
        autoFirstPage: false,
        userPassword: password,
        ownerPassword: password,
        permissions: { printing: "highResolution", modifying: false, copying: false },
        pdfVersion: "1.7",
      });
      const stream = doc.pipe(blobStream());

      for (let i = 1; i <= src.numPages; i++) {
        const page = await src.getPage(i);
        const vp = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(vp.width);
        canvas.height = Math.floor(vp.height);
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, canvasContext: ctx, viewport: vp }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

        const pageVp = page.getViewport({ scale: 1 });
        doc.addPage({ size: [pageVp.width, pageVp.height], margin: 0 });
        doc.image(dataUrl, 0, 0, { width: pageVp.width, height: pageVp.height });
        setProgress(i / src.numPages);
      }
      void v0;

      doc.end();
      const blob: Blob = await new Promise((resolve) =>
        stream.on("finish", () => resolve(stream.toBlob("application/pdf"))),
      );
      downloadBlob(blob, file.name.replace(/\.pdf$/i, "") + "-protected.pdf");
      toast.success("Encrypted PDF ready");
    } catch (e) {
      console.error(e);
      toast.error("Encryption failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Protect PDF"
      description="Encrypt your PDF with a password. Pages are rasterized into a new AES-protected document."
      icon={<Lock className="h-7 w-7 text-primary" />}
    >
      <FileDrop files={files} onFiles={setFiles} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Password</label>
          <div className="relative mt-2">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 pr-10 text-sm outline-none focus:border-primary"
              placeholder="At least 4 characters"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-surface"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Confirm password</label>
          <input
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="Repeat password"
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Note: pages are re-rendered as images during encryption — text becomes non-selectable.
        Stronger text-preserving encryption is on the backend roadmap.
      </p>

      {busy && <ProgressBar progress={progress} label="Encrypting" />}

      <button
        onClick={run}
        disabled={busy || files.length === 0 || !password}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Encrypt & download
      </button>
    </ToolShell>
  );
}
