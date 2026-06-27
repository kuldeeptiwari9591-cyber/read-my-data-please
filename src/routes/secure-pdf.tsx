import { createFileRoute } from "@tanstack/react-router";
import { CategoryHub } from "@/components/seo/CategoryHub";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { breadcrumbLd } from "@/lib/seo/jsonld";

const TITLE = "Secure PDF — Protect, Unlock, Redact, Flatten | CrispPDF";
const DESC = "Free tools to secure PDF files: password-protect, unlock, redact, flatten, and PDF/A archive. No signup, no upload — your confidential files stay local.";

export const Route = createFileRoute("/secure-pdf")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: abs("/secure-pdf") },
      { property: "og:image", content: OG_DEFAULT },
    ],
    links: [{ rel: "canonical", href: abs("/secure-pdf") }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbLd([
      { name: "CrispPDF", url: abs("/") },
      { name: "Secure PDF", url: abs("/secure-pdf") },
    ])) }],
  }),
  component: () => (
    <CategoryHub
      category="secure"
      title="Secure PDF"
      answer="Five free PDF security tools: password protect, unlock, redact, flatten form fields, and convert to PDF/A archive format. Browser-based — your confidential files never leave your device."
      intro="When the content is sensitive — contracts, medical records, tax documents — uploading to a SaaS converter is the wrong answer. CrispPDF's secure-PDF toolkit runs locally so privileged material stays privileged."
    />
  ),
});
