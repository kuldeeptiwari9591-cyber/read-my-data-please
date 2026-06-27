// Per-tool SEO content: titles, descriptions, keywords, HowTo steps, FAQs,
// Why-CrispPDF blurb, and AI-engine answer (TL;DR).
// Strings sourced verbatim from docs/seo/01-tool-keywords.md and docs/seo/07-aeo-geo.md.

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

// AI-engine answers (40–60 words each) — fed to the AnswerBlock on every tool
// page so Google AI Overviews, ChatGPT, and Perplexity can quote a standalone
// paragraph. Sourced from docs/seo/07-aeo-geo.md.
export const AEO_ANSWERS: Record<string, string> = {
  "merge-pdf":
    "Open CrispPDF's merge tool in any browser, drag your PDFs into the upload zone (or tap to pick them), reorder them by dragging, then click Merge. The combined PDF downloads in seconds. Files never leave your device — no signup, no watermark, no file limit.",
  "compress-pdf":
    "Use CrispPDF's compress tool and pick a size preset (100KB, 200KB, 1MB) or quality level. It downsamples images and strips unused metadata until the file fits. Works for most PDFs up to ~50MB. Text-heavy PDFs shrink the most; image-heavy PDFs may need the 200KB preset.",
  "esign-pdf":
    "Open CrispPDF's eSign tool, upload the PDF, then draw, type, or upload your signature image. Drag it onto the page, resize, and click Save. The signed PDF downloads instantly. No DocuSign or Adobe account needed — works in any modern browser.",
  "pdf-to-word":
    "Drop your PDF into CrispPDF's PDF-to-Word converter. It produces an editable .docx file with text, tables, and images preserved. Free, no watermark, no signup, no email gate. For scanned PDFs, run OCR first to make the text selectable.",
  "unlock-pdf":
    "Use CrispPDF's Unlock PDF tool. Upload the file you own, enter the password if you have it (or skip if it's only printing/copying restrictions), and the unlocked PDF downloads. Everything runs in your browser — the file never reaches a server.",
  "protect-pdf":
    "Open CrispPDF's Protect PDF tool, upload the file, choose a strong password, and pick AES-256 encryption. Optionally restrict editing, copying, or printing. The protected PDF downloads in seconds — your password and file never leave your browser.",
  "ocr-pdf":
    "CrispPDF's OCR tool turns image-only PDFs into searchable, copyable text. Upload the scan, pick the language(s), click Process. It uses Tesseract.js in your browser — supports 100+ languages including Hindi, English, Spanish, and Portuguese. No file upload to a server.",
  "rotate-pdf":
    "Use CrispPDF's Rotate PDF tool. Upload, then click left-rotate or right-rotate on each page (or all pages at once). Click Save — the rotated PDF downloads permanently rotated, not just visually. Free, no signup, runs in your browser.",
  "split-pdf":
    "Open CrispPDF's Split PDF tool. Choose split-by-range, split-by-every-N-pages, or extract-specific-pages. Set your ranges, click Split, and download a ZIP of the resulting PDFs. Free, browser-only — no upload to any server.",
  "jpg-to-pdf":
    "Drop your JPG, PNG, WebP, or HEIC images into CrispPDF's image-to-PDF tool, reorder by dragging, set the page size (A4, Letter, fit), and click Convert. One multipage PDF downloads. Free forever, no watermark, no signup.",
  "crop-pdf":
    "CrispPDF's Crop PDF tool lets you drag a crop rectangle on any page, then apply it to that page or all pages. Click Save — the cropped PDF downloads. Margins and white space removed cleanly. Free, no signup, runs in your browser.",
  "redact-pdf":
    "Real redaction permanently removes text — not just covers it with a black box. CrispPDF's Redact tool draws true-black rectangles AND deletes the underlying text from the PDF stream. Upload, drag boxes over sensitive areas, click Redact, download. The file never leaves your device.",
  "edit-metadata-pdf":
    "Open CrispPDF's Edit Metadata tool, upload the PDF, change title, author, subject, and keywords, then click Save. The updated PDF downloads with new metadata embedded. Useful for archiving, SEO, and stripping identifying info before sharing.",
  "watermark-pdf":
    "Open CrispPDF's Watermark tool, upload your PDF, drop a logo or set custom text. Adjust opacity, angle, font, color, and position. Apply to one page or all. Download the watermarked PDF — file never leaves your browser. Free, no signup.",
  "word-to-pdf":
    "Drop your .docx or .doc into CrispPDF's Word-to-PDF converter. Fonts, tables, images, headers and footers all stay intact. Download the PDF in seconds. Free, no signup, no watermark — perfect for sending final-version documents that won't be altered.",
  "pdf-to-excel":
    "Open CrispPDF's PDF-to-Excel converter, upload a PDF with tables, and download a .xlsx where each PDF page becomes a sheet with rows and columns intact. Ideal for invoices, bank statements, and reports. Free, no signup, no watermark.",
  "pdf-to-jpg":
    "Drop your PDF into CrispPDF's PDF-to-JPG converter. Every page renders as a high-quality JPG (up to 300 DPI). Download images individually or as one ZIP. Runs entirely in your browser — no upload, no signup, no watermark.",
  "pdf-to-png":
    "Use CrispPDF's PDF-to-PNG tool to render each PDF page as a lossless PNG image, ideal for screenshots and transparent backgrounds. Download images individually or as a ZIP. Free, no signup, browser-only — file never reaches a server.",
  "pdf-to-ppt":
    "Drop your PDF into CrispPDF's PDF-to-PowerPoint converter. Each page becomes an editable slide in a .pptx deck — text, images, and layout preserved. Free, no signup, no watermark. Open in PowerPoint, Keynote, or Google Slides.",
  "html-to-pdf":
    "Paste a URL into CrispPDF's HTML-to-PDF tool. It fetches the page, strips ads and scripts, and renders a clean, archive-ready PDF. Perfect for saving articles, receipts, or web records. Free, no signup, no watermark.",
  "excel-to-pdf":
    "Upload your .xlsx or .xls file into CrispPDF's Excel-to-PDF converter. Each sheet becomes one PDF page with formatting intact. Free, no signup, no watermark — ideal for sending spreadsheets that recipients can't accidentally edit.",
  "reorder-pdf-pages":
    "Open CrispPDF's Reorder Pages tool. Upload your PDF and live thumbnails appear. Drag pages into any order, then download. Free, no signup, no watermark — pages keep their original quality and the file never leaves your browser.",
  "delete-pdf-pages":
    "Use CrispPDF's Delete PDF Pages tool. Upload, click the pages you want gone in the live preview, and download the trimmed file. Free, no signup, no watermark. Perfect for removing blank scans, ads, or unwanted appendices.",
  "extract-pdf-pages":
    "Open CrispPDF's Extract Pages tool, upload your PDF, select the pages you want, and download them as a new PDF. Free, no signup, no watermark — pages keep their original quality. Runs entirely in your browser.",
  "resize-pdf":
    "Drop your PDF into CrispPDF's Resize tool, pick a target page size (A4, Letter, A5, custom) and download. Content scales cleanly without cropping. Free, no signup, no watermark — great for switching between US Letter and international A4.",
  "n-up-pdf":
    "Open CrispPDF's N-up tool, upload a PDF, pick 2-up, 4-up, 6-up, or 8-up, and download the rearranged file. Pages are scaled and tiled onto each sheet — saves paper and ink when printing handouts or study notes.",
  "blank-page-pdf":
    "Use CrispPDF's Insert Blank Pages tool. Upload your PDF, pick where to add blanks (after page N, every N pages, or end), choose A4/Letter/match-source, and download. Free, no signup, no watermark — perfect for double-sided printing.",
  "duplicate-pages-pdf":
    "Open CrispPDF's Duplicate Pages tool, upload your PDF, pick which pages to clone and how many copies. Duplicates land directly after the original. Free, no signup, no watermark — ideal for repeated coupon sheets or forms.",
  "reverse-pdf":
    "Drop your PDF into CrispPDF's Reverse Pages tool and download with the page order flipped — last page first. Free, no signup, no watermark. Fixes back-to-front scans from sheet feeders in one click.",
  "extract-text-pdf":
    "Open CrispPDF's Extract Text tool, upload your PDF, and download a clean .txt file with every word preserved in reading order. Free, no signup, no watermark — perfect for feeding documents into ChatGPT, Claude, or any LLM.",
  "base64-pdf":
    "Use CrispPDF's PDF↔Base64 tool to encode a PDF into a Base64 string (for embedding in email, JSON, or data URIs) or paste a Base64 string and download the decoded PDF. Free, no signup, browser-only — file never leaves your device.",
  "repair-pdf":
    "Drop your damaged PDF into CrispPDF's Repair tool. It rebuilds the cross-reference table and recovers as much content as possible. Free, no signup, no watermark — works on most slightly-corrupted PDFs that won't open in normal viewers.",
  "grayscale-pdf":
    "Open CrispPDF's Grayscale tool, upload your PDF, and download a black-and-white version that prints faster and uses far less colour ink. Free, no signup, no watermark — original PDF stays untouched on your device.",
  "add-page-numbers-pdf":
    "Use CrispPDF's Add Page Numbers tool. Upload your PDF, pick position (top/bottom, left/center/right), font, size, and starting number. Download instantly. Free, no signup, no watermark — perfect for theses, reports, and bound documents.",
  "add-watermark-text-pdf":
    "Open CrispPDF's Add Text Watermark tool. Upload your PDF, type CONFIDENTIAL, DRAFT, or any text, set angle, opacity, colour, and position. Apply to one page or all. Download instantly. Free, no signup, no watermark on the output itself.",
  "extract-images-pdf":
    "Drop your PDF into CrispPDF's Extract Images tool. It pulls every embedded image at original resolution and packages them as a ZIP. Free, no signup, no watermark — ideal for recovering photos from a scanned album or report.",
  "invert-pdf":
    "Use CrispPDF's Invert Colors tool. Upload your PDF and download a version with colours flipped — black becomes white. Free, no signup, no watermark. Perfect for night-time reading and for cutting printer-ink use on dark-background PDFs.",
  "compare-pdf":
    "Open CrispPDF's Compare PDFs tool, upload two PDFs, and see a page-by-page text diff with additions, deletions, and changes highlighted. Free, no signup, no watermark — works entirely in your browser, files never uploaded.",
  "flatten-pdf":
    "Use CrispPDF's Flatten PDF tool to merge form fields, annotations, and signatures into the page so they can't be edited or stripped. Upload, click Flatten, download. Free, no signup, no watermark — perfect for sending final signed contracts.",
  "pdf-to-pdfa":
    "Open CrispPDF's PDF-to-PDF/A converter, upload your PDF, pick PDF/A-1b or PDF/A-2b, and download. Fonts are embedded and external dependencies stripped for long-term archival compliance. Free, no signup, no watermark.",
};

