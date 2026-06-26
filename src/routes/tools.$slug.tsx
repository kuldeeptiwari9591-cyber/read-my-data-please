import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Suspense } from "react";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS, TOOLS_BY_SLUG } from "@/lib/tools";
import { TOOL_COMPONENTS } from "@/components/tools";
import { ToolShell } from "@/components/tools/ToolShell";
import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { RateLimitBanner } from "@/components/tools/RateLimitBanner";
import { getToolContent } from "@/lib/tool-content";

export const Route = createFileRoute("/tools/$slug")({
  head: ({ params }) => {
    const tool = TOOLS_BY_SLUG[params.slug];
    if (!tool) {
      return { meta: [{ title: "Tool not found — CrispPDF" }] };
    }
    const content = getToolContent(tool.slug, tool.name);
    const path = `/tools/${tool.slug}`;
    const title = `${tool.name} — Free Online ${tool.name} Tool · CrispPDF`;
    const description = tool.description;

    const webApp = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${tool.name} — CrispPDF`,
      url: path,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (web browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description,
    };
    const howTo = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `How to use ${tool.name}`,
      step: content.howTo.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
    };
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "CrispPDF", item: "/" },
        { "@type": "ListItem", position: 2, name: tool.name, item: path },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: `${tool.name} — CrispPDF` },
        { property: "og:description", content: description },
        { property: "og:url", content: path },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${tool.name} — CrispPDF` },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(webApp) },
        { type: "application/ld+json", children: JSON.stringify(howTo) },
        { type: "application/ld+json", children: JSON.stringify(faqLd) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
      ],
    };
  },
  loader: ({ params }) => {
    const tool = TOOLS_BY_SLUG[params.slug];
    if (!tool) throw notFound();
    return { tool };
  },
  component: ToolPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="font-display text-4xl font-bold">Tool not found</h1>
        <p className="mt-4 text-muted-foreground">
          That tool isn't in our toolkit. Browse all 30 tools instead.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </div>
    </div>
  ),
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  const Icon = tool.icon;
  const Component = TOOL_COMPONENTS[tool.slug];
  const isReady = tool.status === "ready";
  const content = getToolContent(tool.slug, tool.name);

  const related = TOOLS.filter(
    (t) => t.category === tool.category && t.slug !== tool.slug,
  ).slice(0, 4);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute top-1/2 right-0 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-[140px]" />
      </div>

      <Header />

      <section className="mx-auto max-w-4xl px-6 py-12">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">
            CrispPDF
          </Link>
          <span>/</span>
          <Link to="/" className="transition-colors hover:text-foreground">
            Tools
          </Link>
          <span>/</span>
          <span className="font-mono text-foreground">{tool.name}</span>
        </nav>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All tools
        </Link>

        <div className="relative mt-8 overflow-hidden rounded-3xl border border-border bg-surface/40 backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />

          <div className="relative p-7 md:p-10">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                  isReady
                    ? "border-success/40 bg-success/10 text-success"
                    : "border-warning/40 bg-warning/10 text-warning"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isReady ? "bg-success" : "bg-warning"
                  } animate-pulse`}
                />
                {isReady ? "Live" : "Coming soon"}
              </span>
              <span className="rounded-full border border-border bg-surface/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {tool.category.replace("-", " ")}
              </span>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                {tool.processing === "browser" ? "100% browser · private" : "server · privacy-respecting"}
              </span>
            </div>

            <RateLimitBanner slug={tool.slug} />

            {Component ? (
              <Suspense
                fallback={
                  <div className="flex min-h-[20rem] flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-surface/40 p-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Loading {tool.name}…
                    </p>
                  </div>
                }
              >
                <Component />
              </Suspense>
            ) : (
              <ToolShell
                title={tool.name}
                description={tool.description}
                icon={<Icon className="h-7 w-7 text-primary" />}
              >
                <ComingSoonTool
                  tool={tool}
                  multiple={tool.slug === "merge-pdf" || tool.slug.includes("to-pdf")}
                  accept={
                    tool.category === "convert-to" && tool.slug !== "html-to-pdf"
                      ? "image/*,application/pdf,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      : "application/pdf,.pdf"
                  }
                />
              </ToolShell>
            )}

          </div>
        </div>

        {/* HOW TO USE */}
        <div className="mt-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">// How to use</p>
          <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
            How to use {tool.name}
          </h2>
          <ol className="mt-6 space-y-3">
            {content.howTo.map((s, i) => (
              <li
                key={s.name}
                className="flex gap-4 rounded-xl border border-border/60 bg-surface/40 p-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-mono text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold">{s.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* WHY CRISPPDF */}
        <div className="mt-16 rounded-2xl border border-border/60 bg-surface/40 p-7 md:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">// Why CrispPDF</p>
          <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
            Why use CrispPDF for {tool.name.toLowerCase()}?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{content.why}</p>
          <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
            {[
              "No signup, no email gate",
              "No watermarks on output",
              "Files never stored on a server",
              "Works on phone, tablet, and desktop",
            ].map((p) => (
              <li key={p} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">// FAQ</p>
          <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
            {tool.name} — frequently asked questions
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {content.faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-border bg-surface/60 px-5 py-4 backdrop-blur-sm transition-colors hover:border-primary/60"
              >
                <summary className="cursor-pointer list-none font-display text-sm font-medium leading-snug">
                  <span className="mr-2 text-primary">+</span>
                  {f.q}
                </summary>
                <p className="mt-3 pl-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>

        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-xl font-semibold">You might also need</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
