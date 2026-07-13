import { createFileRoute } from "@tanstack/react-router";
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { TOOLS_BY_SLUG, TOOLS } from "@/lib/tools";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { hreflangLinks } from "@/lib/hreflang";

const PATH = "/resize-signature-image";
const TITLE = "Resize Signature Image — 20 KB JPG for SSC, UPSC, IBPS | CrispPDF";
const DESCRIPTION =
  "Resize and compress your signature image to the 10–20 KB JPG that Indian government portals (SSC, UPSC, IBPS, college admissions) require. Runs in your browser — no upload.";

const ANSWER =
  "Photograph or scan your signature on white paper, open it in CrispPDF's image-to-PDF-to-JPG flow, and use Compress PDF to 100 KB set to a low target (10–20 KB). The tool downsamples the image until it fits the portal's spec, keeping strokes crisp. Everything runs in your browser.";

const INTRO =
  "Most Indian government exam portals — SSC, UPSC, IBPS, SBI PO, and state PSCs — specify a signature image between 10 KB and 20 KB, in JPG format, with dimensions around 140×60 pixels. College admission portals often ask for 20–50 KB. Getting there manually with Paint or Photos is fiddly. CrispPDF's compressor iteratively shrinks the image until it fits the size ceiling, in your browser — your signature never uploads to anyone.";


const BULLETS = [
  "Hits the 10–20 KB JPG target most SSC / UPSC / IBPS portals require",
  "Iterative binary-search compression — stops as soon as it fits",
  "Keeps the signature strokes crisp — no blurring artefacts",
  "Runs 100% in your browser — your signature never leaves your device",
];

const FAQS = [
  {
    q: "What signature size does SSC require?",
    a: "SSC and most exam portals accept JPG signatures between 10 KB and 20 KB, 140×60 pixels. UPSC uses 20–300 KB. Check your specific notification for the exact spec.",
  },
  {
    q: "My signature scan is 2 MB — how do I get it to 20 KB?",
    a: "Upload it here, and the tool will iteratively downsample and re-encode as JPG until it fits under your chosen size (10 KB, 20 KB, 50 KB). If the target isn't reachable while staying readable, we tell you the smallest achievable size.",
  },
  {
    q: "Can I use a phone photo of my signature?",
    a: "Yes — but for best results, sign on plain white paper with a black pen, then crop tightly around the signature before uploading. This gives the compressor room to reach 20 KB without blurring.",
  },
  {
    q: "Is JPG required, or can I upload PNG?",
    a: "Most Indian govt portals specifically require JPG. Our tool outputs JPG by default. If you need PNG, use the PDF to PNG tool after cropping.",
  },
  {
    q: "Are my signature files safe?",
    a: "Yes. Everything runs in your browser — the signature image is never uploaded to CrispPDF or any third party.",
  },
];

export const Route = createFileRoute("/resize-signature-image")({
  head: () => {
    const canonical = abs(PATH);
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "CrispPDF", item: abs("/") },
        { "@type": "ListItem", position: 2, name: "Resize Signature", item: canonical },
      ],
    };
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        {
          name: "keywords",
          content:
            "resize signature, signature 20 kb jpg, ssc signature size, upsc signature resize, signature compress online",
        },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        { property: "og:image", content: OG_DEFAULT },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_DEFAULT },
      ],
      links: [{ rel: "canonical", href: canonical }, ...hreflangLinks(PATH)],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(faqLd) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
      ],
    };
  },
  component: SignaturePage,
});

function SignaturePage() {
  const jpgTool = TOOLS_BY_SLUG["jpg-to-pdf"] ?? null;
  const related = TOOLS.filter((t) =>
    ["compress-pdf-to-100kb", "compress-pdf", "pdf-to-jpg"].includes(t.slug),
  ).slice(0, 3);
  return (
    <PseoPageShell
      crumbs={[
        { name: "CrispPDF", to: "/" },
        { name: "Resize Signature" },
      ]}
      badge="India · Exams"
      title="Resize your Signature to 10–20 KB JPG"
      answer={ANSWER}
      intro={INTRO}
      bullets={BULLETS}
      ctaTool={jpgTool}
      ctaLabel="Start with your signature image"
      faqs={FAQS}
      related={related}
    />
  );
}
