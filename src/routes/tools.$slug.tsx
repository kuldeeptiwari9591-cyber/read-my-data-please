import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Construction, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS, TOOLS_BY_SLUG } from "@/lib/tools";
import { TOOL_COMPONENTS } from "@/components/tools";
import { ToolShell } from "@/components/tools/ToolShell";

export const Route = createFileRoute("/tools/$slug")({
  head: ({ params }) => {
    const tool = TOOLS_BY_SLUG[params.slug];
    if (!tool) {
      return { meta: [{ title: "Tool not found — CrispPDF" }] };
    }
    return {
      meta: [
        { title: `${tool.name} — Free Online ${tool.name} Tool · CrispPDF` },
        { name: "description", content: tool.description },
        { property: "og:title", content: `${tool.name} — CrispPDF` },
        { property: "og:description", content: tool.description },
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

      <section className="mx-auto max-w-4xl px-6 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All tools
        </Link>

        <div className="mt-8">
          {Component ? (
            <Component />
          ) : (
            <ToolShell
              title={tool.name}
              description={tool.description}
              icon={<Icon className="h-7 w-7 text-primary" />}
            >
              <GlassCard className="p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 ring-1 ring-primary/30">
                  <Construction className="h-6 w-6 text-primary" />
                </div>
                <h2 className="mt-6 font-display text-2xl font-semibold">Coming soon</h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                  This tool needs additional libraries (server-side conversion or OCR). It's on the
                  build list — shipping in a follow-up phase.
                </p>
                <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Queued
                </div>
              </GlassCard>
            </ToolShell>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h3 className="font-display text-xl font-semibold">You might also need</h3>
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
