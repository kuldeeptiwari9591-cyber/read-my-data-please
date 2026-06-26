import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo size={34} />

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/" hash="tools" className="transition-colors hover:text-foreground">
            {t("nav.allTools")}
          </Link>
          <Link to="/" hash="how" className="transition-colors hover:text-foreground">
            {t("nav.howItWorks")}
          </Link>
          <Link to="/" hash="why" className="transition-colors hover:text-foreground">
            {t("nav.whyCrisp")}
          </Link>
          <Link to="/blog" className="transition-colors hover:text-foreground">
            {t("nav.blog")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
