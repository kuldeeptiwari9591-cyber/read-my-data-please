import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { listPublishedPosts, type BlogListItem } from "@/lib/blog.functions";
import { abs, OG_DEFAULT } from "@/lib/site-url";

export const Route = createFileRoute("/blog/")({
  loader: () => listPublishedPosts(),
  head: () => {
    const canonical = abs("/blog");
    return {
      meta: [
        { title: "Blog — CrispPDF" },
        {
          name: "description",
          content:
            "Plain-English guides on working with PDFs: compression, conversion, OCR, privacy, and what actually works in the browser.",
        },
        { property: "og:title", content: "CrispPDF Blog" },
        { property: "og:description", content: "Honest guides on PDFs — privacy, compression, conversion." },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        { property: "og:image", content: OG_DEFAULT },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_DEFAULT },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: BlogIndex,
  pendingComponent: BlogSkeleton,
  pendingMs: 100,
  errorComponent: ({ error }) => (
    <div className="p-10 text-sm text-muted-foreground">Couldn't load posts: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10">No posts.</div>,
});

function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <div className="h-10 w-32 animate-pulse rounded bg-muted/40" />
        <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-muted/30" />
        <div className="mt-8 h-10 w-full animate-pulse rounded-lg bg-muted/30" />
        <div className="mt-6 flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-7 w-16 animate-pulse rounded-full bg-muted/30" />
          ))}
        </div>
        <div className="mt-10 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface/40 p-6">
              <div className="h-3 w-32 animate-pulse rounded bg-muted/30" />
              <div className="mt-3 h-6 w-3/4 animate-pulse rounded bg-muted/40" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted/30" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-muted/20" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const TABS = ["All", "Convert", "Compress", "Security", "eSign", "OCR", "Tips"] as const;
type Tab = (typeof TABS)[number];

function matches(post: BlogListItem, tab: Tab, query: string): boolean {
  const hay = `${post.title} ${post.excerpt} ${(post.tags ?? []).join(" ")}`.toLowerCase();
  if (tab !== "All" && !hay.includes(tab.toLowerCase())) return false;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return q.split(/\s+/).every((tok) => hay.includes(tok));
}

function BlogIndex() {
  const posts = Route.useLoaderData() as BlogListItem[];
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => posts.filter((p) => matches(p, tab, query)), [posts, tab, query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Blog</h1>
        <p className="mt-3 text-muted-foreground">
          Plain-English guides on PDF tooling, privacy, and what actually works in the browser.
        </p>

        <label className="relative mt-8 block">
          <span className="sr-only">Search posts</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts… (e.g. compress, OCR, WhatsApp)"
            className="w-full rounded-lg border border-border bg-surface/40 py-2.5 pl-10 pr-10 text-sm outline-none transition-colors focus:border-primary"
            aria-label="Search blog posts"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {TABS.map((t) => {
            const active = t === tab;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  active ? "text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeBlogTab"
                    className="absolute inset-0 -z-10 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {t}
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-muted-foreground" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "post" : "posts"}
          {query ? ` matching "${query}"` : ""}
          {tab !== "All" ? ` in ${tab}` : ""}
        </p>

        <motion.div layout className="mt-4 space-y-6">
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-surface/20 p-10 text-center">
              <p className="text-muted-foreground">No posts match your search.</p>
              <button
                onClick={() => {
                  setQuery("");
                  setTab("All");
                }}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="block rounded-2xl border border-border bg-surface/40 p-6 transition-all hover:border-primary/40 hover:bg-surface/60"
                >
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {p.published_at ? new Date(p.published_at).toLocaleDateString() : "Draft"}
                    {p.author ? ` · ${p.author}` : ""}
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-semibold">{p.title}</h2>
                  <p className="mt-2 text-muted-foreground">{p.excerpt}</p>
                  {p.tags && p.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 4).map((tg) => (
                        <span
                          key={tg}
                          className="rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground"
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="mt-4 inline-flex items-center text-sm text-primary">Read →</span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
