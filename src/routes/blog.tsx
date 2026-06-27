import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { listPublishedPosts, type BlogListItem } from "@/lib/blog.functions";
import { abs, OG_DEFAULT } from "@/lib/site-url";

export const Route = createFileRoute("/blog")({
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
  errorComponent: ({ error }) => (
    <div className="p-10 text-sm text-muted-foreground">Couldn't load posts: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10">No posts.</div>,
});

const TABS = ["All", "Convert", "Compress", "Security", "eSign", "OCR", "Tips"] as const;
type Tab = (typeof TABS)[number];

function matches(post: BlogListItem, tab: Tab): boolean {
  if (tab === "All") return true;
  const t = tab.toLowerCase();
  const hay = `${post.title} ${post.excerpt} ${(post.tags ?? []).join(" ")}`.toLowerCase();
  return hay.includes(t);
}

function BlogIndex() {
  const posts = Route.useLoaderData() as BlogListItem[];
  const [tab, setTab] = useState<Tab>("All");
  const filtered = useMemo(() => posts.filter((p) => matches(p, tab)), [posts, tab]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Blog</h1>
        <p className="mt-3 text-muted-foreground">
          Plain-English guides on PDF tooling, privacy, and what actually works in the browser.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-1.5">
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

        <motion.div layout className="mt-10 space-y-6">
          {filtered.length === 0 && (
            <p className="text-muted-foreground">No posts in this category yet.</p>
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