const OVERRIDES: Record<string, Partial<ToolContent>> = {
  // ───────────── Tier 1 (Semrush-verified) ─────────────
  "merge-pdf": {
    seoTitle: "Merge PDF Online Free — Combine Files In Browser | CrispPDF",
    seoDescription:
      "Merge PDF files online free. Combine unlimited PDFs in your browser — no upload, no signup, no watermark. Works on phone, tablet, desktop.",
    keywords: ["merge pdf", "combine pdf", "pdf merger", "how to merge pdf files", "merge pdf online free", "join pdf files"],
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
  "compress-pdf": {
    seoTitle: "Compress PDF Online Free — Shrink to 100KB, 200KB, 1MB",
    seoDescription:
      "Compress PDF instantly in your browser. Hit 100KB, 200KB or any size target — perfect for email, WhatsApp, or government forms. No watermark.",
    keywords: ["compress pdf", "pdf compressor", "reduce pdf size", "compress pdf to 100kb", "compress pdf to 200kb", "compress pdf without losing quality", "shrink pdf"],
    howTo: [
      { name: "Upload your PDF", text: "Drop the file you want to shrink." },
      { name: "Pick a size target or quality preset", text: "Aim for 100KB, 200KB, 1MB or pick High / Medium / Low quality." },
      { name: "Download the compressed file", text: "We show the before/after size so you can verify the savings." },
    ],
    faqs: [
      { q: "How much smaller will my PDF get?", a: "Image-heavy PDFs typically shrink 40–80%. Text-only PDFs are already small and may only shrink a few percent." },
      { q: "Will compression hurt quality?", a: "High preserves crisp text and images. Medium is the sweet spot for sharing. Low is best for email-sized attachments." },
      { q: "Can I compress a PDF to under 100KB?", a: "Yes — pick the 100KB target preset. Text-heavy PDFs hit 100KB easily; image-heavy PDFs may need 200KB for legibility." },
    ],
  },
  "pdf-to-word": {
    seoTitle: "PDF to Word Converter Free — No Watermark, No Signup",
    seoDescription:
      "Convert PDF to editable Word (.docx) free online. Keeps formatting, tables, images. No watermark, no email gate — opens in MS Word and Google Docs.",
    keywords: ["pdf to word", "convert pdf to word", "pdf to docx", "pdf to word converter free", "how to convert pdf to word", "pdf to word no watermark"],
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
  "split-pdf": {
    seoTitle: "Split PDF Online — Extract Pages or Split by Range",
    seoDescription:
      "Split a PDF into separate files by page, range, or every N pages. Free, no signup, runs locally in your browser. Keeps original quality.",
    keywords: ["split pdf", "pdf splitter", "pdf split", "how to split pdf into multiple files", "split pdf by page range", "extract pages from pdf"],
    howTo: [
      { name: "Upload your PDF", text: "Drop the PDF you want to split." },
      { name: "Enter page ranges", text: "Type ranges like 1-3, 5, 8-10 to define each output file." },
      { name: "Download the parts", text: "Get a separate PDF for each range, packaged as a ZIP." },
    ],
  },
  "jpg-to-pdf": {
    seoTitle: "JPG to PDF — Convert Images to PDF Free | CrispPDF",
    seoDescription:
      "Turn JPG, PNG, WebP or HEIC images into one PDF. Drag-and-drop, reorder, set page size. Free forever, no upload to any server.",
    keywords: ["jpg to pdf", "image to pdf", "jpeg to pdf", "convert jpg to pdf free", "multiple jpg to one pdf", "jpg to pdf passport size"],
  },
  "word-to-pdf": {
    seoTitle: "Word to PDF Converter Free — Keeps Formatting Intact",
    seoDescription:
      "Convert DOCX or DOC to PDF online free. Preserves fonts, tables, images, and headers. No signup, no watermark, no upload — done in seconds.",
    keywords: ["word to pdf", "docx to pdf", "doc to pdf", "convert word to pdf free", "word to pdf no watermark", "save word as pdf"],
  },
  "pdf-to-jpg": {
    seoTitle: "PDF to JPG Free — High-Quality Image Export In Browser",
    seoDescription:
      "Convert every page of a PDF into JPG images at up to 300 DPI. Download individually or as a ZIP. Free, no signup, runs in your browser.",
    keywords: ["pdf to jpg", "pdf to jpeg", "pdf to image", "pdf to jpg converter free", "pdf to jpg high quality", "convert pdf pages to jpg"],
  },
  "pdf-to-excel": {
    seoTitle: "PDF to Excel — Extract Tables to XLSX Free | CrispPDF",
    seoDescription:
      "Pull tables out of any PDF into Excel (.xlsx) — keeps rows and columns intact. Free, no signup, no watermark. Ideal for invoices and statements.",
    keywords: ["pdf to excel", "convert pdf to excel", "pdf to xls", "pdf table to excel", "pdf bank statement to excel", "extract tables from pdf"],
    howTo: [
      { name: "Upload your PDF", text: "Drop the PDF containing tables." },
      { name: "We detect rows", text: "Items are grouped by Y position into rows and sorted by X position." },
      { name: "Download the .xlsx", text: "Each PDF page becomes its own sheet, ready to edit." },
    ],
  },
  "rotate-pdf": {
    seoTitle: "Rotate PDF Online — Fix Sideways Pages In Seconds",
    seoDescription:
      "Rotate one page or every page in a PDF — 90°, 180°, 270°. Saves permanently, no watermark. Free, no signup, runs in your browser.",
    keywords: ["rotate pdf", "pdf rotate", "rotate pdf and save permanently", "rotate specific pages in pdf", "rotate pdf online free"],
  },
  "unlock-pdf": {
    seoTitle: "Unlock PDF Free — Remove Password From PDF In Browser",
    seoDescription:
      "Remove password protection from PDF files you own. Works in your browser — file never leaves your device. Free, no signup, no quota.",
    keywords: ["unlock pdf", "remove password from pdf", "pdf unlocker", "how to remove password from pdf", "unlock pdf without password", "decrypt pdf online"],
  },
  "protect-pdf": {
    seoTitle: "Password Protect PDF Online — AES-256 Encryption Free",
    seoDescription:
      "Add a password to any PDF in your browser. AES-256 encryption, no upload, no signup. Lock from opening, editing, copying, or printing — all free.",
    keywords: ["protect pdf", "password protect pdf", "how to password protect a pdf", "encrypt pdf online", "add password to pdf", "lock pdf from editing"],
    howTo: [
      { name: "Upload your PDF", text: "Drop the file you want to encrypt." },
      { name: "Set a password", text: "Pick a strong password — we never see it or store it." },
      { name: "Download the protected PDF", text: "Anyone opening it will need the password you set." },
    ],
  },
  "esign-pdf": {
    seoTitle: "Sign PDF Online Free — Draw, Type or Upload Signature",
    seoDescription:
      "Add a legally valid e-signature to any PDF. Draw, type, or upload — done in your browser. No DocuSign account, no email gate, no watermark.",
    keywords: ["sign pdf", "esign pdf", "electronic signature pdf", "sign pdf without adobe", "add signature to pdf free", "digital signature pdf online"],
    howTo: [
      { name: "Upload your PDF", text: "Drop the document you need to sign." },
      { name: "Draw your signature", text: "Use the signature pad — mouse, trackpad, or finger." },
      { name: "Place and download", text: "Click the page where you want it. Repeat for multiple signatures, then download." },
    ],
  },
  "ocr-pdf": {
    seoTitle: "OCR PDF Online — Make Scanned PDFs Searchable Free",
    seoDescription:
      "Turn scanned PDFs into searchable, copyable text using browser OCR. Works on receipts, lecture notes, ID scans. Free, no signup, multilingual.",
    keywords: ["ocr pdf", "pdf to text", "make pdf searchable", "how to ocr a pdf", "convert scanned pdf to text", "searchable pdf from scan"],
    howTo: [
      { name: "Upload a scanned PDF", text: "Drop any image-based or scanned PDF." },
      { name: "OCR runs in your browser", text: "Tesseract.js extracts text page-by-page. Larger files take longer." },
      { name: "Download the searchable PDF", text: "The output looks identical but text is now selectable and searchable." },
    ],
    faqs: [
      { q: "Which languages are supported?", a: "100+ languages including English, Hindi, Spanish, Portuguese, French, German, Chinese, Japanese, Arabic." },
      { q: "How long does OCR take?", a: "Roughly 1–4 seconds per page on a modern laptop. Phones are slower." },
    ],
  },
  "watermark-pdf": {
    seoTitle: "Add Watermark to PDF — Text or Logo, Free | CrispPDF",
    seoDescription:
      "Add text or image watermarks to any PDF. Choose font, opacity, position, rotation. Free, no signup — file never leaves your browser.",
    keywords: ["watermark pdf", "add watermark to pdf", "how to make watermark on pdf", "add draft watermark to pdf", "watermark pdf with logo", "confidential watermark pdf"],
  },
  "edit-metadata-pdf": {
    seoTitle: "Edit PDF Metadata Online — Title, Author, Keywords",
    seoDescription:
      "Edit PDF title, author, subject, and keywords without Acrobat. Works on locked files you own. Free, no signup, runs in your browser.",
    keywords: ["edit pdf metadata", "change pdf title author", "edit pdf without acrobat", "online pdf editor", "free pdf editor", "pdf properties editor"],
  },

  // ───────────── Tier 2 (estimated, remaining 25) ─────────────
  "reorder-pdf-pages": {
    seoTitle: "Reorder PDF Pages — Drag & Drop Reordering Free",
    seoDescription:
      "Drag and drop to reorder PDF pages. Live thumbnails, instant download. Free, no signup, runs in your browser.",
    keywords: ["rearrange pdf pages", "reorder pdf pages", "drag pages pdf", "sort pdf pages"],
  },
  "delete-pdf-pages": {
    seoTitle: "Delete PDF Pages Free — Remove Pages In Browser",
    seoDescription:
      "Remove unwanted pages from any PDF. Visual preview, batch delete, instant download. Free, no signup, no watermark.",
    keywords: ["delete pages from pdf", "remove pages from pdf", "delete blank pages pdf", "remove specific pdf pages"],
  },
  "extract-pdf-pages": {
    seoTitle: "Extract PDF Pages — Save Pages as Separate PDF",
    seoDescription:
      "Pick any pages from a PDF and save them as a new file. Free, no signup, no watermark — runs entirely in your browser.",
    keywords: ["extract pages from pdf", "pull pages out of pdf", "save pdf page as new pdf", "extract chapter pdf"],
  },
  "resize-pdf": {
    seoTitle: "Resize PDF — Change Page Size to A4, Letter, Custom",
    seoDescription:
      "Resize PDF pages to A4, Letter, A5, or custom dimensions. Free, no signup, perfect for print or email.",
    keywords: ["resize pdf", "change pdf page size", "pdf a4 to letter", "custom pdf dimensions"],
  },
  "n-up-pdf": {
    seoTitle: "N-up PDF — Multiple Pages Per Sheet for Printing",
    seoDescription:
      "Combine 2, 4, 6, or 8 PDF pages onto one sheet to save paper and ink. Free, no signup, perfect for printing handouts.",
    keywords: ["multiple pages per sheet pdf", "2 pages per sheet pdf", "4 up pdf printing", "pdf booklet layout"],
  },
  "blank-page-pdf": {
    seoTitle: "Add Blank Pages to PDF — Insert Empty Pages Free",
    seoDescription:
      "Insert blank pages anywhere in a PDF. Choose A4, Letter, or match source size. Free, no signup, no watermark.",
    keywords: ["add blank page to pdf", "insert blank page pdf", "add empty page pdf", "pdf insert page"],
  },
  "duplicate-pages-pdf": {
    seoTitle: "Duplicate PDF Pages — Copy Any Page In Place Free",
    seoDescription:
      "Duplicate any page in a PDF — clones land right after the original. Free, no signup, runs in your browser.",
    keywords: ["duplicate pdf page", "copy pdf page", "clone page pdf", "duplicate a page in pdf"],
  },
  "reverse-pdf": {
    seoTitle: "Reverse PDF Pages — Flip Order Free | CrispPDF",
    seoDescription:
      "Flip the order of every page in a PDF — fixes back-to-front scans in one click. Free, no signup, no watermark.",
    keywords: ["reverse pdf pages", "flip pdf page order", "reverse pdf scan order", "pdf back to front"],
  },
  "excel-to-pdf": {
    seoTitle: "Excel to PDF Free — Convert XLSX with Layout Intact",
    seoDescription:
      "Convert Excel (.xlsx, .xls) to PDF online free. Sheet-per-page layout, no watermark, no signup. Runs in your browser.",
    keywords: ["excel to pdf", "xlsx to pdf", "convert excel to pdf free", "spreadsheet to pdf"],
  },
  "html-to-pdf": {
    seoTitle: "HTML to PDF — Convert Web Page or HTML File Free",
    seoDescription:
      "Convert HTML files or live URLs into PDF. Keeps CSS layout. Free, no signup — perfect for archiving web pages.",
    keywords: ["html to pdf", "webpage to pdf", "save website as pdf", "html file to pdf"],
    howTo: [
      { name: "Paste a URL", text: "Enter the page URL you want to capture as a PDF." },
      { name: "We fetch and clean it", text: "Our server pulls the page, strips scripts and ads, and renders the readable text." },
      { name: "Download the PDF", text: "Get a clean, archive-ready PDF named after the page title." },
    ],
  },
  "pdf-to-ppt": {
    seoTitle: "PDF to PowerPoint — Convert PDF to PPTX Free Online",
    seoDescription:
      "Turn any PDF into an editable PowerPoint deck (.pptx). Preserves layout. Free, no signup, no watermark.",
    keywords: ["pdf to powerpoint", "pdf to pptx", "convert pdf to slides", "pdf to ppt converter free"],
  },
  "pdf-to-png": {
    seoTitle: "PDF to PNG — High-Quality Image Export Free",
    seoDescription:
      "Convert PDF pages to PNG images at up to 300 DPI. Download as ZIP. Free, no signup, runs in your browser.",
    keywords: ["pdf to png", "save pdf as png", "pdf to transparent png", "convert pdf png high quality"],
  },
  "extract-text-pdf": {
    seoTitle: "Extract Text From PDF — Clean .TXT Export Free",
    seoDescription:
      "Pull clean plain text out of any PDF. Perfect for LLM input, indexing, or archiving. Free, no signup.",
    keywords: ["extract text from pdf", "pdf to txt", "copy text from pdf", "pdf text extractor"],
  },
  "base64-pdf": {
    seoTitle: "PDF ↔ Base64 — Encode and Decode PDF Free",
    seoDescription:
      "Convert PDF files to Base64 strings or paste Base64 to download a PDF. Perfect for developers and email embeds.",
    keywords: ["pdf to base64", "base64 to pdf", "encode pdf base64", "decode base64 to pdf"],
  },
  "crop-pdf": {
    seoTitle: "Crop PDF Online — Trim Margins, Visible Drag Crop",
    seoDescription:
      "Crop PDF pages visually — drag a box, apply to one page or all. Free, no signup, no watermark.",
    keywords: ["crop pdf", "crop pdf pages", "trim pdf margins", "pdf cropper"],
  },
  "repair-pdf": {
    seoTitle: "Repair PDF Online — Fix Corrupted Files Free",
    seoDescription:
      "Try to recover and reopen a corrupted PDF. Runs in your browser, free, no signup. Works on most damaged files.",
    keywords: ["repair pdf", "fix corrupted pdf", "recover pdf file", "pdf file damaged repair"],
  },
  "grayscale-pdf": {
    seoTitle: "Grayscale PDF — Black & White Convert Free",
    seoDescription:
      "Convert color PDF to grayscale to save ink and reduce file size before printing. Free, no signup.",
    keywords: ["grayscale pdf", "convert pdf to black and white", "pdf color to grayscale", "save ink print pdf"],
  },
  "add-page-numbers-pdf": {
    seoTitle: "Add Page Numbers to PDF — Customize Position & Style",
    seoDescription:
      "Add page numbers to any PDF — custom font, position, format. Free, no signup, no watermark.",
    keywords: ["add page numbers to pdf", "pdf page numbering", "number pdf pages", "insert page numbers pdf"],
  },
  "add-watermark-text-pdf": {
    seoTitle: "Add Text Watermark to PDF — Draft, Confidential, Logo",
    seoDescription:
      "Add CONFIDENTIAL, DRAFT, or any text watermark to PDF. Custom angle, opacity, color. Free, no signup.",
    keywords: ["text watermark pdf", "confidential text watermark pdf", "draft stamp pdf", "add text watermark online"],
  },
  "extract-images-pdf": {
    seoTitle: "Extract Images From PDF — Save All Pictures Free",
    seoDescription:
      "Pull every image out of a PDF and download as a ZIP. Original resolution preserved. Free, no signup.",
    keywords: ["extract images from pdf", "pdf to images", "get all images from pdf", "save pictures from pdf"],
  },
  "invert-pdf": {
    seoTitle: "Invert PDF Colors — Dark Mode for Any PDF Free",
    seoDescription:
      "Flip PDF colors for night-time reading or printer ink savings. Free, no signup, runs in your browser.",
    keywords: ["invert pdf colors", "dark mode pdf", "negative pdf colors", "invert pdf white text"],
  },
  "compare-pdf": {
    seoTitle: "Compare PDF Files — Visual Diff Free | CrispPDF",
    seoDescription:
      "Compare two PDFs side by side and highlight differences. Free, no signup, runs in your browser.",
    keywords: ["compare pdf", "pdf diff online", "pdf compare two files", "find differences in pdfs"],
  },
  "flatten-pdf": {
    seoTitle: "Flatten PDF — Lock Forms & Annotations Free",
    seoDescription:
      "Flatten forms, annotations, and signatures into a final read-only PDF. Free, no signup, no watermark.",
    keywords: ["flatten pdf", "flatten pdf form", "merge layers pdf", "flatten annotations pdf"],
  },
  "pdf-to-pdfa": {
    seoTitle: "Convert PDF to PDF/A — Archival ISO Format Free",
    seoDescription:
      "Convert any PDF to PDF/A-1b or PDF/A-2b for long-term archival. Free, no signup, browser-based.",
    keywords: ["pdf to pdfa", "convert pdf to pdf/a", "archival pdf", "pdf/a-1b converter"],
  },
  "redact-pdf": {
    seoTitle: "Redact PDF — Black Out Sensitive Info Free",
    seoDescription:
      "Permanently black out names, numbers, or any content in a PDF. Local-only — file never uploaded. Free, no signup.",
    keywords: ["redact pdf", "black out text in pdf", "censor pdf", "hide sensitive info pdf"],
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

export function getAeoAnswer(slug: string, name: string, short: string, processing: "browser" | "server"): string {
  return (
    AEO_ANSWERS[slug] ??
    `${name} on CrispPDF is the fastest free way to ${short.toLowerCase()}. ${
      processing === "browser"
        ? "Runs entirely in your browser — your file is never uploaded."
        : "Server-assisted but files are processed in memory and discarded immediately."
    } No signup, no watermark, no daily limit.`
  );
}
