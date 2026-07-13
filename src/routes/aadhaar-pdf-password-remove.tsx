import { createFileRoute, Link } from "@tanstack/react-router";
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { TOOLS_BY_SLUG } from "@/lib/tools";
import { abs } from "@/lib/site-url";

const SLUG = "aadhaar-pdf-password-remove";
const TITLE = "Remove Aadhaar PDF Password — Free, Browser-Only";
const META =
  "Unlock your e-Aadhaar PDF using your UIDAI-issued password (first 4 letters of your name in CAPS + year of birth). Runs in your browser — the file never leaves your device.";
const ANSWER =
  "The e-Aadhaar PDF you download from UIDAI is encrypted with an 8-character password: the first four letters of your name in CAPS followed by your year of birth (e.g. RAHU1998). Open CrispPDF's Unlock PDF tool, drop in the file, type that password, and download the unlocked copy. Everything runs in your browser — your Aadhaar never touches a server.";
const BULLETS = [
  "UIDAI password format: first 4 letters of NAME (CAPS) + YYYY",
  "Runs 100% in your browser — Aadhaar never uploaded",
  "Removes the open password so any reader can view the file",
  "Free, no signup, no watermark on the output",
  "Works with e-Aadhaar, mAadhaar downloads, and DigiLocker PDFs",
];
const FAQS = [
  {
    q: "What is the password for an e-Aadhaar PDF?",
    a: "It is the first four letters of your name (as printed on the Aadhaar card) in CAPITAL letters, followed by your year of birth (YYYY). Example: name RAJESH KUMAR born 1985 → RAJE1985. Name shorter than 4 letters: use the whole name in caps + YYYY.",
  },
  {
    q: "Is it safe to remove the Aadhaar PDF password?",
    a: "Only remove it on a device you control (your own laptop or phone), and only if you need to attach the PDF to a form that cannot handle password-protected files. CrispPDF processes the file locally in your browser, so nothing is uploaded — but the resulting unlocked PDF should still be handled carefully.",
  },
  {
    q: "Can I unlock the Aadhaar PDF without the password?",
    a: "No. UIDAI encryption uses your name and DOB as the key. If you don't know either, download a fresh copy from https://myaadhaar.uidai.gov.in — you will need OTP verification on your registered mobile number.",
  },
  {
    q: "Does CrispPDF store my Aadhaar?",
    a: "No. The Unlock PDF tool runs in your browser (WebAssembly + pdf-lib). The file is never uploaded, never logged, never persisted.",
  },
  {
    q: "Which forms accept only unlocked Aadhaar PDFs?",
    a: "Most Indian state portals, several banks' KYC uploads, some educational admissions, and third-party HR onboarding tools reject password-protected PDFs. Check the form's help text before removing the password.",
  },
];

export const Route = createFileRoute("/aadhaar-pdf-password-remove")({
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
        { "@type": "ListItem", position: 2, name: "Unlock Aadhaar PDF", item: canonical },
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
  component: AadhaarPage,
});

function AadhaarPage() {
  const unlock = TOOLS_BY_SLUG["unlock-pdf"] ?? null;
  const compress = TOOLS_BY_SLUG["compress-pdf"] ?? null;
  const related = [unlock, compress, TOOLS_BY_SLUG["protect-pdf"]].filter(Boolean) as NonNullable<
    typeof unlock
  >[];
  return (
    <PseoPageShell
      crumbs={[
        { name: "CrispPDF", to: "/" },
        { name: "Unlock Aadhaar PDF" },
      ]}
      badge="India · Aadhaar"
      title={TITLE}
      answer={ANSWER}
      intro="e-Aadhaar downloads from UIDAI are encrypted so nobody can misuse your card. When you legitimately need to attach the file to a form that rejects password-protected PDFs (state portals, some bank KYC uploads), you can remove the password locally — without uploading your Aadhaar anywhere."
      bullets={BULLETS}
      ctaTool={unlock}
      ctaLabel="Open Unlock PDF"
      faqs={FAQS}
      related={related}
    >
      <div className="mt-10 rounded-2xl border border-border/60 bg-surface/40 p-6">
        <h2 className="font-display text-lg font-semibold">The UIDAI password formula</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Take the first four letters of the name printed on your Aadhaar card in CAPITAL letters,
          then append your year of birth as four digits. If your name has fewer than four letters,
          use the full name in caps.
        </p>
        <div className="mt-4 space-y-1 font-mono text-xs">
          <p>RAJESH KUMAR, born 1985 → <span className="text-primary">RAJE1985</span></p>
          <p>PRIYA SHARMA, born 1998 → <span className="text-primary">PRIY1998</span></p>
          <p>AJAY, born 2001 → <span className="text-primary">AJAY2001</span></p>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Got the password? <Link to="/unlock-pdf" className="text-primary underline">Open Unlock PDF</Link> and drop your e-Aadhaar file in.
        </p>
      </div>
    </PseoPageShell>
  );
}
