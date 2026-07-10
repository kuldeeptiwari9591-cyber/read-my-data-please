import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Globe, Loader2, Info } from "lucide-react";
import { ToolShell, downloadBlob, ProgressBar } from "./ToolShell";
import { htmlToPdf } from "@/lib/html-to-pdf.functions";
import { toast } from "sonner";

export function HtmlToPdfTool() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const run = useServerFn(htmlToPdf);

  const handle = async () => {
    if (!url.trim()) return toast.error("Enter a URL");
    setBusy(true);
    setProgress(0.3);
    try {
      const { base64, title } = await run({ data: { url: url.trim() } });
      setProgress(0.9);
      const bin = atob(base64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const safe = title.replace(/[^a-z0-9-_]+/gi, "_").slice(0, 60) || "page";
      downloadBlob(blob, safe + ".pdf");
      setProgress(1);
      toast.success("PDF ready");
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Failed to fetch or render the page";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Web Page to PDF (readable text)"
      description="Paste a public HTTPS URL. We fetch the page on our server and generate a clean, text-focused PDF."
      icon={<Globe className="h-7 w-7 text-primary" />}
    >
      <div className="rounded-2xl border border-border bg-surface/40 p-6">
        <label className="block text-sm font-medium" htmlFor="html-to-pdf-url">
          Page URL
        </label>
        <input
          id="html-to-pdf-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          inputMode="url"
          autoComplete="url"
        />
        <div className="mt-3 flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="font-medium text-foreground">Text-focused, not pixel-perfect.</p>
            <p className="mt-1">
              We extract the readable text and lay it out cleanly. Scripts, CSS, ads, and
              login-only pages are skipped. Only public <code>https://</code> URLs are supported;
              private/internal hosts are blocked.
            </p>
          </div>
        </div>
      </div>
      {busy && <ProgressBar progress={progress} label="Fetching & rendering" />}
      <button
        onClick={handle}
        disabled={busy || !url.trim()}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        Convert URL to PDF
      </button>
    </ToolShell>
  );
}
