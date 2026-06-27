// pSEO: India-and-use-case-specific compress landings.
// Each maps to the canonical compress-pdf tool but targets a distinct query.
import { createFileRoute, notFound } from "@tanstack/react-router";
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { TOOLS_BY_SLUG, TOOLS } from "@/lib/tools";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { hreflangLinks } from "@/lib/hreflang";

interface UsePage {
  slug: string;
  title: string;
  meta: string;
  badge: string;
  hero: string;
  answer: string;
  intro: string;
  bullets: string[];
  faqs: { q: string; a: string }[];
}

const USES: Record<string, UsePage> = {
  whatsapp: {
    slug: "whatsapp",
    title: "Compress PDF for WhatsApp Free — Under 16 MB in Browser",
    meta: "WhatsApp accepts PDFs up to 100 MB but slows down over 16 MB. Compress any PDF for WhatsApp in your browser — no upload, no signup, no watermark.",
    badge: "Use case · WhatsApp",
    hero: "Compress PDF for WhatsApp — Fast, Free, Browser-Only",
    answer:
      "WhatsApp accepts PDF attachments up to 100 MB but starts to lag over 16 MB on slower phones. Use CrispPDF's Compress PDF tool with the 'WhatsApp friendly' preset (about 5 MB) to keep PDFs snappy in chats. Everything runs in your browser — no upload, no signup, no watermark.",
    intro:
      "Sending a chunky PDF over WhatsApp is painful — slow delivery, failed previews, and angry recipients. Compress it to under 5 MB and it sends instantly, opens fast on any phone, and looks identical to the original.",
    bullets: [
      "WhatsApp PDF cap: 100 MB hard, 16 MB recommended",
      "Most PDFs fit under 5 MB with no visible quality loss",
      "Runs in your browser — no upload, no signup",
      "Works on Android Chrome and iOS Safari",
    ],
    faqs: [
      { q: "What is the max PDF size on WhatsApp?", a: "WhatsApp allows up to 100 MB per file as of 2024, but anything over 16 MB feels sluggish on mid-range phones. Aim for 5 MB or less." },
      { q: "Will compression hurt legibility?", a: "No. CrispPDF's WhatsApp preset keeps images at 120–150 DPI — sharp on a phone screen, indistinguishable from the original." },
    ],
  },
  email: {
    slug: "email",
    title: "Compress PDF for Email — Under 25 MB, Free | CrispPDF",
    meta: "Compress PDFs for Gmail, Outlook, or any email client. Stay under the 25 MB attachment cap. Free, browser-only — no upload, no signup, no watermark.",
    badge: "Use case · Email",
    hero: "Compress PDF for Email — Stay Under the 25 MB Cap",
    answer:
      "Gmail and Outlook cap email attachments at 25 MB; many corporate servers cap at 10 MB. CrispPDF's Compress PDF tool with the 'Email' preset reliably gets PDFs under both limits without losing legibility. Runs entirely in your browser — no upload, no signup, no watermark.",
    intro:
      "If your PDF is too big to email, you have two choices: shrink it or upload to a drive and share a link. Shrinking is faster, keeps recipients on the same workflow, and works on every email client. CrispPDF's email preset gets you under 10 MB on almost any document.",
    bullets: [
      "Gmail / Outlook attachment limit: 25 MB",
      "Many corporate mail servers cap at 10 MB or even 5 MB",
      "Free, no signup, no watermark",
      "Runs in your browser — file never uploaded",
    ],
    faqs: [
      { q: "What's the email attachment limit?", a: "Gmail and Outlook.com cap at 25 MB. Yahoo Mail caps at 25 MB. Corporate Exchange typically caps at 10 MB. iCloud Mail caps at 20 MB." },
      { q: "Can I email a 100 MB PDF?", a: "Not directly. Compress it to 10–20 MB with CrispPDF, or upload to Drive/OneDrive and share the link." },
    ],
  },
  "passport-photo": {
    slug: "passport-photo",
    title: "Convert Passport Photo to PDF — 100 KB / 200 KB Targets",
    meta: "Convert your passport-size photo and signature to PDF at the exact size Indian govt forms require — 100 KB, 200 KB, or 50 KB. Free, browser-only.",
    badge: "Use case · Passport photo",
    hero: "Convert Passport Photo to PDF (UPSC, SSC, IBPS Ready)",
    answer:
      "Indian government portals (UPSC, SSC, IBPS, EPFO, passport seva) require a passport photo as a PDF under a strict size — usually 100 KB or 200 KB. Use CrispPDF's JPG-to-PDF tool, then run the result through Compress PDF with the matching size target. Browser-only — your ID images never leave your device.",
    intro:
      "Every Indian government form has its own quirks: UPSC wants 100 KB, SSC wants 50 KB photo + 20 KB signature, IBPS wants a specific aspect ratio. CrispPDF's JPG-to-PDF and Compress PDF tools cover every variation without uploading anything.",
    bullets: [
      "UPSC, SSC, IBPS, EPFO and passport seva ready",
      "Hit exact size caps: 50 KB, 100 KB, 200 KB",
      "Browser-only — your ID never reaches a server",
      "Free, no signup, no watermark",
    ],
    faqs: [
      { q: "What size does UPSC want for the passport photo?", a: "UPSC currently accepts passport photo as JPG or PDF between 20 KB and 300 KB. The signature must be between 10 KB and 20 KB." },
      { q: "Do I need to upload anything?", a: "No. CrispPDF runs in your browser, so your photo and signature stay on your device." },
    ],
  },
};

export const Route = createFileRoute("/compress-pdf-for-$use")({
  head: ({ params }) => {
    const u = USES[params.use];
    if (!u) return { meta: [{ title: "Not found — CrispPDF" }] };
    const path = `/compress-pdf-for-${u.slug}`;
    const canonical = abs(path);
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: u.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    return {
      meta: [
        { title: u.title },
        { name: "description", content: u.meta },
        { property: "og:title", content: u.title },
        { property: "og:description", content: u.meta },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        { property: "og:image", content: OG_DEFAULT },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_DEFAULT },
      ],
      links: [{ rel: "canonical", href: canonical }, ...hreflangLinks(path)],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(faqLd) }],
    };
  },
  loader: ({ params }) => {
    const u = USES[params.use];
    if (!u) throw notFound();
    return { u };
  },
  component: Page,
});

export const COMPRESS_USE_SLUGS = Object.keys(USES);

function Page() {
  const { u } = Route.useLoaderData();
  const compress = TOOLS_BY_SLUG["compress-pdf"] ?? null;
  const related = TOOLS.filter((t) => ["merge-pdf", "split-pdf", "jpg-to-pdf"].includes(t.slug)).slice(0, 3);
  return (
    <PseoPageShell
      crumbs={[
        { name: "CrispPDF", to: "/" },
        { name: "Compress PDF", to: "/compress-pdf" },
        { name: u.badge.split("·")[1]?.trim() ?? "Use case" },
      ]}
      badge={u.badge}
      title={u.hero}
      answer={u.answer}
      intro={u.intro}
      bullets={u.bullets}
      ctaTool={compress}
      ctaLabel="Open Compress PDF"
      faqs={u.faqs}
      related={related}
    />
  );
}
