import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

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
          <a href="#tools" className="transition-colors hover:text-foreground">All tools</a>
          <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#why" className="transition-colors hover:text-foreground">Why CrispPDF</a>
          <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
        </nav>

        <a
          href="#tools"
          className="hidden rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-foreground md:inline-flex"
        >
          Browse 30 tools
        </a>
      </div>
    </header>
  );
}
