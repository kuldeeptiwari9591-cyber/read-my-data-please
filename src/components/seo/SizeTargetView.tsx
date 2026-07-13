// Shared view + head builder for /compress-pdf-to-{size} pages.
// Each size has its own static route file so TanStack Router actually
// matches the URL (prefixed `$param` segments don't match).
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { SIZE_TARGETS_BY_SLUG } from "@/lib/pseo/size-targets";
import { TOOLS_BY_SLUG, TOOLS } from "@/lib/tools";
import { CompressPdf } from "@/components/tools/CompressPdf";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { hreflangLinks } from "@/lib/hreflang";

export function sizeTargetHead(slug: string) {
  const target = SIZE_TARGETS_BY_SLUG[slug];
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
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "CrispPDF", item: abs("/") },
      { "@type": "ListItem", position: 2, name: "Compress PDF", item: abs("/compress-pdf") },
      { "@type": "ListItem", position: 3, name: `Compress PDF to ${target.label}`, item: canonical },
    ],
  };
  return {
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content: `compress pdf to ${target.slug}, reduce pdf to ${target.slug}, pdf compressor ${target.slug}, shrink pdf to ${target.label.toLowerCase()}`,
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_DEFAULT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_DEFAULT },
    ],
    links: [{ rel: "canonical", href: canonical }, ...hreflangLinks(path)],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(faqLd) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
    ],
  };
}

export function SizeTargetView({ slug }: { slug: string }) {
  const target = SIZE_TARGETS_BY_SLUG[slug];
  if (!target) {
    return <div className="p-10 text-sm text-muted-foreground">Size target not configured.</div>;
  }
  const compress = TOOLS_BY_SLUG["compress-pdf"] ?? null;
  const related = TOOLS.filter((t) =>
    ["merge-pdf", "split-pdf", "pdf-to-jpg", "extract-pdf-pages"].includes(t.slug),
  ).slice(0, 3);
  return (
    <PseoPageShell
      crumbs={[
        { name: "CrispPDF", to: "/" },
        { name: "Compress PDF", to: "/compress-pdf" },
        { name: `to ${target.label}` },
      ]}
      badge="Size target"
      title={`Compress PDF to ${target.label} Online — Free, No Upload`}
      answer={`To compress a PDF to ${target.label} or less, open CrispPDF's Compress PDF tool, pick the ${target.label} preset, and download. The tool downsamples images and strips unused metadata until your file fits. Runs entirely in your browser — no upload, no signup, no watermark.`}
      intro={target.intro}
      bullets={target.bullets}
      ctaTool={compress}
      ctaLabel={`Compress to ${target.label} now`}
      faqs={target.faq}
      related={related}
    >
      <div className="mt-8">
        <CompressPdf targetKB={Math.round(target.bytes / 1024)} targetLabel={target.label} />
      </div>
    </PseoPageShell>
  );
}
