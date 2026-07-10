import { createFileRoute } from "@tanstack/react-router";
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { TOOLS_BY_SLUG, TOOLS } from "@/lib/tools";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { hreflangLinks } from "@/lib/hreflang";

const PATH = "/aadhaar-pdf-password-remove";
const TITLE = "Remove Aadhaar PDF Password — Free Online (No Upload) | CrispPDF";
const DESCRIPTION =
  "Unlock the password from your e-Aadhaar PDF in your browser. The 8-character UIDAI password (first 4 letters of your name in caps + birth year) never leaves your device.";

const ANSWER =
  "Open the e-Aadhaar PDF in CrispPDF's Unlock PDF tool, enter the 8-character UIDAI password (first four letters of your name in CAPS followed by your birth year, e.g. RAHU1998), and download a clean, share-ready copy. Everything happens in your browser — the password and file never touch a server.";

const INTRO =
  "The e-Aadhaar PDF you download from uidai.gov.in is locked with an 8-character password: the first four letters of your name in uppercase followed by your year of birth (YYYY). Most Indian portals, KYC agents, and property offices refuse a password-protected file, so you need to remove the password before uploading or emailing it. CrispPDF unlocks it locally in your browser — the file and password never leave your device, which matters because Aadhaar contains your biometric identifier.";

const BULLETS = [
  "100% browser-based — the file and your Aadhaar password never leave your device",
  "Handles the standard UIDAI 8-character password format (RAHU1998, PRIY2001, etc.)",
  "Output is a normal, unlocked PDF you can email, upload, or print like any other PDF",
  "Works on any phone or laptop — no app install, no signup, no watermark",
];

const FAQS = [
  {
    q: "What is the password for my Aadhaar PDF?",
    a: "It's 8 characters: the first four letters of your name (as printed on Aadhaar) in CAPS, followed by your year of birth. If your name is Rahul Sharma born in 1998, the password is RAHU1998. For a name shorter than 4 letters like 'IAN', use the full name plus year (IAN1998).",
  },
  {
    q: "Is it safe to remove the password from my e-Aadhaar?",
    a: "Using CrispPDF, yes — the unlock happens entirely in your browser, so neither the file nor the password is ever uploaded. Never upload your Aadhaar to unknown websites; that's a real privacy risk.",
  },
  {
    q: "Can I remove the password if I forgot it?",
    a: "No. You need to know the password (the name+year formula above) to unlock the file. If the formula doesn't work, re-download the e-Aadhaar from uidai.gov.in and check the spelling of your name on the physical card.",
  },
  {
    q: "Will the unlocked PDF still be accepted for KYC?",
    a: "Yes. Removing the open-password does not modify the UIDAI digital signature on the document. Most banks, mutual-fund KYC portals, and property registrars specifically require a non-password-protected copy.",
  },
  {
    q: "Does this work for masked Aadhaar too?",
    a: "Yes. The masked e-Aadhaar (with the first 8 digits hidden) uses the same 8-character password and unlocks identically.",
  },
];

export const Route = createFileRoute("/aadhaar-pdf-password-remove")({
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
        { "@type": "ListItem", position: 2, name: "Unlock PDF", item: abs("/unlock-pdf") },
        { "@type": "ListItem", position: 3, name: "Aadhaar PDF", item: canonical },
      ],
    };
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        {
          name: "keywords",
          content:
            "aadhaar pdf password remove, e-aadhaar password unlock, uidai pdf password, aadhaar password format, aadhaar unlock online",
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
  component: AadhaarPage,
});

function AadhaarPage() {
  const unlock = TOOLS_BY_SLUG["unlock-pdf"] ?? null;
  const related = TOOLS.filter((t) =>
    ["protect-pdf", "compress-pdf-to-100kb", "compress-pdf", "pdf-to-jpg"].includes(t.slug),
  ).slice(0, 3);
  return (
    <PseoPageShell
      crumbs={[
        { name: "CrispPDF", to: "/" },
        { name: "Unlock PDF", to: "/unlock-pdf" },
        { name: "Aadhaar" },
      ]}
      badge="India · Aadhaar"
      title="Remove the Password from your e-Aadhaar PDF"
      answer={ANSWER}
      intro={INTRO}
      bullets={BULLETS}
      ctaTool={unlock}
      ctaLabel="Unlock Aadhaar PDF now"
      faqs={FAQS}
      related={related}
    />
  );
}
