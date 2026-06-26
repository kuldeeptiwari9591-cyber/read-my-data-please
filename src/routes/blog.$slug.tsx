import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPostBySlug } from "@/lib/blog.functions";
import { abs, OG_DEFAULT } from "@/lib/site-url";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPostBySlug({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    const post = loaderData;
    const title = post ? `${post.title} — CrispPDF Blog` : "Post — CrispPDF Blog";
    const description = post?.excerpt ?? "Read this post on the CrispPDF blog.";
    const path = post ? `/blog/${post.slug}` : "/blog";
    const canonical = abs(path);
    const image = post?.cover_image || OG_DEFAULT;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonical },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: post
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: post.title,
                description: post.excerpt,
                image,
                author: { "@type": "Organization", name: post.author ?? "CrispPDF" },
                datePublished: post.published_at,
                mainEntityOfPage: canonical,
              }),
            },
          ]
        : [],
    };
  },
  component: BlogPostPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-sm text-muted-foreground">Couldn't load post: {error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Post not found</h1>
        <Link to="/blog" className="mt-6 inline-block text-primary">← Back to blog</Link>
      </main>
    </div>
  ),
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-20">
        <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to blog
        </Link>
        <div className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">
          {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
          {post.author ? ` · ${post.author}` : ""}
        </div>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        <article className="mt-10 whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground/90">
          {post.body}
        </article>
      </main>
      <Footer />
    </div>
  );
}
