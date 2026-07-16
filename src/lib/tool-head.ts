import { TOOLS_BY_SLUG } from "@/lib/tools";
import { getToolContent } from "@/lib/tool-content";
import { abs, OG_DEFAULT, SITE_URL } from "@/lib/site-url";
import { hreflangLinks } from "@/lib/hreflang";
import { questionLd, speakableLd } from "@/lib/seo/jsonld";

const SITE_LAST_UPDATED = "2026-07-10";

// Category → schema hint for richer WebApplication classification.
const CATEGORY_SCHEMA: Record<string, string> = {
  organize: "BusinessApplication",
  "convert-from": "UtilitiesApplication",
  "convert-to": "UtilitiesApplication",
  edit: "DesignApplication",
  secure: "SecurityApplication",
};

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
  // Per-tool dynamic OG image so every tool has a distinct social preview.
  const ogImage = abs(`/og/${tool.slug}.svg`);
  void OG_DEFAULT;

  const publisher = {
    "@type": "Organization",
    name: "CrispPDF",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: abs("/crisppdf-logo.png"),
    },
  };

  const imageObject = {
    "@type": "ImageObject",
    url: ogImage,
    width: 1200,
    height: 630,
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    name: `${tool.name} — CrispPDF`,
    alternateName: tool.name,
    url: canonical,
    image: imageObject,
    applicationCategory: CATEGORY_SCHEMA[tool.category] ?? "UtilitiesApplication",
    applicationSubCategory: "PDF Tools",
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires JavaScript. Works in Chrome, Firefox, Safari, Edge, and mobile browsers.",
    permissions: tool.processing === "browser" ? "No file upload — runs entirely in your browser" : "Temporary in-memory processing",
    inLanguage: ["en", "en-IN", "hi"],
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "100% free — no signup, no watermarks, no daily limits",
      tool.processing === "browser"
        ? "Runs entirely in your browser — files never leave your device"
        : "Privacy-respecting — files processed in memory and discarded",
      "Works on mobile, tablet, and desktop",
      "Supports files up to 100 MB",
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Students, professionals, and businesses in India and worldwide",
      geographicArea: {
        "@type": "Country",
        name: "India",
      },
    },
    publisher,
    description,
    datePublished: "2025-11-01",
    dateModified: SITE_LAST_UPDATED,
    potentialAction: {
      "@type": "UseAction",
      target: canonical,
      name: `Use ${tool.name}`,
    },
  };
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.name}`,
    description: `Step-by-step guide to ${tool.name.toLowerCase()} on CrispPDF — free, no signup, no watermarks.`,
    image: imageObject,
    totalTime: "PT1M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "INR", value: "0" },
    tool: [{ "@type": "HowToTool", name: "Modern web browser" }],
    supply: [{ "@type": "HowToSupply", name: "PDF file" }],
    step: content.howTo.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${canonical}#step-${i + 1}`,
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
      {
        "@type": "ListItem",
        position: 2,
        name: `${tool.category.replace("-", " ")}`,
        item: abs(`/${tool.category === "convert-from" || tool.category === "convert-to" ? "convert-pdf" : tool.category === "organize" ? "organize-pdf" : tool.category === "edit" ? "edit-pdf" : "secure-pdf"}`),
      },
      { "@type": "ListItem", position: 3, name: tool.name, item: canonical },
    ],
  };

  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(content.keywords && content.keywords.length
        ? [{ name: "keywords", content: content.keywords.join(", ") }]
        : []),
      // India geo-targeting signals
      { name: "geo.region", content: "IN" },
      { name: "geo.placename", content: "India" },
      { name: "language", content: "en-IN" },
      { httpEquiv: "content-language", content: "en-IN" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "CrispPDF" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${tool.name} on CrispPDF` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@crisppdf" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
      { name: "twitter:image:alt", content: `${tool.name} on CrispPDF` },
    ],
    links: [{ rel: "canonical", href: canonical }, ...hreflangLinks(path)],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(webApp) },
      { type: "application/ld+json", children: JSON.stringify(howTo) },
      { type: "application/ld+json", children: JSON.stringify(faqLd) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
      { type: "application/ld+json", children: JSON.stringify(speakableLd(path)) },
      ...content.faqs.slice(0, 3).map((f) => ({
        type: "application/ld+json",
        children: JSON.stringify(questionLd(f.q, f.a)),
      })),
    ],
  };
}
