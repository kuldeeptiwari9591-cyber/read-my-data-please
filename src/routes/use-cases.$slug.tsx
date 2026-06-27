import { createFileRoute, notFound } from "@tanstack/react-router";
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { TOOLS_BY_SLUG, TOOLS } from "@/lib/tools";
import { USE_CASES_BY_SLUG, parseUseCasePair } from "@/lib/pseo/use-cases";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { breadcrumbLd, questionLd, speakableLd } from "@/lib/seo/jsonld";

function resolve(slug: string) {
  const parsed = parseUseCasePair(slug);
  if (!parsed) return null;
  const tool = TOOLS_BY_SLUG[parsed.toolSlug];
  const uc = USE_CASES_BY_SLUG[parsed.useCaseSlug];
  if (!tool || !uc) return null;
  if (!uc.toolSlugs.includes(tool.slug)) return null;
  return { tool, useCase: uc };
}

export const Route = createFileRoute("/use-cases/$slug")({
  head: ({ params }) => {
    const r = resolve(params.slug);
    if (!r) return { meta: [{ title: "Not found — CrispPDF" }] };
    const { tool, useCase } = r;
    const title = `${tool.name} for ${useCase.label} — Free Online | CrispPDF`;
    const description = `Use ${tool.name} for ${useCase.label.toLowerCase()}. Free, browser-based, no signup, no watermarks. Built specifically for the ${useCase.label.toLowerCase()} workflow.`;
    const path = `/use-cases/${params.slug}`;
    const canonical = abs(path);
    const faqs = [
      { q: `Is ${tool.name} for ${useCase.label.toLowerCase()} really free?`, a: `Yes. CrispPDF is 100% free with no daily limits, no signup, and no watermark — for personal and commercial use.` },
      { q: `Are my files safe?`, a: tool.processing === "browser"
        ? `Yes. ${tool.name} runs entirely in your browser — files never reach our servers.`
        : `Yes. Files are processed in memory on our server and discarded immediately — never stored or logged.` },
      { q: `Do I need to install anything?`, a: `No. Open the page in any modern browser on desktop or mobile and start using it.` },
    ];
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        { property: "og:image", content: OG_DEFAULT },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_DEFAULT },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd([
          { name: "CrispPDF", url: abs("/") },
          { name: tool.name, url: abs(`/${tool.slug}`) },
          { name: useCase.label, url: canonical },
        ])) },
        { type: "application/ld+json", children: JSON.stringify(speakableLd(path)) },
        ...faqs.map((f) => ({ type: "application/ld+json", children: JSON.stringify(questionLd(f.q, f.a)) })),
      ],
    };
  },
  component: function UseCasePage() {
    const { slug } = Route.useParams();
    const r = resolve(slug);
    if (!r) throw notFound();
    const { tool, useCase } = r;
    const related = TOOLS.filter((t) => useCase.toolSlugs.includes(t.slug) && t.slug !== tool.slug).slice(0, 3);
    const answer = `${tool.name} on CrispPDF is the fastest free way to ${tool.short.toLowerCase()} for ${useCase.label.toLowerCase()}. Runs in your browser, no signup, no watermark, no file uploaded to a third-party server.`;
    return (
      <PseoPageShell
        crumbs={[
          { name: "CrispPDF", to: "/" },
          { name: tool.name, to: `/${tool.slug}` },
          { name: `for ${useCase.label}` },
        ]}
        badge={`${useCase.label} use-case`}
        title={`${tool.name} for ${useCase.label}`}
        answer={answer}
        intro={useCase.intro(tool.name)}
        bullets={useCase.benefits}
        ctaTool={tool}
        ctaLabel={`Open ${tool.name}`}
        faqs={[
          { q: `Is ${tool.name} for ${useCase.label.toLowerCase()} really free?`, a: `Yes. CrispPDF is 100% free with no daily limits, no signup, and no watermark — for personal and commercial use.` },
          { q: `Are my files safe?`, a: tool.processing === "browser" ? `Yes. ${tool.name} runs entirely in your browser — files never reach our servers.` : `Yes. Files are processed in memory and discarded immediately.` },
          { q: `Do I need to install anything?`, a: `No. Open the page in any modern browser on desktop or mobile.` },
        ]}
        related={related}
      />
    );
  },
});
