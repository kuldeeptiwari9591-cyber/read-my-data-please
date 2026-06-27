// Programmatic SEO: file-size compression targets popular in India
// (govt forms accept under 100KB, 200KB, 500KB) and for email/WhatsApp.
// Sourced from docs/seo/02-india.md + docs/seo/04-pseo-pages.md.

export interface SizeTarget {
  slug: string; // "100kb" or "1mb"
  label: string; // "100 KB"
  bytes: number;
  intro: string;
  bullets: string[];
  faq: { q: string; a: string }[];
}

export const SIZE_TARGETS: SizeTarget[] = [
  {
    slug: "100kb",
    label: "100 KB",
    bytes: 100 * 1024,
    intro:
      "Compressing a PDF to under 100 KB is a hard requirement for many Indian government portals — UPSC, SSC, IBPS, college admissions, EPFO, and passport seva all cap photo and signature uploads at this size. CrispPDF's compressor picks the right downsampling rate automatically.",
    bullets: [
      "Hits the 100 KB ceiling for UPSC/SSC/IBPS forms",
      "Keeps text readable — uses 96–120 DPI for image-heavy pages",
      "Runs in your browser — no upload, no signup, no watermark",
      "Works on phone, tablet, and slow PCs",
    ],
    faq: [
      { q: "Can every PDF compress to 100 KB?", a: "Text-heavy PDFs hit 100 KB easily. Highly visual PDFs (lots of full-page images) sometimes need to drop to 200 KB to stay legible — our tool tells you when this happens." },
      { q: "Is this lossless?", a: "No. Hitting 100 KB requires lossy image downsampling. Text remains crisp. Photos may show very mild softening at 96 DPI." },
    ],
  },
  {
    slug: "200kb",
    label: "200 KB",
    bytes: 200 * 1024,
    intro:
      "The 200 KB target is the most common upload cap on Indian government portals after 100 KB. It gives photos and scans more headroom while still fitting strict upload forms.",
    bullets: [
      "Standard upload cap for many state government portals",
      "Higher image quality than 100 KB target",
      "Browser-only — confidential ID scans never leave your device",
      "Free, no signup, no watermark",
    ],
    faq: [
      { q: "Will scanned ID cards stay readable?", a: "Yes. 200 KB still allows ~150 DPI image quality, sufficient for Aadhaar, PAN, and marksheet scans." },
    ],
  },
  {
    slug: "300kb",
    label: "300 KB",
    bytes: 300 * 1024,
    intro:
      "Many bank KYC forms and college applications accept up to 300 KB. This preset is the sweet spot for scanned 2–4 page documents.",
    bullets: ["Bank KYC and college-application friendly", "Preserves photo clarity", "Browser-only — no upload"],
    faq: [
      { q: "How many pages will fit at 300 KB?", a: "Roughly 4–8 text-only pages, or 2–3 scanned pages, depending on image content." },
    ],
  },
  {
    slug: "500kb",
    label: "500 KB",
    bytes: 500 * 1024,
    intro:
      "500 KB is the soft cap for many job-application portals (Naukri, LinkedIn easy-apply, internshala) for resumes with photo. CrispPDF keeps the layout intact while hitting the size.",
    bullets: ["Resume & job-portal friendly", "Photos and graphics stay sharp", "Free, no signup, browser-only"],
    faq: [
      { q: "Will my resume's font stay crisp?", a: "Yes — text isn't rasterised. Only embedded images are downsampled." },
    ],
  },
  {
    slug: "1mb",
    label: "1 MB",
    bytes: 1024 * 1024,
    intro:
      "1 MB is a comfortable middle ground for email attachments, WhatsApp documents, and most cloud-storage limits. Visible quality is near-original.",
    bullets: ["Email-friendly attachment size", "WhatsApp-document friendly", "Near-original quality"],
    faq: [
      { q: "Is 1 MB enough for a 20-page report?", a: "Usually yes if the report is mostly text and small graphics. Heavy image reports may need 2 MB." },
    ],
  },
  {
    slug: "2mb",
    label: "2 MB",
    bytes: 2 * 1024 * 1024,
    intro:
      "2 MB is the standard cap for Gmail and Outlook attachments before they switch to drive-link delivery. Most one-image-per-page scans land comfortably here.",
    bullets: ["Gmail / Outlook attachment friendly", "Keeps image clarity", "Free, no signup"],
    faq: [
      { q: "Why not just send it without compressing?", a: "Many corporate mail servers reject anything over 5 MB and warn over 2 MB." },
    ],
  },
  {
    slug: "5mb",
    label: "5 MB",
    bytes: 5 * 1024 * 1024,
    intro:
      "5 MB is the maximum attachment size on most corporate email systems and the soft cap for WhatsApp Web's media preview.",
    bullets: ["Corporate-email safe", "WhatsApp Web friendly", "Minimal quality loss"],
    faq: [{ q: "Will my charts and tables look the same?", a: "Yes — at 5 MB target, downsampling is mild and graphics stay crisp." }],
  },
  {
    slug: "10mb",
    label: "10 MB",
    bytes: 10 * 1024 * 1024,
    intro:
      "10 MB is the typical Slack and Microsoft Teams upload threshold and the cap for many web forms.",
    bullets: ["Slack / Teams friendly", "Very mild compression", "Free, no signup"],
    faq: [{ q: "Should I use a higher target?", a: "If your PDF is already under 10 MB, no need to compress. This preset is just to guarantee a ceiling." }],
  },
];

export const SIZE_TARGETS_BY_SLUG: Record<string, SizeTarget> = Object.fromEntries(
  SIZE_TARGETS.map((s) => [s.slug, s]),
);
