import { createFileRoute } from "@tanstack/react-router";
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { TOOLS_BY_SLUG } from "@/lib/tools";
import { abs } from "@/lib/site-url";

const SLUG = "pan-card-pdf";
const TITLE = "PAN Card PDF — Unlock, Compress & Convert (India)";
const META =
  "Unlock your e-PAN PDF password (DOB in DDMMYYYY), compress it under 100 KB for Income Tax portals, or convert PAN photo to PDF. Free, browser-only.";
const ANSWER =
  "The e-PAN PDF you get from Protean/UTIITSL is password-protected. The password is your date of birth in DDMMYYYY format (e.g. born 15 August 1990 → 15081990). Use CrispPDF's Unlock PDF to remove the password, Compress PDF to hit the 100 KB / 200 KB caps that ITR and portal uploads demand, or JPG-to-PDF to bundle a scanned PAN into a single file — all in your browser.";
const BULLETS = [
  "e-PAN password: DOB in DDMMYYYY (15/08/1990 → 15081990)",
  "Compress PAN PDF under 100 KB, 200 KB, or 500 KB for ITR uploads",
  "Convert photo of PAN card to PDF in one click",
  "Browser-only — your PAN never leaves your device",
  "No signup, no watermark, no size cap on the source file",
];
const FAQS = [
  {
    q: "What is the password for e-PAN PDF?",
    a: "It is your date of birth in DDMMYYYY format — no slashes or dashes. Example: born 5 January 1992 → 05011992. This applies to e-PANs issued by both Protean (NSDL) and UTIITSL.",
  },
  {
    q: "What size should a PAN card PDF be for ITR filing?",
    a: "The Income Tax e-filing portal (incometax.gov.in) usually accepts PAN-related PDF/JPG uploads up to 5 MB. Some banks and DSC issuers cap PAN uploads at 100–500 KB — use CrispPDF's Compress PDF tool with the matching target.",
  },
  {
    q: "Can I convert a photo of my PAN card to PDF?",
    a: "Yes — open CrispPDF's JPG-to-PDF tool, drop the photo (front + back if needed), and download a single PDF. Runs entirely in your browser.",
  },
  {
    q: "Is my PAN data safe with CrispPDF?",
    a: "Yes. Every tool that touches your PAN — unlock, compress, JPG-to-PDF — runs 100% in your browser via WebAssembly. Nothing is uploaded, logged, or stored.",
  },
  {
    q: "Why do banks and portals reject my PAN PDF?",
    a: "The two most common reasons: (1) the PDF is still password-protected — unlock it first, (2) the file is over the portal's size cap — compress it to the exact KB the form requests.",
  },
];

export const Route = createFileRoute("/pan-card-pdf")({
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
        { "@type": "ListItem", position: 2, name: "PAN Card PDF", item: canonical },
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
  component: PanPage,
});

function PanPage() {
  const unlock = TOOLS_BY_SLUG["unlock-pdf"] ?? null;
  const compress = TOOLS_BY_SLUG["compress-pdf"] ?? null;
  const jpgToPdf = TOOLS_BY_SLUG["jpg-to-pdf"] ?? null;
  const related = [unlock, compress, jpgToPdf].filter(Boolean) as NonNullable<typeof unlock>[];
  return (
    <PseoPageShell
      crumbs={[
        { name: "CrispPDF", to: "/" },
        { name: "PAN Card PDF" },
      ]}
      badge="India · PAN"
      title={TITLE}
      answer={ANSWER}
      intro="Every Indian salaried person eventually needs to upload their PAN as a PDF — for ITR, for a bank KYC refresh, for a DSC application. Portals differ in what they want: some need it unlocked, some need it under 100 KB, some want a scan converted from JPG. CrispPDF covers all three without asking you to upload your PAN anywhere."
      bullets={BULLETS}
      ctaTool={compress}
      ctaLabel="Open Compress PDF"
      faqs={FAQS}
      related={related}
    />
  );
}
