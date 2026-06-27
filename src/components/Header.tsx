import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

// English defaults used during SSR / first paint — match the locale forced
// in src/lib/i18n.ts so hydration markup is identical on both sides.
const DEFAULTS = {
  allTools: "All tools",
  howItWorks: "How it works",
  whyCrisp: "Why CrispPDF",
  blog: "Blog",
};

export function Header() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tr = (k: keyof typeof DEFAULTS) =>
    mounted ? t(`nav.${k}`) : DEFAULTS[k];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo size={34} />

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/" hash="tools" className="transition-colors hover:text-foreground">
            {tr("allTools")}
          </Link>
          <Link to="/" hash="how" className="transition-colors hover:text-foreground">
            {tr("howItWorks")}
          </Link>
          <Link to="/why-crisppdf" className="transition-colors hover:text-foreground">
            {tr("whyCrisp")}
          </Link>
          <Link to="/blog" className="transition-colors hover:text-foreground">
            {tr("blog")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
