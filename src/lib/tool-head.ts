import { TOOLS_BY_SLUG } from "@/lib/tools";
import { getToolContent } from "@/lib/tool-content";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { hreflangLinks } from "@/lib/hreflang";

export function buildToolHead(slug: string) {
  const tool = TOOLS_BY_SLUG[slug];
  if (!tool) {
    return { meta: [{ title: "Tool not found — CrispPDF" }] };
  }
  const content = getToolContent(tool.slug, tool.name);
  const path = `/${tool.slug}`;
  const title =
    content.seoTitle ?? `${tool.name} — Free Online ${tool.name} Tool · CrispPDF`;
  const description = content.seoDescription ?? tool.description;
  const canonical = abs(path);

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.name} — CrispPDF`,
    url: canonical,
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
      { "@type": "ListItem", position: 1, name: "CrispPDF", item: abs("/") },
      { "@type": "ListItem", position: 2, name: tool.name, item: canonical },
    ],
  };

  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(content.keywords && content.keywords.length
        ? [{ name: "keywords", content: content.keywords.join(", ") }]
        : []),
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_DEFAULT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: OG_DEFAULT },
    ],
    links: [{ rel: "canonical", href: canonical }, ...hreflangLinks(path)],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(webApp) },
      { type: "application/ld+json", children: JSON.stringify(howTo) },
      { type: "application/ld+json", children: JSON.stringify(faqLd) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
    ],
  };
}
