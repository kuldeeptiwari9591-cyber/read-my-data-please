import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Globe, Loader2 } from "lucide-react";
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
      toast.error("Failed to fetch or render the page");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="HTML to PDF"
      description="Paste a URL. We fetch the page on our server and return a clean readable PDF."
      icon={<Globe className="h-7 w-7 text-primary" />}
    >
      <div className="rounded-2xl border border-border bg-surface/40 p-6">
        <label className="block text-sm font-medium">Page URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          We strip scripts and styles and lay out the readable text. Complex layouts won't render pixel-perfect.
        </p>
      </div>
      {busy && <ProgressBar progress={progress} label="Fetching & rendering" />}
      <button
        onClick={handle}
        disabled={busy || !url.trim()}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Convert URL to PDF
      </button>
    </ToolShell>
  );
}
