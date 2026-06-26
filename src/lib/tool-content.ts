// Per-tool SEO content: HowTo steps, FAQ Q&A, and a Why-CrispPDF blurb.
// Falls back to sensible defaults when a slug has no overrides.

export interface HowToStep {
  name: string;
  text: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ToolContent {
  howTo: HowToStep[];
  faqs: FaqItem[];
  why: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

const DEFAULT_WHY =
  "CrispPDF runs entirely in your browser — your files never touch a server. No signup, no watermarks, no daily limits, no upsells. We built it because every other PDF site is slow, ad-stuffed, or hides the good features behind a paywall. CrispPDF is fast on a phone, fast on a laptop, fast on a 10-year-old machine. Output is byte-clean: signatures stay sharp, compressed PDFs stay readable, conversions preserve layout where the source allows. And because nothing leaves your device, even confidential documents are safe to process. Bookmark this page, share it with your team, and stop juggling five different PDF sites for five different tasks.";

const DEFAULT_HOWTO = (name: string): HowToStep[] => [
  { name: "Open the tool", text: `Open ${name} in your browser — no signup, no install.` },
  { name: "Drop your file", text: "Drag and drop your PDF into the upload zone, or click to browse." },
  { name: "Adjust options", text: "Pick any options the tool exposes (range, quality, password, etc.)." },
  { name: "Download the result", text: "Click the action button. Your processed file downloads instantly." },
];

const DEFAULT_FAQS = (name: string): FaqItem[] => [
  { q: `Is ${name} free?`, a: `Yes. ${name} on CrispPDF is 100% free — no daily limits, no signup, no watermarks.` },
  { q: "Are my files private?", a: "Yes. Most tools run entirely in your browser, so your files never leave your device. For server-assisted tools, files are processed in memory and discarded immediately." },
  { q: "Is there a file size limit?", a: "Most PDFs up to ~100 MB work comfortably. Very large files may take a few extra seconds depending on your device." },
  { q: "Do you keep my files?", a: "No. We never store, log, or share your documents. Output is generated, downloaded, and forgotten." },
  { q: "Do I need to install anything?", a: "No. CrispPDF works in any modern browser — Chrome, Safari, Firefox, Edge — on desktop and mobile." },
  { q: "Will there be a watermark on the output?", a: "Never. Your output is clean, ready to sign, share, or print." },
  { q: "Does it work on mobile?", a: "Yes. CrispPDF is fully responsive and works on iOS Safari, Android Chrome, and every modern mobile browser." },
  { q: "Do I need to create an account?", a: "No. There's no signup, no email gate, no login wall. Open the tool and use it instantly." },
  { q: "Is it safe for confidential documents?", a: "Yes. Because processing happens in your browser, confidential files like contracts, medical records, and tax returns never leave your device." },
  { q: "What happens if I close the tab mid-processing?", a: "Nothing is saved server-side, so closing the tab simply cancels the operation. Just reopen the tool and try again." },
  { q: "Can I use this offline?", a: "After the page loads once, most tools continue to work even with a flaky connection since processing is local." },
  { q: "Will this work on a slow computer?", a: "Yes. We've optimized for low-end devices — phones, Chromebooks, and older laptops all handle typical documents fine." },
  { q: "Does CrispPDF show ads?", a: "No. CrispPDF is ad-free, tracker-free, and popup-free. The tools load fast because nothing else is competing for your attention." },
  { q: `Can I use ${name} commercially?`, a: "Yes. CrispPDF is free for personal and commercial use. No license required, no attribution needed." },
];


const OVERRIDES: Partial<Record<string, Partial<ToolContent>>> = {
  "merge-pdf": {
    seoTitle: "Merge PDF Files Free — Combine Multiple PDFs Online | CrispPDF",
    seoDescription:
      "Merge PDF files online for free. Combine multiple PDFs into one document in your browser — no upload, no signup, no watermark, no file size limit.",
    keywords: ["merge pdf", "combine pdf", "join pdf files", "pdf merger online free", "merge multiple pdfs"],
    howTo: [
      { name: "Add your PDFs", text: "Drop two or more PDF files into the upload zone." },
      { name: "Reorder if needed", text: "Use the arrow buttons to set the order of the merged document." },
      { name: "Click Merge & download", text: "Get a single combined PDF in seconds — no watermark." },
    ],
    faqs: [
      { q: "How many PDFs can I merge?", a: "There's no hard limit. Browser memory is the practical ceiling — dozens of typical PDFs work fine." },
      { q: "Will the merged PDF preserve bookmarks and links?", a: "Page content and links inside pages are preserved. Top-level bookmarks from each source aren't carried over yet." },
      { q: "Can I reorder pages within the merged file?", a: "Yes — use the up/down arrows to reorder the source files before merging. For finer page-level reordering use the Reorder Pages tool afterward." },
    ],
  },
  "split-pdf": {
    howTo: [
      { name: "Upload your PDF", text: "Drop the PDF you want to split." },
      { name: "Enter page ranges", text: "Type ranges like 1-3, 5, 8-10 to define each output file." },
      { name: "Download the parts", text: "Get a separate PDF for each range, packaged as a ZIP." },
    ],
  },
  "compress-pdf": {
    howTo: [
      { name: "Upload your PDF", text: "Drop the file you want to shrink." },
      { name: "Pick a quality preset", text: "High keeps maximum sharpness; Medium and Low trade quality for smaller size." },
      { name: "Download the compressed file", text: "We show the before/after size so you can verify the savings." },
    ],
    faqs: [
      { q: "How much smaller will my PDF get?", a: "Image-heavy PDFs typically shrink 40–80%. Text-only PDFs are already small and may only shrink a few percent." },
      { q: "Will compression hurt quality?", a: "High preserves crisp text and images. Medium is the sweet spot for sharing. Low is best for email-sized attachments." },
    ],
  },
  "pdf-to-word": {
    howTo: [
      { name: "Upload your PDF", text: "Drop the PDF you want to convert." },
      { name: "Wait for extraction", text: "We pull text page-by-page with layout-aware grouping." },
      { name: "Download the .docx", text: "Open in Word, Google Docs, or LibreOffice and edit freely." },
    ],
    faqs: [
      { q: "Will the layout look identical?", a: "Text and paragraph structure are preserved. Complex multi-column layouts and embedded images are simplified for editability." },
      { q: "Can I convert scanned PDFs?", a: "Scanned PDFs are images of text. Run OCR PDF first to make them searchable, then convert to Word." },
    ],
  },
  "pdf-to-excel": {
    howTo: [
      { name: "Upload your PDF", text: "Drop the PDF containing tables." },
      { name: "We detect rows", text: "Items are grouped by Y position into rows and sorted by X position." },
      { name: "Download the .xlsx", text: "Each PDF page becomes its own sheet, ready to edit." },
    ],
  },
  "ocr-pdf": {
    howTo: [
      { name: "Upload a scanned PDF", text: "Drop any image-based or scanned PDF." },
      { name: "OCR runs in your browser", text: "Tesseract.js extracts text page-by-page. Larger files take longer." },
      { name: "Download the searchable PDF", text: "The output looks identical but text is now selectable and searchable." },
    ],
    faqs: [
      { q: "Which languages are supported?", a: "Default is English. More language packs are on the roadmap." },
      { q: "How long does OCR take?", a: "Roughly 1–4 seconds per page on a modern laptop. Phones are slower." },
    ],
  },
  "protect-pdf": {
    howTo: [
      { name: "Upload your PDF", text: "Drop the file you want to encrypt." },
      { name: "Set a password", text: "Pick a strong password — we never see it or store it." },
      { name: "Download the protected PDF", text: "Anyone opening it will need the password you set." },
    ],
  },
  "esign-pdf": {
    howTo: [
      { name: "Upload your PDF", text: "Drop the document you need to sign." },
      { name: "Draw your signature", text: "Use the signature pad — mouse, trackpad, or finger." },
      { name: "Place and download", text: "Click the page where you want it. Repeat for multiple signatures, then download." },
    ],
  },
  "html-to-pdf": {
    howTo: [
      { name: "Paste a URL", text: "Enter the page URL you want to capture as a PDF." },
      { name: "We fetch and clean it", text: "Our server pulls the page, strips scripts and ads, and renders the readable text." },
      { name: "Download the PDF", text: "Get a clean, archive-ready PDF named after the page title." },
    ],
  },
};

export function getToolContent(slug: string, name: string): ToolContent {
  const o = OVERRIDES[slug] ?? {};
  const defaults = DEFAULT_FAQS(name);
  const overrideFaqs = o.faqs ?? [];
  // Pad up to 14 FAQs with defaults the override didn't already cover.
  const merged = [...overrideFaqs];
  for (const d of defaults) {
    if (merged.length >= 14) break;
    if (!merged.some((f) => f.q.toLowerCase() === d.q.toLowerCase())) merged.push(d);
  }
  return {
    howTo: o.howTo ?? DEFAULT_HOWTO(name),
    faqs: merged.slice(0, 14),
    why: o.why ?? DEFAULT_WHY,
    seoTitle: o.seoTitle,
    seoDescription: o.seoDescription,
    keywords: o.keywords,
  };
}


