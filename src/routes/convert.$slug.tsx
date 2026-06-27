import { createFileRoute, notFound } from "@tanstack/react-router";
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { TOOLS_BY_SLUG, TOOLS } from "@/lib/tools";
import { FORMAT_PAIRS_BY_SLUG } from "@/lib/pseo/formats";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { breadcrumbLd, questionLd, speakableLd } from "@/lib/seo/jsonld";

export const Route = createFileRoute("/convert/$slug")({
  head: ({ params }) => {
    const f = FORMAT_PAIRS_BY_SLUG[params.slug];
    if (!f) return { meta: [{ title: "Not found — CrispPDF" }] };
    const title = `${f.from} to ${f.to} Online Free — No Signup | CrispPDF`;
    const description = `Convert ${f.from} to ${f.to} free online. Runs in your browser — no upload, no signup, no watermark. ${f.blurb}`;
    const path = `/convert/${params.slug}`;
    const canonical = abs(path);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
        { property: "og:image", content: OG_DEFAULT },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_DEFAULT },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd([
          { name: "CrispPDF", url: abs("/") },
          { name: "Convert", url: abs("/convert") },
          { name: `${f.from} to ${f.to}`, url: canonical },
        ])) },
        { type: "application/ld+json", children: JSON.stringify(speakableLd(path)) },
        { type: "application/ld+json", children: JSON.stringify(questionLd(
          `How do I convert ${f.from} to ${f.to} for free?`,
          `Open CrispPDF's ${f.via ?? `${f.from} to ${f.to}`} tool in any modern browser, drop your ${f.fromExt} file, and download the ${f.toExt} result instantly — no signup, no watermark, runs locally on your device.`,
        )) },
      ],
    };
  },
  component: function FormatPage() {
    const { slug } = Route.useParams();
    const f = FORMAT_PAIRS_BY_SLUG[slug];
    if (!f) throw notFound();
    const tool = f.toolSlug ? TOOLS_BY_SLUG[f.toolSlug] : null;
    const related = TOOLS.filter((t) => t.category === "convert-to" || t.category === "convert-from").slice(0, 3);
    return (
      <PseoPageShell
        crumbs={[
          { name: "CrispPDF", to: "/" },
          { name: `${f.from} to ${f.to}` },
        ]}
        badge={`${f.from} → ${f.to}`}
        title={`Convert ${f.from} to ${f.to}`}
        answer={`Convert ${f.from} files to ${f.to} free in your browser. ${f.blurb} No signup, no watermark, no upload to a third-party server — works on desktop and mobile.`}
        intro={`${f.from} to ${f.to} conversion is one of the most common file tasks on the web. CrispPDF handles it without an account or an upload step, so confidential ${f.fromExt} files stay on your device. ${f.blurb}`}
        bullets={[
          "100% free — no daily limit",
          "Browser-based — files stay local",
          "No watermark or signup",
          "Works on mobile and desktop",
        ]}
        ctaTool={tool}
        ctaLabel={f.via ? `Open ${f.via}` : `Open the tool`}
        faqs={[
          { q: `Is ${f.from} to ${f.to} really free?`, a: `Yes. CrispPDF has no daily limits, no email gate, no watermark — for personal and commercial use.` },
          { q: `Is my ${f.fromExt} file uploaded anywhere?`, a: `For most conversions, no — the work happens in your browser. Server-assisted conversions process in memory and discard immediately.` },
          { q: `Will the output ${f.toExt} keep my formatting?`, a: `Yes — layout, images, and text formatting are preserved as faithfully as the source format allows.` },
        ]}
        related={related}
      />
    );
  },
});
