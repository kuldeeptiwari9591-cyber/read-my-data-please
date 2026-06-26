import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { SUPPORTED_LOCALES, type LocaleCode, applyClientLocale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Render English defaults during SSR / pre-mount so hydration markup matches.
  const current = (mounted ? i18n.resolvedLanguage || "en" : "en") as LocaleCode;

  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.documentElement.lang = current;
    }
  }, [current, mounted]);

  const change = (code: LocaleCode) => {
    applyClientLocale(code);
    setOpen(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", code);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const active = SUPPORTED_LOCALES.find((l) => l.code === current) ?? SUPPORTED_LOCALES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={mounted ? t("language") : "Language"}
        className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-surface/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{active.native}</span>
        <span className="sm:hidden uppercase">{active.code}</span>
      </button>
      {open && mounted && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-lg border border-border/60 bg-background/95 shadow-xl backdrop-blur-xl">
            {SUPPORTED_LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => change(l.code)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-surface"
              >
                <span>
                  <span className="font-medium">{l.native}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{l.label}</span>
                </span>
                {l.code === current && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
