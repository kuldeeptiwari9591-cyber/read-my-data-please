export interface Release {
  version: string;
  date: string;
  highlights: string[];
}

export const RELEASES: Release[] = [
  {
    version: "1.3.0",
    date: "2026-06-26",
    highlights: [
      "Shipped full 40-tool toolkit including 10 new utilities (Invert, Resize, N-up, Booklet, Blank Page, Duplicate, Extract Text, Metadata Editor, Compare, Base64).",
      "Launched blog system with seed posts on PDF workflows and privacy.",
      "Added multilingual support (English, Hindi, Spanish, Portuguese) with hreflang tags.",
      "Migrated every tool to dedicated flat URLs (/merge-pdf, /split-pdf, etc.) with 301 redirects from legacy /tools paths.",
      "Locked the entire site to a single dark theme for a focused, consistent experience.",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-05-14",
    highlights: [
      "Added OCR (image-to-searchable PDF) powered by Tesseract.js.",
      "Introduced eSign PDF with a built-in signature pad.",
      "Released Redact PDF with interactive masking on the page canvas.",
      "Wired admin operation logging and rate-limit banner for client tools.",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-04-02",
    highlights: [
      "Added Compress PDF, Watermark PDF (text + image), and Add Page Numbers.",
      "Introduced JPG ↔ PDF, PNG export, and Grayscale conversion.",
      "Improved Hero rendering with environment lighting and sparkle particles.",
      "Smarter search with synonyms and relevance scoring across the toolkit.",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-02-18",
    highlights: [
      "Initial launch with the core 15 tools: Merge, Split, Rotate, Reorder, Delete Pages, Extract Pages, Crop, Repair, Flatten, Unlock, Protect, PDF→JPG/PNG, JPG→PDF, and PDF/A.",
      "Glassmorphism design system with Space Grotesk + Inter + JetBrains Mono.",
      "All processing happens in your browser — files never leave your device.",
    ],
  },
];
