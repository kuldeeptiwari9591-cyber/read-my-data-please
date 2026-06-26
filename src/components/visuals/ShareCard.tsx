import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check, X } from "lucide-react";
import { SITE_URL } from "@/lib/site-url";

interface Props {
  toolSlug: string;
  toolName: string;
  /** Optional dynamic tokens, e.g. { originalSize: "5.2 MB", newSize: "1.1 MB" } */
  context?: Record<string, string>;
}

const TEMPLATES: Record<string, string> = {
  "compress-pdf":
    "I just compressed my PDF from {originalSize} to {newSize} for FREE using CrispPDF! 🔥 No signup needed.",
  "merge-pdf": "Just merged {count} PDFs into one instantly — for free at CrispPDF!",
  "pdf-to-word": "Converted my PDF to Word in seconds, completely free at CrispPDF!",
  "pdf-to-excel": "Converted my PDF to Excel in seconds, completely free at CrispPDF!",
  "pdf-to-ppt": "Converted my PDF to PowerPoint in seconds, completely free at CrispPDF!",
  "pdf-to-jpg": "Converted my PDF to JPG images in seconds, completely free at CrispPDF!",
};

function buildText(slug: string, name: string, ctx?: Record<string, string>) {
  const tpl =
    TEMPLATES[slug] ?? `Just used CrispPDF to ${name.toLowerCase()} — free, fast, no signup needed!`;
  return tpl.replace(/\{(\w+)\}/g, (_, k) => ctx?.[k] ?? `{${k}}`);
}

/**
 * Glassy share card that slides in after a successful operation
 * (Animation 7). Dismissal stored in sessionStorage per tool.
 */
export function ShareCard({ toolSlug, toolName, context }: Props) {
  const storageKey = `crisppdf-share-dismissed-${toolSlug}`;
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(storageKey) === "1";
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [storageKey]);

  const url = `${SITE_URL}/${toolSlug}`;
  const text = buildText(toolSlug, toolName, context);
  const fullShare = `${text} ${url}`;

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {}
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative mt-6 overflow-hidden rounded-2xl border border-border/60 bg-surface/80 p-5 backdrop-blur-xl"
          style={{ willChange: "transform, opacity" }}
        >
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <h3 className="font-display text-base font-semibold">
            Share CrispPDF with others 🙌
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">"{text}"</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(fullShare)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(37,211,102,0.35)] transition-transform hover:scale-[1.02]"
              style={{ willChange: "transform" }}
            >
              <WhatsAppIcon className="h-4 w-4" />
              Share on WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(fullShare)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-3 py-2 text-xs font-medium transition-colors hover:border-primary"
            >
              <XIcon className="h-3.5 w-3.5" />
              Post on X
            </a>
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-3 py-2 text-xs font-medium transition-colors hover:border-primary"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-success" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy link
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.519 5.265l-.999 3.648 3.969-1.041z" />
    </svg>
  );
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.93l-5.42-7.09L4.4 22H1.14l8.04-9.19L1 2h7.1l4.9 6.49L18.24 2zm-2.43 18h1.92L7.27 4H5.23l10.58 16z" />
    </svg>
  );
}
