import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            Crisp<span className="text-gradient">PDF</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/" hash="tools" className="transition-colors hover:text-foreground">All tools</Link>
          <Link to="/" hash="how" className="transition-colors hover:text-foreground">How it works</Link>
          <Link to="/" hash="why" className="transition-colors hover:text-foreground">Why CrispPDF</Link>
          <Link to="/" hash="faq" className="transition-colors hover:text-foreground">FAQ</Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
