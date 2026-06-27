// Programmatic SEO: tool × competitor comparison pages.

export interface Competitor {
  slug: string;
  name: string;
  homepage: string;
  pricing: string;
  freeLimit: string;
  signupRequired: string;
  watermark: string;
  uploads: string;
  toolSlugs: string[]; // tools where comparison is meaningful (i.e. competitor has equivalent)
}

export const COMPETITORS: Competitor[] = [
  {
    slug: "ilovepdf",
    name: "iLovePDF",
    homepage: "https://www.ilovepdf.com",
    pricing: "Free tier + Premium $4/mo",
    freeLimit: "Daily task limit, file size cap",
    signupRequired: "Required for Premium features",
    watermark: "No watermark",
    uploads: "Files uploaded to server",
    toolSlugs: [
      "merge-pdf", "split-pdf", "compress-pdf", "pdf-to-word", "pdf-to-excel",
      "pdf-to-jpg", "pdf-to-png", "word-to-pdf", "excel-to-pdf", "jpg-to-pdf",
      "rotate-pdf", "unlock-pdf", "protect-pdf", "watermark-pdf", "esign-pdf",
      "ocr-pdf", "add-page-numbers-pdf", "html-to-pdf", "crop-pdf",
    ],
  },
  {
    slug: "smallpdf",
    name: "Smallpdf",
    homepage: "https://smallpdf.com",
    pricing: "Free tier + Pro $9/mo",
    freeLimit: "2 tasks per day on free",
    signupRequired: "Account required for most tools",
    watermark: "No watermark",
    uploads: "Files uploaded to server",
    toolSlugs: [
      "merge-pdf", "split-pdf", "compress-pdf", "pdf-to-word", "pdf-to-excel",
      "pdf-to-jpg", "word-to-pdf", "excel-to-pdf", "jpg-to-pdf",
      "rotate-pdf", "unlock-pdf", "protect-pdf", "esign-pdf", "ocr-pdf",
    ],
  },
  {
    slug: "adobe",
    name: "Adobe Acrobat Online",
    homepage: "https://www.adobe.com/acrobat/online.html",
    pricing: "$19.99/mo Acrobat Standard",
    freeLimit: "Very limited free tier",
    signupRequired: "Adobe ID required",
    watermark: "No watermark",
    uploads: "Files uploaded to Adobe cloud",
    toolSlugs: [
      "merge-pdf", "split-pdf", "compress-pdf", "pdf-to-word", "pdf-to-excel",
      "pdf-to-ppt", "pdf-to-jpg", "word-to-pdf", "excel-to-pdf", "jpg-to-pdf",
      "rotate-pdf", "protect-pdf", "esign-pdf", "ocr-pdf", "redact-pdf",
    ],
  },
];

export const COMPETITORS_BY_SLUG: Record<string, Competitor> = Object.fromEntries(
  COMPETITORS.map((c) => [c.slug, c]),
);

export function allComparisonPairs(): Array<{ toolSlug: string; competitorSlug: string }> {
  const out: Array<{ toolSlug: string; competitorSlug: string }> = [];
  for (const c of COMPETITORS) for (const ts of c.toolSlugs) out.push({ toolSlug: ts, competitorSlug: c.slug });
  return out;
}

export function parseComparisonPair(slug: string): { toolSlug: string; competitorSlug: string } | null {
  const m = slug.match(/^(.+)-vs-([a-z0-9-]+)$/);
  if (!m) return null;
  return { toolSlug: m[1], competitorSlug: m[2] };
}
