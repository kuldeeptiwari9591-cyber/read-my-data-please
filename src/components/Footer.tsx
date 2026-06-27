import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { CATEGORY_META, TOOLS, type ToolCategory } from "@/lib/tools";

const COLS: ToolCategory[] = ["organize", "convert-to", "convert-from", "edit", "secure"];

const COMPANY = [
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Changelog", to: "/changelog" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border/60 bg-surface/40 backdrop-blur-xl">
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo size={36} />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Every PDF tool you need. Free. Crisp. Fast. No signup, no watermarks, no nonsense.
          </p>
        </div>

        {COLS.map((cat) => (
          <div key={cat}>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {CATEGORY_META[cat].label}
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {TOOLS.filter((t) => t.category === cat)
                .slice(0, 7)
                .map((t) => (
                  <li key={t.slug}>
                    <Link
                      to={("/" + t.slug) as never}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Company
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {COMPANY.map((c) => (
              <li key={c.to}>
                <Link
                  to={c.to}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} CrispPDF. Your files stay yours.</p>
          <p className="font-mono">v1.3 · built with TanStack Start</p>
        </div>
      </div>
    </footer>
  );
}
