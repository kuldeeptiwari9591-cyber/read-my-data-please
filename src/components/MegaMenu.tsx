import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Search, X } from "lucide-react";
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
  
  { to: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
];

type Panel = "tools" | "more" | null;

export function MegaMenu() {
  const [open, setOpen] = useState<Panel>(null);
  const [q, setQ] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    // Lock body scroll when a panel is open on small screens
    if (open && typeof window !== "undefined" && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const filtered = q.trim()
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(q.toLowerCase()) ||
          t.short.toLowerCase().includes(q.toLowerCase()),
      )
    : null;

  const close = () => {
    setOpen(null);
    setQ("");
  };

  return (
    <div className="relative" ref={wrapRef}>
      {/* Same nav on every viewport, scrollable on mobile */}
      <nav className="flex w-full items-center gap-0.5 overflow-x-auto text-sm text-muted-foreground sm:max-w-none [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setOpen(open === "tools" ? null : "tools")}
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-2 transition-colors hover:bg-surface hover:text-foreground sm:px-3"
          aria-expanded={open === "tools"}
        >
          All tools <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <Link
          to="/why-crisppdf"
          className="shrink-0 rounded-md px-2.5 py-2 transition-colors hover:bg-surface hover:text-foreground sm:px-3"
        >
          Why
        </Link>
        <Link
          to="/blog"
          className="shrink-0 rounded-md px-2.5 py-2 transition-colors hover:bg-surface hover:text-foreground sm:px-3"
        >
          Blog
        </Link>
        <Link
          to="/faq"
          className="shrink-0 rounded-md px-2.5 py-2 transition-colors hover:bg-surface hover:text-foreground sm:px-3"
        >
          FAQ
        </Link>
        <button
          onClick={() => setOpen(open === "more" ? null : "more")}
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-2 transition-colors hover:bg-surface hover:text-foreground sm:px-3"
          aria-expanded={open === "more"}
        >
          More <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </nav>

      {/* Tools panel — fullscreen sheet on mobile, dropdown on md+ */}
      {open === "tools" && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={close}
          />
          <div
            className="fixed inset-x-0 top-16 z-50 mx-auto flex max-h-[calc(100vh-4rem)] flex-col overflow-hidden border-b border-border bg-background p-4 shadow-2xl md:absolute md:left-1/2 md:top-full md:inset-x-auto md:mt-2 md:w-[min(96vw,1100px)] md:max-h-[70vh] md:-translate-x-1/2 md:rounded-2xl md:border md:border-border/60 md:bg-background/95 md:p-5 md:backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-border/60 bg-surface/50 px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search 40 tools…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={close}
                className="rounded-md p-2 text-muted-foreground hover:bg-surface md:hidden"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered ? (
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((t) => (
                    <ToolLink
                      key={t.slug}
                      slug={t.slug}
                      name={t.name}
                      short={t.short}
                      icon={t.icon}
                      onClick={close}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <p className="col-span-full p-4 text-center text-sm text-muted-foreground">
                      No tools match "{q}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
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
                              <ToolLink
                                slug={t.slug}
                                name={t.name}
                                short={t.short}
                                icon={t.icon}
                                compact
                                onClick={close}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* More panel */}
      {open === "more" && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={close}
          />
          <div className="fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-background p-4 shadow-2xl md:absolute md:inset-x-auto md:right-0 md:top-full md:mt-2 md:w-64 md:rounded-2xl md:border md:border-border/60 md:bg-background/95 md:p-3 md:backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between md:hidden">
              <span className="font-display text-base font-semibold">More</span>
              <button
                onClick={close}
                className="rounded-md p-2 text-muted-foreground hover:bg-surface"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Company
            </p>
            {INFO_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to as never}
                onClick={close}
                className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface"
              >
                {l.label}
              </Link>
            ))}
            <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Legal
            </p>
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to as never}
                onClick={close}
                className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </>
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
        <span className="block truncate text-sm font-medium text-foreground">
          {name}
        </span>
        {!compact && (
          <span className="block truncate text-[11px] text-muted-foreground">
            {short}
          </span>
        )}
      </span>
    </Link>
  );
}
