// Centralised JSON-LD builders for AEO / GEO.
import { abs, SITE_URL } from "@/lib/site-url";

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CrispPDF",
    url: SITE_URL,
    logo: abs("/og-default.svg"),
    sameAs: [
      "https://github.com/crisppdf",
      "https://x.com/crisppdf",
    ],
    description:
      "CrispPDF is a free, browser-first PDF toolkit. 40 tools — merge, split, compress, convert, sign, protect — with no signup, no watermarks, and no file uploads for most tools.",
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CrispPDF",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function speakableLd(path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: abs(path),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-speakable]", "h1", ".faq-q", ".faq-a"],
    },
  };
}

export function questionLd(q: string, a: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  };
}

export function breadcrumbLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
