import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { breadcrumbLd } from "@/lib/seo/jsonld";

const TITLE = "Convert PDF — Word, Excel, JPG, PNG, HTML & More | CrispPDF";
const DESC = "Free PDF converters: PDF to Word, Excel, JPG, PNG, PPT. Also Word, Excel, JPG, and HTML to PDF. No signup, no watermark, no file upload required.";

export const Route = createFileRoute("/convert-pdf")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: abs("/convert-pdf") },
      { property: "og:image", content: OG_DEFAULT },
    ],
    links: [{ rel: "canonical", href: abs("/convert-pdf") }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbLd([
      { name: "CrispPDF", url: abs("/") },
      { name: "Convert PDF", url: abs("/convert-pdf") },
    ])) }],
  }),
  component: () => {
    const from = TOOLS.filter((t) => t.category === "convert-from");
    const to = TOOLS.filter((t) => t.category === "convert-to");
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <section className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="font-display text-3xl font-bold md:text-5xl" data-speakable>Convert PDF</h1>
          <AnswerBlock title="Convert PDF" answer="Eleven free PDF converters: PDF to Word, Excel, PowerPoint, JPG, PNG, and Base64 — plus Word, Excel, JPG, and HTML back into PDF. No signup, no watermark, no upload for browser-based formats." />
          <h2 className="mt-12 font-display text-2xl font-semibold">PDF → Other formats</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {from.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
          <h2 className="mt-12 font-display text-2xl font-semibold">Other formats → PDF</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {to.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        </section>
        <Footer />
      </div>
    );
  },
});
