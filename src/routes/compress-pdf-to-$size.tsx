// Programmatic SEO: dynamic compression-to-target landing page.
// /compress-pdf-to-100kb, /compress-pdf-to-200kb, etc.
// Built from src/lib/pseo/size-targets.ts. Routes to the canonical compress
// tool for the actual processing.
import { createFileRoute, notFound } from "@tanstack/react-router";
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { SIZE_TARGETS_BY_SLUG, SIZE_TARGETS } from "@/lib/pseo/size-targets";
import { TOOLS_BY_SLUG, TOOLS } from "@/lib/tools";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/compress-pdf-to-$size")({
  head: ({ params }) => {
    const target = SIZE_TARGETS_BY_SLUG[params.size];
    if (!target) return { meta: [{ title: "Not found — CrispPDF" }] };
    const path = `/compress-pdf-to-${target.slug}`;
    const canonical = abs(path);
    const title = `Compress PDF to ${target.label} — Free Online | CrispPDF`;
    const description = `Compress any PDF down to ${target.label} or smaller in your browser. Perfect for government forms, email, and WhatsApp. No upload, no signup, no watermark.`;
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: target.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: `compress pdf to ${target.slug}, reduce pdf to ${target.slug}, pdf compressor ${target.slug}` },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        { property: "og:image", content: OG_DEFAULT },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_DEFAULT },
      ],
      links: [{ rel: "canonical", href: canonical }, ...hreflangLinks(path)],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(faqLd) }],
    };
  },
  loader: ({ params }) => {
    const target = SIZE_TARGETS_BY_SLUG[params.size];
    if (!target) throw notFound();
    return { target };
  },
  component: SizeTargetPage,
});

function SizeTargetPage() {
  const { target } = Route.useLoaderData();
  const compress = TOOLS_BY_SLUG["compress-pdf"] ?? null;
  const related = TOOLS.filter((t) =>
    ["merge-pdf", "split-pdf", "pdf-to-jpg", "extract-pdf-pages", "compress-pdf"].includes(t.slug) && t.slug !== "compress-pdf",
  ).slice(0, 3);

  return (
    <PseoPageShell
      crumbs={[
        { name: "CrispPDF", to: "/" },
        { name: "Compress PDF", to: "/compress-pdf" },
        { name: `to ${target.label}` },
      ]}
      badge="pSEO · Size target"
      title={`Compress PDF to ${target.label} Online — Free, No Upload`}
      answer={`To compress a PDF to ${target.label} or less, open CrispPDF's Compress PDF tool, pick the ${target.label} preset, and download. The tool downsamples images and strips unused metadata until your file fits. Runs entirely in your browser — no upload, no signup, no watermark.`}
      intro={target.intro}
      bullets={target.bullets}
      ctaTool={compress}
      ctaLabel={`Compress to ${target.label} now`}
      faqs={target.faq}
      related={related}
    />
  );
}
