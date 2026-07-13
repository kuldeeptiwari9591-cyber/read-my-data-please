import { createFileRoute } from "@tanstack/react-router";
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { TOOLS_BY_SLUG } from "@/lib/tools";
import { abs } from "@/lib/site-url";

const SLUG = "resize-signature-image";
const TITLE = "Resize Signature to 10 KB / 20 KB — UPSC, SSC, IBPS";
const META =
  "Resize your signature photo to exactly 10 KB, 20 KB, or 50 KB for UPSC, SSC, IBPS, EPFO, and passport forms. Free, browser-only — signature never uploaded.";
const ANSWER =
  "Indian government portals want signatures at very specific sizes — UPSC accepts 1 KB to 40 KB, SSC wants 10 KB to 20 KB, IBPS wants 10 KB to 20 KB. Use CrispPDF's Compress Image tool to shrink your signature JPG to the exact KB target the form asks for. Runs entirely in your browser; your signature never leaves your device.";
const BULLETS = [
  "Hit exact size targets: 10 KB, 20 KB, 50 KB",
  "Maintains signature legibility at target size",
  "Runs 100% in your browser — signature never uploaded",
  "Works for UPSC, SSC, IBPS, EPFO, passport seva, DigiLocker",
  "Free, no signup, no watermark",
];
const FAQS = [
  {
    q: "What size does UPSC want for the signature?",
    a: "UPSC accepts JPG signatures between 1 KB and 40 KB with dimensions between 110 × 40 pixels (min) and 160 × 60 pixels (max). White background, black ink.",
  },
  {
    q: "What size does SSC want for the signature?",
    a: "SSC (Staff Selection Commission) accepts signatures between 10 KB and 20 KB in JPG format, 4 cm × 2 cm, on a white background.",
  },
  {
    q: "What size does IBPS want?",
    a: "IBPS bank exams accept signatures between 10 KB and 20 KB, dimensions 140 × 60 pixels, JPG format, white background.",
  },
  {
    q: "My signature is already small but the form still rejects it. Why?",
    a: "Common reasons: (1) wrong format (must be JPG, not PNG), (2) wrong background (must be white, not transparent or off-white), (3) wrong aspect ratio, (4) file is too small (under the KB floor). Re-scan or re-shoot on white paper, then resize.",
  },
  {
    q: "Is my signature safe with CrispPDF?",
    a: "Yes. Compress Image runs 100% in your browser via WebAssembly — nothing is uploaded to a server, nothing is logged.",
  },
];

export const Route = createFileRoute("/resize-signature-image")({
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
        { "@type": "ListItem", position: 2, name: "Resize Signature Image", item: canonical },
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
  component: SignaturePage,
});

function SignaturePage() {
  const compressImage = TOOLS_BY_SLUG["compress-image"] ?? TOOLS_BY_SLUG["image-compress"] ?? null;
  const jpgToPdf = TOOLS_BY_SLUG["jpg-to-pdf"] ?? null;
  const compressPdf = TOOLS_BY_SLUG["compress-pdf"] ?? null;
  const related = [compressImage, jpgToPdf, compressPdf].filter(Boolean) as NonNullable<
    typeof compressImage
  >[];
  return (
    <PseoPageShell
      crumbs={[
        { name: "CrispPDF", to: "/" },
        { name: "Resize Signature" },
      ]}
      badge="India · Signature"
      title={TITLE}
      answer={ANSWER}
      intro="Every Indian government exam form has its own signature spec — different KB floor, different KB ceiling, different pixel dimensions. Get any of them wrong and the form rejects your submission at the last step. CrispPDF's Compress Image tool lets you hit the exact KB target, all in your browser."
      bullets={BULLETS}
      ctaTool={compressImage}
      ctaLabel="Open Compress Image"
      faqs={FAQS}
      related={related}
    />
  );
}
