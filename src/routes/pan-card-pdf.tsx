import { createFileRoute } from "@tanstack/react-router";
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { TOOLS_BY_SLUG, TOOLS } from "@/lib/tools";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { hreflangLinks } from "@/lib/hreflang";

const PATH = "/pan-card-pdf";
const TITLE = "PAN Card PDF — Unlock, Compress & Convert Online | CrispPDF";
const DESCRIPTION =
  "Unlock the password on your e-PAN PDF (DDMMYYYY), compress it under 100 KB / 200 KB for income-tax and bank uploads, or convert PAN to JPG. Runs in your browser — file never uploads.";

const ANSWER =
  "Your e-PAN PDF from NSDL or UTIITSL is locked with your date of birth in DDMMYYYY format (a PAN born on 15 August 1990 uses 15081990). Open it in CrispPDF's Unlock PDF tool, then compress it to the size the portal wants (usually under 100 KB or 200 KB) or convert to JPG — all inside your browser, so your PAN number never leaves your device.";

const INTRO =
  "PAN card uploads follow strict size limits: Income Tax e-Filing, mutual-fund KYC (KRA), most banks, and college admissions typically cap PAN card scans at 100 KB or 200 KB. The e-PAN downloaded from NSDL or UTIITSL is also password-protected with your date of birth in DDMMYYYY format. CrispPDF handles both — unlocks, resizes, and converts your PAN PDF locally in your browser so your PAN number, name, and DOB are never uploaded to a third party.";

const BULLETS = [
  "Unlock the DDMMYYYY password on any NSDL or UTIITSL e-PAN PDF",
  "Compress under 100 KB or 200 KB for IT e-filing, KYC (KRA), and bank portals",
  "Convert PAN PDF to a single JPG for portals that reject PDFs",
  "Everything runs in your browser — no upload, so your PAN never leaves your device",
];

const FAQS = [
  {
    q: "What is the password for my e-PAN PDF?",
    a: "Your date of birth in DDMMYYYY format with no slashes or spaces. For 15 August 1990 the password is 15081990. This is the same for NSDL and UTIITSL e-PAN downloads.",
  },
  {
    q: "What file size does the Income Tax portal accept?",
    a: "The Income Tax e-Filing portal typically accepts PAN uploads up to 500 KB, but KYC (KRA), CAMS, and many bank portals cap at 100 KB or 200 KB. Use the size-specific compressors linked below to match your portal's requirement.",
  },
  {
    q: "Can I upload the password-protected PAN PDF directly?",
    a: "No. Almost every Indian govt/bank portal rejects password-protected PDFs. Unlock it first with the tool above, then compress if needed.",
  },
  {
    q: "Is this safe? Will you see my PAN?",
    a: "No. CrispPDF processes the file entirely in your browser — nothing is uploaded to our servers. Your PAN number, name, and DOB never leave your device.",
  },
  {
    q: "Can I convert PAN PDF to JPG for portals that only accept images?",
    a: "Yes. Use the PDF to JPG tool — it converts each PAN PDF page to a JPG image, right in your browser.",
  },
];

export const Route = createFileRoute("/pan-card-pdf")({
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
        { "@type": "ListItem", position: 2, name: "PAN Card PDF", item: canonical },
      ],
    };
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        {
          name: "keywords",
          content:
            "pan card pdf, e-pan password remove, pan card pdf compress, pan pdf under 100kb, pan pdf under 200kb, pan pdf to jpg",
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
  component: PanPage,
});

function PanPage() {
  const unlock = TOOLS_BY_SLUG["unlock-pdf"] ?? null;
  const related = TOOLS.filter((t) =>
    ["compress-pdf-to-100kb", "compress-pdf-to-200kb", "pdf-to-jpg"].includes(t.slug),
  ).slice(0, 3);
  return (
    <PseoPageShell
      crumbs={[
        { name: "CrispPDF", to: "/" },
        { name: "PAN Card PDF" },
      ]}
      badge="India · PAN"
      title="Unlock, Compress & Convert your PAN Card PDF"
      answer={ANSWER}
      intro={INTRO}
      bullets={BULLETS}
      ctaTool={unlock}
      ctaLabel="Unlock PAN PDF now"
      faqs={FAQS}
      related={related}
    />
  );
}
