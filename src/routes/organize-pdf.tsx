import { createFileRoute } from "@tanstack/react-router";
import { CategoryHub } from "@/components/seo/CategoryHub";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { breadcrumbLd } from "@/lib/seo/jsonld";

const TITLE = "Organize PDF — Merge, Split, Compress & Reorder Pages | CrispPDF";
const DESC = "Free online tools to organize PDF files: merge, split, compress, rotate, reorder, delete, and extract pages. Browser-based, no signup, no watermark.";

export const Route = createFileRoute("/organize-pdf")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: abs("/organize-pdf") },
      { property: "og:image", content: OG_DEFAULT },
    ],
    links: [{ rel: "canonical", href: abs("/organize-pdf") }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbLd([
      { name: "CrispPDF", url: abs("/") },
      { name: "Organize PDF", url: abs("/organize-pdf") },
    ])) }],
  }),
  component: () => (
    <CategoryHub
      category="organize"
      title="Organize PDF"
      answer="Twelve free organize-PDF tools to merge, split, compress, rotate, reorder, delete, and extract pages — all running in your browser. No signup, no watermark, no upload."
      intro="Reorganising a PDF is the most common task users hit: combining receipts, splitting a long report, dropping pages from a scanned document. CrispPDF gives you twelve focused tools that each do one thing well — without bundling them behind a subscription."
    />
  ),
});
