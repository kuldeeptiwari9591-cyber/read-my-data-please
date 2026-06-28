// Single source of truth: every FAQPage JSON-LD on the site is built from
// the same array passed to <SeoAccordion items={...} />. This guarantees
// the rendered (SSR'd) Q&A matches the structured data Google validates.
import type { SeoFAQ } from "@/components/seo/SeoAccordion";

export function buildFaqJsonLd(items: SeoFAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function faqJsonLdScript(items: SeoFAQ[]) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify(buildFaqJsonLd(items)),
  };
}
