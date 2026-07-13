import { createFileRoute } from "@tanstack/react-router";
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { TOOLS_BY_SLUG } from "@/lib/tools";
import { abs } from "@/lib/site-url";

const SLUG = "pdf-to-jpg-passport-size";
const TITLE = "PDF to JPG Passport Size — India, Free & Browser-Only";
const META =
  "Extract your passport-size photo from a PDF as a JPG at the exact 35 × 45 mm (or 3.5 × 4.5 cm) dimensions required by Indian passport, PAN, and exam forms. Free, no upload.";
const ANSWER =
  "Passport-size photos in India are 35 × 45 mm (3.5 × 4.5 cm) at 300 DPI — roughly 413 × 531 pixels. Use CrispPDF's PDF-to-JPG tool to extract the photo page from your PDF, then Crop Image to the exact ratio. Runs in your browser — your passport photo never leaves your device.";
const BULLETS = [
  "Standard Indian passport photo: 35 × 45 mm at 300 DPI",
  "That's 413 × 531 pixels for print, or ~200 × 250 for online forms",
  "Extract from any PDF page as high-resolution JPG",
  "Crop to exact passport aspect ratio in-browser",
  "Free, no upload, no watermark",
];
const FAQS = [
  {
    q: "What is the standard passport photo size in India?",
    a: "35 × 45 mm (3.5 × 4.5 cm) at 300 DPI for print, which is 413 × 531 pixels. Background must be plain white with no shadows. Face should cover 70–80% of the frame.",
  },
  {
    q: "What size do UPSC, SSC, IBPS want for the passport photo?",
    a: "UPSC: 20 KB to 300 KB, dimensions between 110 × 140 and 350 × 450 pixels. SSC: 20 KB to 50 KB, 3.5 × 4.5 cm. IBPS: 20 KB to 50 KB, 200 × 230 pixels.",
  },
  {
    q: "Can I convert a PDF photo back to JPG at passport dimensions?",
    a: "Yes — use CrispPDF's PDF-to-JPG tool to extract the image, then Crop Image to 35 × 45 mm (or the exact pixel dimensions the form asks for). Both run in your browser.",
  },
  {
    q: "Does CrispPDF upload my photo?",
    a: "No. PDF-to-JPG and Crop Image both run 100% in your browser via WebAssembly. Your photo is never uploaded, logged, or stored.",
  },
  {
    q: "The form asks for JPG but my file is PDF. What do I do?",
    a: "Open CrispPDF's PDF-to-JPG tool, drop the PDF, and download the extracted JPG. If the file is over the form's KB cap, run it through Compress Image afterwards.",
  },
];

export const Route = createFileRoute("/pdf-to-jpg-passport-size")({
  head: () => {
    const canonical = abs(`/${SLUG}`);
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
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
        { "@type": "ListItem", position: 2, name: "PDF to JPG (Passport Size)", item: canonical },
      ],
    };
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: META },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: META },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(faqLd) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
      ],
    };
  },
  component: PdfJpgPassportPage,
});

function PdfJpgPassportPage() {
  const pdfToJpg = TOOLS_BY_SLUG["pdf-to-jpg"] ?? null;
  const cropImage = TOOLS_BY_SLUG["crop-image"] ?? TOOLS_BY_SLUG["crop-pdf"] ?? null;
  const compressImage = TOOLS_BY_SLUG["compress-image"] ?? null;
  const related = [pdfToJpg, cropImage, compressImage].filter(Boolean) as NonNullable<
    typeof pdfToJpg
  >[];
  return (
    <PseoPageShell
      crumbs={[
        { name: "CrispPDF", to: "/" },
        { name: "PDF to JPG (Passport Size)" },
      ]}
      badge="India · Passport photo"
      title={TITLE}
      answer={ANSWER}
      intro="Indian passport, PAN, and exam-application forms want a very specific photo: 35 × 45 mm on plain white, with your face filling most of the frame. If yours is trapped inside a PDF, extract it and crop it to spec — CrispPDF does both without uploading anything."
      bullets={BULLETS}
      ctaTool={pdfToJpg}
      ctaLabel="Open PDF to JPG"
      faqs={FAQS}
      related={related}
    />
  );
}
