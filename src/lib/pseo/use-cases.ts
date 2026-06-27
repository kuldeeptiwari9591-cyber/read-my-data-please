// Programmatic SEO: tool × use-case combinations.
// One entry per use-case; each renders at /use-cases/{tool-slug}-for-{use-case-slug}.

export interface UseCase {
  slug: string; // url segment, e.g. "email"
  label: string; // "Email"
  toolSlugs: string[]; // tools this use-case applies to
  intro: (toolName: string) => string;
  benefits: string[];
}

export const USE_CASES: UseCase[] = [
  {
    slug: "email",
    label: "Email Attachments",
    toolSlugs: ["compress-pdf", "merge-pdf", "split-pdf", "pdf-to-jpg", "pdf-to-word"],
    intro: (t) =>
      `Sending PDFs over email? Most providers cap attachments at 20–25 MB. ${t} on CrispPDF prepares your file for email in seconds — no signup, no watermark, no upload to a third-party server. Drop the file, get a clean, email-ready PDF back.`,
    benefits: [
      "Get under common 25 MB Gmail / Outlook attachment limits",
      "No upload — your file never leaves your browser",
      "No watermark on the output",
      "Works from phone, tablet, or laptop",
    ],
  },
  {
    slug: "students",
    label: "Students",
    toolSlugs: ["merge-pdf", "split-pdf", "compress-pdf", "pdf-to-word", "ocr-pdf", "extract-text-pdf", "add-page-numbers-pdf"],
    intro: (t) =>
      `Lecture notes, scanned textbooks, research papers — students juggle dozens of PDFs every term. ${t} on CrispPDF is free forever, runs in your browser, and works offline once loaded. No signup means no email gate between you and your homework.`,
    benefits: [
      "100% free — no student discount needed because nothing is paid",
      "Works on Chromebooks, iPads, and older laptops",
      "Process scanned lecture notes privately",
      "Bookmark once, use all semester",
    ],
  },
  {
    slug: "contracts",
    label: "Contracts & Agreements",
    toolSlugs: ["esign-pdf", "protect-pdf", "redact-pdf", "watermark-pdf", "merge-pdf", "flatten-pdf"],
    intro: (t) =>
      `Contracts contain sensitive terms, signatures, and identifying details. ${t} on CrispPDF processes everything locally in your browser so confidential clauses never touch a server. Sign, lock, redact, or finalise — all without sending the PDF to a SaaS database.`,
    benefits: [
      "Signatures and edits applied locally — never uploaded",
      "No account = no audit log a third party can subpoena",
      "Add legal-grade encryption with Protect PDF",
      "Free for personal and commercial use",
    ],
  },
  {
    slug: "invoices",
    label: "Invoices",
    toolSlugs: ["merge-pdf", "compress-pdf", "edit-metadata-pdf", "add-page-numbers-pdf", "pdf-to-excel", "watermark-pdf"],
    intro: (t) =>
      `Freelancers and small businesses generate dozens of invoices a month. ${t} on CrispPDF helps you batch, brand, and archive them quickly — without paying for Acrobat or uploading client data to a free-tier SaaS.`,
    benefits: [
      "Compress monthly invoice bundles to send to accountants",
      "Add watermarks like PAID or DRAFT",
      "Strip metadata before sending invoices externally",
      "Convert PDF invoices to Excel for bookkeeping",
    ],
  },
  {
    slug: "scanned-documents",
    label: "Scanned Documents",
    toolSlugs: ["ocr-pdf", "compress-pdf", "rotate-pdf", "grayscale-pdf", "repair-pdf", "extract-text-pdf"],
    intro: (t) =>
      `Scans are bulky, image-only, and often crooked. ${t} on CrispPDF turns raw scans into searchable, smaller, properly-oriented PDFs in seconds — perfect for receipts, ID copies, and archive material.`,
    benefits: [
      "Make scans searchable with built-in OCR",
      "Shrink image-heavy scans 50–80%",
      "Auto-rotate and clean up page orientation",
      "Convert colour scans to lighter grayscale",
    ],
  },
  {
    slug: "ebooks",
    label: "eBooks & Reading",
    toolSlugs: ["split-pdf", "merge-pdf", "compress-pdf", "n-up-pdf", "pdf-to-jpg", "extract-pdf-pages"],
    intro: (t) =>
      `Long PDFs are painful to read on phones and e-readers. ${t} on CrispPDF lets you re-flow, split chapters, or rebuild a custom eBook from any source PDF — all in your browser, no DRM-stripping shenanigans needed.`,
    benefits: [
      "Split a book into chapters for easier reading on mobile",
      "Compress to fit on Kindle / Kobo storage",
      "Rearrange pages for printed booklet output",
      "Extract specific chapters for citation",
    ],
  },
  {
    slug: "printing",
    label: "Printing",
    toolSlugs: ["n-up-pdf", "merge-pdf", "rotate-pdf", "grayscale-pdf", "compress-pdf", "reorder-pdf-pages"],
    intro: (t) =>
      `Printing wastes paper when PDFs aren't prepped properly. ${t} on CrispPDF helps you arrange, scale, and finalise documents before they hit the tray — saving ink, paper, and re-prints.`,
    benefits: [
      "Fit multiple pages per sheet with N-up",
      "Convert colour PDFs to grayscale to save ink",
      "Reorder pages for double-sided printing",
      "Rotate landscape pages before sending to printer",
    ],
  },
  {
    slug: "work-from-home",
    label: "Work From Home",
    toolSlugs: ["esign-pdf", "merge-pdf", "compress-pdf", "pdf-to-word", "watermark-pdf", "protect-pdf"],
    intro: (t) =>
      `Remote workers handle PDFs daily — proposals, expense reports, signed forms. ${t} on CrispPDF replaces the half-dozen paid PDF apps a typical home office juggles, with no per-seat license and no IT approval needed.`,
    benefits: [
      "Sign documents without printing-then-scanning",
      "Combine expense receipts into one PDF",
      "Lock proposals before emailing clients",
      "Works on personal devices without admin install",
    ],
  },
  {
    slug: "lawyers",
    label: "Legal Professionals",
    toolSlugs: ["redact-pdf", "esign-pdf", "protect-pdf", "ocr-pdf", "merge-pdf", "edit-metadata-pdf", "flatten-pdf"],
    intro: (t) =>
      `Legal work demands discretion. ${t} on CrispPDF processes every file in your browser — no SaaS server log, no third-party retention policy to vet. Combine, lock, redact, and sign privileged material with confidence.`,
    benefits: [
      "Redaction stays local — no exposure window",
      "Combine discovery PDFs without upload",
      "OCR scanned exhibits for keyword search",
      "Strip metadata before service or filing",
    ],
  },
  {
    slug: "developers",
    label: "Developers",
    toolSlugs: ["base64-pdf", "extract-text-pdf", "compress-pdf", "edit-metadata-pdf", "extract-images-pdf", "merge-pdf"],
    intro: (t) =>
      `Need to embed, inspect, or sanitise PDFs in code? ${t} on CrispPDF gives you a fast UI for tasks you'd otherwise wire up with pdf-lib or Python — without context-switching out of your browser.`,
    benefits: [
      "Convert to and from Base64 for inline embeds",
      "Extract text or images for ETL pipelines",
      "Strip metadata before committing fixtures",
      "Inspect PDF structure without command-line tools",
    ],
  },
];

export const USE_CASES_BY_SLUG: Record<string, UseCase> = Object.fromEntries(
  USE_CASES.map((u) => [u.slug, u]),
);

export function allUseCasePairs(): Array<{ toolSlug: string; useCaseSlug: string }> {
  const out: Array<{ toolSlug: string; useCaseSlug: string }> = [];
  for (const uc of USE_CASES) for (const ts of uc.toolSlugs) out.push({ toolSlug: ts, useCaseSlug: uc.slug });
  return out;
}

export function parseUseCasePair(slug: string): { toolSlug: string; useCaseSlug: string } | null {
  const m = slug.match(/^(.+)-for-([a-z0-9-]+)$/);
  if (!m) return null;
  return { toolSlug: m[1], useCaseSlug: m[2] };
}
