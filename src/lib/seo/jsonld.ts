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

/**
 * SoftwareApplication JSON-LD for a tool page. Marks each tool as a free
 * web utility so Google can surface it in the SoftwareApplication carousel.
 */
export function softwareApplicationLd(opts: {
  name: string;
  slug: string;
  description: string;
  ratingValue?: number; // 1..5
  ratingCount?: number;
}) {
  const url = abs(`/${opts.slug}`);
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts.name,
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires a modern browser (Chrome, Edge, Firefox, Safari).",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: opts.description,
    publisher: {
      "@type": "Organization",
      name: "CrispPDF",
      url: SITE_URL,
    },
  };
  if (opts.ratingValue && opts.ratingCount) {
    base.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: opts.ratingValue,
      ratingCount: opts.ratingCount,
    };
  }
  return base;
}

/**
 * HowTo JSON-LD for step-by-step tool instructions.
 * Steps must match visible on-page content or Google will flag as spam.
 */
export function howToLd(opts: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
  totalTime?: string; // ISO 8601 duration, e.g. "PT30S"
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}
