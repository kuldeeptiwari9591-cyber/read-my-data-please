import { createFileRoute } from "@tanstack/react-router";
import { CategoryHub } from "@/components/seo/CategoryHub";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { breadcrumbLd } from "@/lib/seo/jsonld";

const TITLE = "Edit PDF — Crop, Watermark, Sign, OCR, Numbers | CrispPDF";
const DESC = "Edit PDFs free online: crop, add watermarks, sign, OCR, page numbers, extract images, edit metadata, and more. Browser-based, no signup.";

export const Route = createFileRoute("/edit-pdf")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: abs("/edit-pdf") },
      { property: "og:image", content: OG_DEFAULT },
    ],
    links: [{ rel: "canonical", href: abs("/edit-pdf") }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbLd([
      { name: "CrispPDF", url: abs("/") },
      { name: "Edit PDF", url: abs("/edit-pdf") },
    ])) }],
  }),
  component: () => (
    <CategoryHub
      category="edit"
      title="Edit PDF"
      answer="Eleven free PDF editors to crop, watermark, sign, OCR, add page numbers, extract images, compare files, and edit metadata — all without signup or upload."
      intro="Editing a PDF used to mean paying for Acrobat. CrispPDF offers a focused set of free editors that handle the 90% of edits real people actually need: a signature here, a watermark there, page numbers, OCR for scans."
    />
  ),
});
