// Programmatic SEO: format-conversion pages. Each routes to the nearest
// real tool we provide, or marks as "via PDF" using two-step flow.

export interface FormatPair {
  slug: string; // "png-to-pdf"
  from: string;
  to: string;
  fromExt: string;
  toExt: string;
  toolSlug: string | null; // direct tool, if any
  via?: string; // e.g. "JPG to PDF" if we route through it
  blurb: string;
}

export const FORMAT_PAIRS: FormatPair[] = [
  { slug: "png-to-pdf", from: "PNG", to: "PDF", fromExt: ".png", toExt: ".pdf", toolSlug: "jpg-to-pdf", via: "JPG to PDF",
    blurb: "Drop PNG screenshots into our JPG to PDF tool — it handles PNG, JPG, and WebP equally well." },
  { slug: "webp-to-pdf", from: "WebP", to: "PDF", fromExt: ".webp", toExt: ".pdf", toolSlug: "jpg-to-pdf", via: "JPG to PDF",
    blurb: "WebP images convert through our image-to-PDF pipeline without re-encoding loss." },
  { slug: "heic-to-pdf", from: "HEIC", to: "PDF", fromExt: ".heic", toExt: ".pdf", toolSlug: "jpg-to-pdf", via: "JPG to PDF",
    blurb: "iPhone HEIC photos convert in-browser — no companion app required." },
  { slug: "csv-to-pdf", from: "CSV", to: "PDF", fromExt: ".csv", toExt: ".pdf", toolSlug: "excel-to-pdf", via: "Excel to PDF",
    blurb: "Open the CSV in any spreadsheet tool then export via our Excel to PDF route — or upload .csv directly." },
  { slug: "txt-to-pdf", from: "TXT", to: "PDF", fromExt: ".txt", toExt: ".pdf", toolSlug: "word-to-pdf", via: "Word to PDF",
    blurb: "Plain text converts cleanly with default formatting through our Word/text-to-PDF pipeline." },
  { slug: "rtf-to-pdf", from: "RTF", to: "PDF", fromExt: ".rtf", toExt: ".pdf", toolSlug: "word-to-pdf", via: "Word to PDF",
    blurb: "RTF documents preserve formatting through our Word-to-PDF converter." },
  { slug: "odt-to-pdf", from: "ODT", to: "PDF", fromExt: ".odt", toExt: ".pdf", toolSlug: "word-to-pdf", via: "Word to PDF",
    blurb: "LibreOffice / OpenOffice ODT files convert losslessly to PDF." },
  { slug: "ods-to-pdf", from: "ODS", to: "PDF", fromExt: ".ods", toExt: ".pdf", toolSlug: "excel-to-pdf", via: "Excel to PDF",
    blurb: "OpenDocument spreadsheets convert through our Excel-to-PDF pipeline." },
  { slug: "pdf-to-text", from: "PDF", to: "Text", fromExt: ".pdf", toExt: ".txt", toolSlug: "extract-text-pdf",
    blurb: "Pull clean plain text out of any PDF — perfect for indexing, archiving, or feeding LLMs." },
  { slug: "pdf-to-html", from: "PDF", to: "HTML", fromExt: ".pdf", toExt: ".html", toolSlug: "extract-text-pdf",
    blurb: "Extract text content and wrap in semantic HTML using our text-extraction tool." },
  { slug: "pdf-to-csv", from: "PDF", to: "CSV", fromExt: ".pdf", toExt: ".csv", toolSlug: "pdf-to-excel", via: "PDF to Excel",
    blurb: "Convert PDF tables to spreadsheet rows, then save as CSV from any spreadsheet app." },
  { slug: "image-to-pdf", from: "Image", to: "PDF", fromExt: "image", toExt: ".pdf", toolSlug: "jpg-to-pdf",
    blurb: "Any common image format — JPG, PNG, WebP, HEIC — wraps into a single multipage PDF." },
  { slug: "pdf-to-image", from: "PDF", to: "Image", fromExt: ".pdf", toExt: "image", toolSlug: "pdf-to-jpg",
    blurb: "Render every PDF page as a high-resolution image, downloadable individually or as a ZIP." },
  { slug: "doc-to-pdf", from: "DOC", to: "PDF", fromExt: ".doc", toExt: ".pdf", toolSlug: "word-to-pdf",
    blurb: "Legacy .doc and modern .docx both convert through our Word to PDF tool." },
  { slug: "xls-to-pdf", from: "XLS", to: "PDF", fromExt: ".xls", toExt: ".pdf", toolSlug: "excel-to-pdf",
    blurb: "Legacy Excel workbooks convert with sheet-per-page layout." },
];

export const FORMAT_PAIRS_BY_SLUG: Record<string, FormatPair> = Object.fromEntries(
  FORMAT_PAIRS.map((f) => [f.slug, f]),
);
