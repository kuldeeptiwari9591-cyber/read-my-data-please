import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "crisppdf:cookie-consent";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      // ignore
    }
  }, []);

  const dismiss = (value: "accepted" | "dismissed") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border border-border bg-surface/95 p-4 shadow-2xl backdrop-blur-xl md:inset-x-auto md:right-6 md:left-auto md:w-[28rem]"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 text-sm">
          <p className="font-display font-semibold">We respect your privacy</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            CrispPDF processes files in your browser. We use a single cookie only to remember
            your theme and this notice — no analytics, no tracking, no ads.
          </p>
        </div>
        <button
          onClick={() => dismiss("dismissed")}
          aria-label="Close"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <a
          href="/privacy"
          className="rounded-md border border-border bg-transparent px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary"
        >
          Privacy policy
        </a>
        <button
          onClick={() => dismiss("accepted")}
          className="rounded-md bg-gradient-to-r from-primary to-secondary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
