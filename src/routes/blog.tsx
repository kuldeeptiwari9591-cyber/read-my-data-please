import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { listPublishedPosts } from "@/lib/blog.functions";

export const Route = createFileRoute("/blog")({
  loader: () => listPublishedPosts(),
  head: () => ({
    meta: [
      { title: "Blog — CrispPDF" },
      {
        name: "description",
        content:
          "Plain-English guides on working with PDFs: compression, conversion, OCR, privacy, and what actually works in the browser.",
      },
      { property: "og:title", content: "CrispPDF Blog" },
      { property: "og:description", content: "Honest guides on PDFs — privacy, compression, conversion." },
      { property: "og:url", content: "/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
  errorComponent: ({ error }) => (
    <div className="p-10 text-sm text-muted-foreground">Couldn't load posts: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10">No posts.</div>,
});

function BlogIndex() {
  const posts = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Blog</h1>
        <p className="mt-3 text-muted-foreground">
          Plain-English guides on PDF tooling, privacy, and what actually works in the browser.
        </p>

        <div className="mt-12 space-y-6">
          {posts.length === 0 && (
            <p className="text-muted-foreground">No posts published yet.</p>
          )}
          {posts.map((p) => (
            <Link
              key={p.slug}
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
              <span className="mt-4 inline-flex items-center text-sm text-primary">Read →</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
