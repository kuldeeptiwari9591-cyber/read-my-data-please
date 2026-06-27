import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X, Search } from "lucide-react";
import { TOOLS, CATEGORY_META, type ToolCategory } from "@/lib/tools";

const CATEGORIES: ToolCategory[] = [
  "organize",
  "convert-to",
  "convert-from",
  "edit",
  "secure",
];

const INFO_LINKS = [
  { to: "/why-crisppdf", label: "Why CrispPDF" },
  { to: "/faq", label: "FAQ" },
  { to: "/feedback", label: "Feedback" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/changelog", label: "Changelog" },
  { to: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
];

export function MegaMenu() {
  const [open, setOpen] = useState<"tools" | "more" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const filtered = q.trim()
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(q.toLowerCase()) ||
          t.short.toLowerCase().includes(q.toLowerCase()),
      )
    : null;

  return (
    <div className="relative" ref={wrapRef}>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
        <button
          onClick={() => setOpen(open === "tools" ? null : "tools")}
          className="inline-flex items-center gap-1 rounded-md px-3 py-2 transition-colors hover:bg-surface hover:text-foreground"
          aria-expanded={open === "tools"}
        >
          All tools <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <Link
          to="/"
          hash="how"
          className="rounded-md px-3 py-2 transition-colors hover:bg-surface hover:text-foreground"
        >
          How it works
        </Link>
        <Link
          to="/why-crisppdf"
          className="rounded-md px-3 py-2 transition-colors hover:bg-surface hover:text-foreground"
        >
          Why CrispPDF
        </Link>
        <Link
          to="/blog"
          className="rounded-md px-3 py-2 transition-colors hover:bg-surface hover:text-foreground"
        >
          Blog
        </Link>
        <button
          onClick={() => setOpen(open === "more" ? null : "more")}
          className="inline-flex items-center gap-1 rounded-md px-3 py-2 transition-colors hover:bg-surface hover:text-foreground"
          aria-expanded={open === "more"}
        >
          More <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </nav>

      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-surface hover:text-foreground md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop: Tools mega panel */}
      {open === "tools" && (
        <div className="absolute left-1/2 top-full z-50 mt-2 hidden w-[min(96vw,1100px)] -translate-x-1/2 rounded-2xl border border-border/60 bg-background/95 p-5 shadow-2xl backdrop-blur-xl md:block">
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-border/60 bg-surface/50 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search 40 tools…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {filtered ? (
            <div className="grid max-h-[60vh] grid-cols-2 gap-1 overflow-auto lg:grid-cols-3">
              {filtered.map((t) => (
                <ToolLink key={t.slug} slug={t.slug} name={t.name} short={t.short} icon={t.icon} onClick={() => setOpen(null)} />
              ))}
              {filtered.length === 0 && (
                <p className="col-span-full p-4 text-center text-sm text-muted-foreground">
                  No tools match "{q}"
                </p>
              )}
            </div>
          ) : (
            <div className="grid max-h-[65vh] grid-cols-2 gap-x-6 gap-y-5 overflow-auto lg:grid-cols-5">
              {CATEGORIES.map((cat) => {
                const items = TOOLS.filter((t) => t.category === cat);
                return (
                  <div key={cat}>
                    <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
                      {CATEGORY_META[cat].label}
                    </h3>
                    <ul className="space-y-0.5">
                      {items.map((t) => (
                        <li key={t.slug}>
                          <ToolLink slug={t.slug} name={t.name} short={t.short} icon={t.icon} compact onClick={() => setOpen(null)} />
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Desktop: More panel */}
      {open === "more" && (
        <div className="absolute right-0 top-full z-50 mt-2 hidden w-64 rounded-2xl border border-border/60 bg-background/95 p-3 shadow-2xl backdrop-blur-xl md:block">
          <div className="grid grid-cols-1 gap-0.5">
            <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Company</p>
            {INFO_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to as never}
                onClick={() => setOpen(null)}
                className="rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface"
              >
                {l.label}
              </Link>
            ))}
            <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Legal</p>
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to as never}
                onClick={() => setOpen(null)}
                className="rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[88vw] max-w-sm overflow-y-auto border-l border-border/60 bg-background p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-lg font-semibold">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-2 hover:bg-surface"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-lg border border-border/60 bg-surface/50 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search tools…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            {filtered ? (
              <ul className="space-y-0.5">
                {filtered.map((t) => (
                  <li key={t.slug}>
                    <ToolLink
                      slug={t.slug}
                      name={t.name}
                      short={t.short}
                      icon={t.icon}
                      compact
                      onClick={() => setMobileOpen(false)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <>
                {CATEGORIES.map((cat) => (
                  <div key={cat} className="mb-4">
                    <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                      {CATEGORY_META[cat].label}
                    </h3>
                    <ul className="space-y-0.5">
                      {TOOLS.filter((t) => t.category === cat).map((t) => (
                        <li key={t.slug}>
                          <ToolLink
                            slug={t.slug}
                            name={t.name}
                            short={t.short}
                            icon={t.icon}
                            compact
                            onClick={() => setMobileOpen(false)}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="mt-2 border-t border-border/60 pt-3">
                  <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Company</h3>
                  <ul className="space-y-0.5">
                    {INFO_LINKS.map((l) => (
                      <li key={l.to}>
                        <Link
                          to={l.to as never}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-md px-3 py-2 text-sm hover:bg-surface"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <h3 className="mb-1.5 mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Legal</h3>
                  <ul className="space-y-0.5">
                    {LEGAL_LINKS.map((l) => (
                      <li key={l.to}>
                        <Link
                          to={l.to as never}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-md px-3 py-2 text-sm hover:bg-surface"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolLink({
  slug,
  name,
  short,
  icon: Icon,
  compact,
  onClick,
}: {
  slug: string;
  name: string;
  short: string;
  icon: React.ComponentType<{ className?: string }>;
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={("/" + slug) as never}
      onClick={onClick}
      className="group flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-surface"
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary group-hover:bg-primary/20">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">{name}</span>
        {!compact && (
          <span className="block truncate text-[11px] text-muted-foreground">{short}</span>
        )}
      </span>
    </Link>
  );
}
