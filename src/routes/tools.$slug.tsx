import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS, TOOLS_BY_SLUG } from "@/lib/tools";
import { TOOL_COMPONENTS } from "@/components/tools";
import { ToolShell } from "@/components/tools/ToolShell";
import { ComingSoonTool } from "@/components/tools/ComingSoonTool";

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
  const isReady = tool.status === "ready";

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
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
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
            <div className="mb-6 flex items-center gap-2">
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
                100% browser · private
              </span>
            </div>

            {Component ? (
              <Component />
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
