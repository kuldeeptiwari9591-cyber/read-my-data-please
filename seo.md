# CrispPDF SEO Reference

Complete SEO metadata (title, meta description, keywords, structured data) for every page on https://crisppdf.in.

Last updated: 2026-07-02

---

## Site-wide defaults (src/routes/__root.tsx)

- **Site name:** CrispPDF
- **Domain:** https://crisppdf.in
- **Default OG image:** /og-default.svg (per-tool dynamic SVG at /og/{slug}.svg)
- **Twitter card:** summary_large_image
- **Robots:** index, follow (admin/auth routes noindex)
- **Analytics:** GA4 (G-0YDJKTV4F2), Vercel Analytics, Vercel Speed Insights, PostHog, Sentry
- **Structured data (root):** Organization + WebSite JSON-LD
- **AI crawler manifests:** /llms.txt, /llms-full.txt, /ai.txt
- **Sitemap:** /sitemap.xml (196 URLs)
- **Robots.txt:** /robots.txt

---

## 1. Core pages

### / (homepage)
- **File:** `src/routes/index.tsx`
- **Title:** CrispPDF — 40 Free Online PDF Tools · No Signup
- **Description:** Merge, split, compress, convert, edit, sign, and protect PDFs online free. 40 privacy-first browser tools — no signup, no watermarks, no file uploads. Works on phone, tablet, and desktop.
- **OG image:** /og-default.svg
- **JSON-LD:** FAQPage (13 questions), WebSite, Organization
- **Canonical:** https://crisppdf.in/

### /about
- **File:** `src/routes/about.tsx`
- **Title:** About CrispPDF — How It Works & Why It's Free
- **Description:** How CrispPDF processes PDFs in your browser, why it's 100% free, and what sets it apart. 40 privacy-first tools — no signup, no watermarks, no ads.
- **Canonical:** https://crisppdf.in/about

### /about-crisppdf
- **File:** `src/routes/about-crisppdf.tsx`
- **Status:** 301 redirect → /why-crisppdf

### /why-crisppdf
- **File:** `src/routes/why-crisppdf.tsx`
- **Title:** Why CrispPDF — Private, Free PDF Tools In Your Browser
- **Description:** CrispPDF processes PDFs in your browser — files never touch our servers. No signup, no watermarks, no ads. 40 free tools built for speed and privacy.
- **Canonical:** https://crisppdf.in/why-crisppdf

### /faq
- **File:** `src/routes/faq.tsx`
- **Title:** FAQ — Frequently Asked Questions | CrispPDF
- **Description:** Answers to the most common questions about CrispPDF PDF tools. Privacy, file safety, supported formats, limits, and more.
- **JSON-LD:** FAQPage (50+ questions)
- **Canonical:** https://crisppdf.in/faq

### /contact
- **File:** `src/routes/contact.tsx`
- **Title:** Contact CrispPDF — Feedback, Bug Reports & Support
- **Description:** Get in touch with the CrispPDF team — send feedback, report a bug, request a new PDF tool, or ask a question. We read every message.
- **Canonical:** https://crisppdf.in/contact

### /feedback
- **File:** `src/routes/feedback.tsx`
- **Title:** Feedback & Feature Requests — CrispPDF
- **Description:** Send feedback, report a bug, or request a new PDF tool. We read every submission.
- **JSON-LD:** FAQPage (10 questions)
- **Canonical:** https://crisppdf.in/feedback

### /privacy
- **File:** `src/routes/privacy.tsx`
- **Title:** Privacy Policy — CrispPDF
- **Description:** How CrispPDF handles your files and personal data. Short version: we don't store them.
- **Canonical:** https://crisppdf.in/privacy

### /terms
- **File:** `src/routes/terms.tsx`
- **Title:** Terms of Service — CrispPDF
- **Description:** The rules for using CrispPDF. Short, plain-English, no surprises.
- **Canonical:** https://crisppdf.in/terms

### /blog
- **File:** `src/routes/blog.index.tsx`
- **Title:** PDF Tips & Guides — CrispPDF Blog
- **Description:** ,
          content:
            
- **Canonical:** https://crisppdf.in/blog

---

## 2. Category hub pages

### /organize-pdf
- **Title:** Organize PDF — Merge, Split, Compress & Reorder | CrispPDF
- **Description:** Free online tools to organize PDF files: merge, split, compress, rotate, reorder, delete, and extract pages. Browser-based, no signup, no watermark.
- **Canonical:** https://crisppdf.in/organize-pdf

### /convert-pdf
- **Title:** Convert PDF — Word, Excel, JPG, PNG & More | CrispPDF
- **Description:** Free PDF converters: PDF to Word, Excel, JPG, PNG, PPT. Also Word, Excel, JPG, and HTML to PDF. No signup, no watermark, no file upload required.
- **Canonical:** https://crisppdf.in/convert-pdf

### /edit-pdf
- **Title:** Edit PDF — Crop, Watermark, Sign, OCR, Numbers | CrispPDF
- **Description:** Edit PDFs free online: crop, add watermarks, sign, OCR, page numbers, extract images, edit metadata, and more. Browser-based, no signup.
- **Canonical:** https://crisppdf.in/edit-pdf

### /secure-pdf
- **Title:** Secure PDF — Protect, Unlock, Redact, Flatten | CrispPDF
- **Description:** Free tools to secure PDF files: password-protect, unlock, redact, flatten, and PDF/A archive. No signup, no upload — your confidential files stay local.
- **Canonical:** https://crisppdf.in/secure-pdf

---

## 3. Tool pages (40 tools)

Each tool page includes: title, meta description, keywords, OG tags, Twitter card, canonical, hreflang, and 6 JSON-LD blocks (WebApplication, HowTo, FAQPage, BreadcrumbList, Speakable, Question×3).

Metadata generator: `src/lib/tool-head.ts` → `buildToolHead(slug)`
Content source: `src/lib/tool-content.ts`

### /merge-pdf — Merge PDF
- **Title:** Merge PDF Online Free — Combine Files In Browser | CrispPDF
- **Description:** Merge PDF files online free. Combine unlimited PDFs in your browser — no upload, no signup, no watermark. Works on phone, tablet, desktop.
- **Keywords:** merge pdf, combine pdf, pdf merger, how to merge pdf files, merge pdf online free, join pdf files
- **Canonical:** https://crisppdf.in/merge-pdf
- **OG image:** https://crisppdf.in/og/merge-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /split-pdf — Split PDF
- **Title:** Split PDF Online — Extract Pages or Split by Range
- **Description:** Split a PDF into separate files by page, range, or every N pages. Free, no signup, runs locally in your browser. Keeps original quality.
- **Keywords:** split pdf, pdf splitter, pdf split, how to split pdf into multiple files, split pdf by page range, extract pages from pdf
- **Canonical:** https://crisppdf.in/split-pdf
- **OG image:** https://crisppdf.in/og/split-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /compress-pdf — Compress PDF
- **Title:** Compress PDF Online Free — Shrink to 100KB, 200KB, 1MB
- **Description:** Compress PDF instantly in your browser. Hit 100KB, 200KB or any size target — perfect for email, WhatsApp, or government forms. No watermark.
- **Keywords:** compress pdf, pdf compressor, reduce pdf size, compress pdf to 100kb, compress pdf to 200kb, compress pdf without losing quality, shrink pdf
- **Canonical:** https://crisppdf.in/compress-pdf
- **OG image:** https://crisppdf.in/og/compress-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /pdf-to-word — PDF to Word
- **Title:** PDF to Word Converter Free — No Watermark, No Signup
- **Description:** Convert PDF to editable Word (.docx) free online. Keeps formatting, tables, images. No watermark, no email gate — opens in MS Word and Google Docs.
- **Keywords:** pdf to word, convert pdf to word, pdf to docx, pdf to word converter free, how to convert pdf to word, pdf to word no watermark
- **Canonical:** https://crisppdf.in/pdf-to-word
- **OG image:** https://crisppdf.in/og/pdf-to-word.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /pdf-to-excel — PDF to Excel
- **Title:** PDF to Excel — Extract Tables to XLSX Free | CrispPDF
- **Description:** Pull tables out of any PDF into Excel (.xlsx) — keeps rows and columns intact. Free, no signup, no watermark. Ideal for invoices and statements.
- **Keywords:** pdf to excel, convert pdf to excel, pdf to xls, pdf table to excel, pdf bank statement to excel, extract tables from pdf
- **Canonical:** https://crisppdf.in/pdf-to-excel
- **OG image:** https://crisppdf.in/og/pdf-to-excel.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /pdf-to-ppt — PDF to PowerPoint
- **Title:** PDF to PowerPoint — Convert PDF to PPTX Free Online
- **Description:** Turn any PDF into an editable PowerPoint deck (.pptx). Preserves layout. Free, no signup, no watermark.
- **Keywords:** pdf to powerpoint, pdf to pptx, convert pdf to slides, pdf to ppt converter free
- **Canonical:** https://crisppdf.in/pdf-to-ppt
- **OG image:** https://crisppdf.in/og/pdf-to-ppt.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /pdf-to-jpg — PDF to JPG
- **Title:** PDF to JPG Free — High-Quality Image Export In Browser
- **Description:** Convert every page of a PDF into JPG images at up to 300 DPI. Download individually or as a ZIP. Free, no signup, runs in your browser.
- **Keywords:** pdf to jpg, pdf to jpeg, pdf to image, pdf to jpg converter free, pdf to jpg high quality, convert pdf pages to jpg
- **Canonical:** https://crisppdf.in/pdf-to-jpg
- **OG image:** https://crisppdf.in/og/pdf-to-jpg.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /pdf-to-png — PDF to PNG
- **Title:** PDF to PNG — High-Quality Image Export Free
- **Description:** Convert PDF pages to PNG images at up to 300 DPI. Download as ZIP. Free, no signup, runs in your browser.
- **Keywords:** pdf to png, save pdf as png, pdf to transparent png, convert pdf png high quality
- **Canonical:** https://crisppdf.in/pdf-to-png
- **OG image:** https://crisppdf.in/og/pdf-to-png.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /word-to-pdf — Word to PDF
- **Title:** Word to PDF Converter Free — Keeps Formatting Intact
- **Description:** Convert DOCX or DOC to PDF online free. Preserves fonts, tables, images, and headers. No signup, no watermark, no upload — done in seconds.
- **Keywords:** word to pdf, docx to pdf, doc to pdf, convert word to pdf free, word to pdf no watermark, save word as pdf
- **Canonical:** https://crisppdf.in/word-to-pdf
- **OG image:** https://crisppdf.in/og/word-to-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /excel-to-pdf — Excel to PDF
- **Title:** Excel to PDF Free — Convert XLSX with Layout Intact
- **Description:** Convert Excel (.xlsx, .xls) to PDF online free. Sheet-per-page layout, no watermark, no signup. Runs in your browser.
- **Keywords:** excel to pdf, xlsx to pdf, convert excel to pdf free, spreadsheet to pdf
- **Canonical:** https://crisppdf.in/excel-to-pdf
- **OG image:** https://crisppdf.in/og/excel-to-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /jpg-to-pdf — JPG to PDF
- **Title:** JPG to PDF — Convert Images to PDF Free | CrispPDF
- **Description:** Turn JPG, PNG, WebP or HEIC images into one PDF. Drag-and-drop, reorder, set page size. Free forever, no upload to any server.
- **Keywords:** jpg to pdf, image to pdf, jpeg to pdf, convert jpg to pdf free, multiple jpg to one pdf, jpg to pdf passport size
- **Canonical:** https://crisppdf.in/jpg-to-pdf
- **OG image:** https://crisppdf.in/og/jpg-to-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /html-to-pdf — HTML to PDF
- **Title:** HTML to PDF — Convert Web Page or HTML File Free
- **Description:** Convert HTML files or live URLs into PDF. Keeps CSS layout. Free, no signup — perfect for archiving web pages.
- **Keywords:** html to pdf, webpage to pdf, save website as pdf, html file to pdf
- **Canonical:** https://crisppdf.in/html-to-pdf
- **OG image:** https://crisppdf.in/og/html-to-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /rotate-pdf — Rotate PDF
- **Title:** Rotate PDF Online — Fix Sideways Pages In Seconds
- **Description:** Rotate one page or every page in a PDF — 90°, 180°, 270°. Saves permanently, no watermark. Free, no signup, runs in your browser.
- **Keywords:** rotate pdf, pdf rotate, rotate pdf and save permanently, rotate specific pages in pdf, rotate pdf online free
- **Canonical:** https://crisppdf.in/rotate-pdf
- **OG image:** https://crisppdf.in/og/rotate-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /reorder-pdf-pages — Reorder Pages
- **Title:** Reorder PDF Pages — Drag & Drop Reordering Free
- **Description:** Drag and drop to reorder PDF pages. Live thumbnails, instant download. Free, no signup, runs in your browser.
- **Keywords:** rearrange pdf pages, reorder pdf pages, drag pages pdf, sort pdf pages
- **Canonical:** https://crisppdf.in/reorder-pdf-pages
- **OG image:** https://crisppdf.in/og/reorder-pdf-pages.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /delete-pdf-pages — Delete Pages
- **Title:** Delete PDF Pages Free — Remove Pages In Browser
- **Description:** Remove unwanted pages from any PDF. Visual preview, batch delete, instant download. Free, no signup, no watermark.
- **Keywords:** delete pages from pdf, remove pages from pdf, delete blank pages pdf, remove specific pdf pages
- **Canonical:** https://crisppdf.in/delete-pdf-pages
- **OG image:** https://crisppdf.in/og/delete-pdf-pages.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /extract-pdf-pages — Extract Pages
- **Title:** Extract PDF Pages — Save Pages as Separate PDF
- **Description:** Pick any pages from a PDF and save them as a new file. Free, no signup, no watermark — runs entirely in your browser.
- **Keywords:** extract pages from pdf, pull pages out of pdf, save pdf page as new pdf, extract chapter pdf
- **Canonical:** https://crisppdf.in/extract-pdf-pages
- **OG image:** https://crisppdf.in/og/extract-pdf-pages.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /crop-pdf — Crop PDF
- **Title:** Crop PDF Online — Trim Margins, Visible Drag Crop
- **Description:** Crop PDF pages visually — drag a box, apply to one page or all. Free, no signup, no watermark.
- **Keywords:** crop pdf, crop pdf pages, trim pdf margins, pdf cropper
- **Canonical:** https://crisppdf.in/crop-pdf
- **OG image:** https://crisppdf.in/og/crop-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /repair-pdf — Repair PDF
- **Title:** Repair PDF Online — Fix Corrupted Files Free
- **Description:** Try to recover and reopen a corrupted PDF. Runs in your browser, free, no signup. Works on most damaged files.
- **Keywords:** repair pdf, fix corrupted pdf, recover pdf file, pdf file damaged repair
- **Canonical:** https://crisppdf.in/repair-pdf
- **OG image:** https://crisppdf.in/og/repair-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /flatten-pdf — Flatten PDF
- **Title:** Flatten PDF — Lock Forms & Annotations Free
- **Description:** Flatten forms, annotations, and signatures into a final read-only PDF. Free, no signup, no watermark.
- **Keywords:** flatten pdf, flatten pdf form, merge layers pdf, flatten annotations pdf
- **Canonical:** https://crisppdf.in/flatten-pdf
- **OG image:** https://crisppdf.in/og/flatten-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /pdf-to-pdfa — PDF to PDF/A
- **Title:** Convert PDF to PDF/A — Archival ISO Format Free
- **Description:** Convert any PDF to PDF/A-1b or PDF/A-2b for long-term archival. Free, no signup, browser-based.
- **Keywords:** pdf to pdfa, convert pdf to pdf/a, archival pdf, pdf/a-1b converter
- **Canonical:** https://crisppdf.in/pdf-to-pdfa
- **OG image:** https://crisppdf.in/og/pdf-to-pdfa.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /grayscale-pdf — Grayscale PDF
- **Title:** Grayscale PDF — Black & White Convert Free
- **Description:** Convert color PDF to grayscale to save ink and reduce file size before printing. Free, no signup.
- **Keywords:** grayscale pdf, convert pdf to black and white, pdf color to grayscale, save ink print pdf
- **Canonical:** https://crisppdf.in/grayscale-pdf
- **OG image:** https://crisppdf.in/og/grayscale-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /protect-pdf — Protect PDF
- **Title:** Password Protect PDF Online — AES-256 Encryption Free
- **Description:** Add a password to any PDF in your browser. AES-256 encryption, no upload, no signup. Lock from opening, editing, copying, or printing — all free.
- **Keywords:** protect pdf, password protect pdf, how to password protect a pdf, encrypt pdf online, add password to pdf, lock pdf from editing
- **Canonical:** https://crisppdf.in/protect-pdf
- **OG image:** https://crisppdf.in/og/protect-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /unlock-pdf — Unlock PDF
- **Title:** Unlock PDF Free — Remove Password From PDF In Browser
- **Description:** Remove password protection from PDF files you own. Works in your browser — file never leaves your device. Free, no signup, no quota.
- **Keywords:** unlock pdf, remove password from pdf, pdf unlocker, how to remove password from pdf, unlock pdf without password, decrypt pdf online
- **Canonical:** https://crisppdf.in/unlock-pdf
- **OG image:** https://crisppdf.in/og/unlock-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /redact-pdf — Redact PDF
- **Title:** Redact PDF — Black Out Sensitive Info Free
- **Description:** Permanently black out names, numbers, or any content in a PDF. Local-only — file never uploaded. Free, no signup.
- **Keywords:** redact pdf, black out text in pdf, censor pdf, hide sensitive info pdf
- **Canonical:** https://crisppdf.in/redact-pdf
- **OG image:** https://crisppdf.in/og/redact-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /esign-pdf — eSign PDF
- **Title:** Sign PDF Online Free — Draw, Type or Upload Signature
- **Description:** Add a legally valid e-signature to any PDF. Draw, type, or upload — done in your browser. No DocuSign account, no email gate, no watermark.
- **Keywords:** sign pdf, esign pdf, electronic signature pdf, sign pdf without adobe, add signature to pdf free, digital signature pdf online
- **Canonical:** https://crisppdf.in/esign-pdf
- **OG image:** https://crisppdf.in/og/esign-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /watermark-pdf — Watermark PDF
- **Title:** Add Watermark to PDF — Text or Logo, Free | CrispPDF
- **Description:** Add text or image watermarks to any PDF. Choose font, opacity, position, rotation. Free, no signup — file never leaves your browser.
- **Keywords:** watermark pdf, add watermark to pdf, how to make watermark on pdf, add draft watermark to pdf, watermark pdf with logo, confidential watermark pdf
- **Canonical:** https://crisppdf.in/watermark-pdf
- **OG image:** https://crisppdf.in/og/watermark-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /ocr-pdf — OCR PDF
- **Title:** OCR PDF Online — Make Scanned PDFs Searchable Free
- **Description:** Turn scanned PDFs into searchable, copyable text using browser OCR. Works on receipts, lecture notes, ID scans. Free, no signup, multilingual.
- **Keywords:** ocr pdf, pdf to text, make pdf searchable, how to ocr a pdf, convert scanned pdf to text, searchable pdf from scan
- **Canonical:** https://crisppdf.in/ocr-pdf
- **OG image:** https://crisppdf.in/og/ocr-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /add-page-numbers-pdf — Add Page Numbers
- **Title:** Add Page Numbers to PDF — Customize Position & Style
- **Description:** Add page numbers to any PDF — custom font, position, format. Free, no signup, no watermark.
- **Keywords:** add page numbers to pdf, pdf page numbering, number pdf pages, insert page numbers pdf
- **Canonical:** https://crisppdf.in/add-page-numbers-pdf
- **OG image:** https://crisppdf.in/og/add-page-numbers-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /add-watermark-text-pdf — Add Watermark Text
- **Title:** Add Text Watermark to PDF — Draft, Confidential, Logo
- **Description:** Add CONFIDENTIAL, DRAFT, or any text watermark to PDF. Custom angle, opacity, color. Free, no signup.
- **Keywords:** text watermark pdf, confidential text watermark pdf, draft stamp pdf, add text watermark online
- **Canonical:** https://crisppdf.in/add-watermark-text-pdf
- **OG image:** https://crisppdf.in/og/add-watermark-text-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /extract-images-pdf — Extract Images
- **Title:** Extract Images From PDF — Save All Pictures Free
- **Description:** Pull every image out of a PDF and download as a ZIP. Original resolution preserved. Free, no signup.
- **Keywords:** extract images from pdf, pdf to images, get all images from pdf, save pictures from pdf
- **Canonical:** https://crisppdf.in/extract-images-pdf
- **OG image:** https://crisppdf.in/og/extract-images-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /invert-pdf — Invert Colors PDF
- **Title:** Invert PDF Colors — Dark Mode for Any PDF Free
- **Description:** Flip PDF colors for night-time reading or printer ink savings. Free, no signup, runs in your browser.
- **Keywords:** invert pdf colors, dark mode pdf, negative pdf colors, invert pdf white text
- **Canonical:** https://crisppdf.in/invert-pdf
- **OG image:** https://crisppdf.in/og/invert-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /resize-pdf — Resize PDF
- **Title:** Resize PDF — Change Page Size to A4, Letter, Custom
- **Description:** Resize PDF pages to A4, Letter, A5, or custom dimensions. Free, no signup, perfect for print or email.
- **Keywords:** resize pdf, change pdf page size, pdf a4 to letter, custom pdf dimensions
- **Canonical:** https://crisppdf.in/resize-pdf
- **OG image:** https://crisppdf.in/og/resize-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /n-up-pdf — N-up PDF
- **Title:** N-up PDF — Multiple Pages Per Sheet for Printing
- **Description:** Combine 2, 4, 6, or 8 PDF pages onto one sheet to save paper and ink. Free, no signup, perfect for printing handouts.
- **Keywords:** multiple pages per sheet pdf, 2 pages per sheet pdf, 4 up pdf printing, pdf booklet layout
- **Canonical:** https://crisppdf.in/n-up-pdf
- **OG image:** https://crisppdf.in/og/n-up-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /blank-page-pdf — Insert Blank Pages
- **Title:** Add Blank Pages to PDF — Insert Empty Pages Free
- **Description:** Insert blank pages anywhere in a PDF. Choose A4, Letter, or match source size. Free, no signup, no watermark.
- **Keywords:** add blank page to pdf, insert blank page pdf, add empty page pdf, pdf insert page
- **Canonical:** https://crisppdf.in/blank-page-pdf
- **OG image:** https://crisppdf.in/og/blank-page-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /duplicate-pages-pdf — Duplicate Pages
- **Title:** Duplicate PDF Pages — Copy Any Page In Place Free
- **Description:** Duplicate any page in a PDF — clones land right after the original. Free, no signup, runs in your browser.
- **Keywords:** duplicate pdf page, copy pdf page, clone page pdf, duplicate a page in pdf
- **Canonical:** https://crisppdf.in/duplicate-pages-pdf
- **OG image:** https://crisppdf.in/og/duplicate-pages-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /extract-text-pdf — Extract Text
- **Title:** Extract Text From PDF — Clean .TXT Export Free
- **Description:** Pull clean plain text out of any PDF. Perfect for LLM input, indexing, or archiving. Free, no signup.
- **Keywords:** extract text from pdf, pdf to txt, copy text from pdf, pdf text extractor
- **Canonical:** https://crisppdf.in/extract-text-pdf
- **OG image:** https://crisppdf.in/og/extract-text-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /edit-metadata-pdf — Edit PDF Metadata
- **Title:** Edit PDF Metadata Online — Title, Author, Keywords
- **Description:** Edit PDF title, author, subject, and keywords without Acrobat. Works on locked files you own. Free, no signup, runs in your browser.
- **Keywords:** edit pdf metadata, change pdf title author, edit pdf without acrobat, online pdf editor, free pdf editor, pdf properties editor
- **Canonical:** https://crisppdf.in/edit-metadata-pdf
- **OG image:** https://crisppdf.in/og/edit-metadata-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /compare-pdf — Compare PDFs
- **Title:** Compare PDF Files — Visual Diff Free | CrispPDF
- **Description:** Compare two PDFs side by side and highlight differences. Free, no signup, runs in your browser.
- **Keywords:** compare pdf, pdf diff online, pdf compare two files, find differences in pdfs
- **Canonical:** https://crisppdf.in/compare-pdf
- **OG image:** https://crisppdf.in/og/compare-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /base64-pdf — PDF ↔ Base64
- **Title:** PDF ↔ Base64 — Encode and Decode PDF Free
- **Description:** Convert PDF files to Base64 strings or paste Base64 to download a PDF. Perfect for developers and email embeds.
- **Keywords:** pdf to base64, base64 to pdf, encode pdf base64, decode base64 to pdf
- **Canonical:** https://crisppdf.in/base64-pdf
- **OG image:** https://crisppdf.in/og/base64-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

### /reverse-pdf — Reverse PDF
- **Title:** Reverse PDF Pages — Flip Order Free | CrispPDF
- **Description:** Flip the order of every page in a PDF — fixes back-to-front scans in one click. Free, no signup, no watermark.
- **Keywords:** reverse pdf pages, flip pdf page order, reverse pdf scan order, pdf back to front
- **Canonical:** https://crisppdf.in/reverse-pdf
- **OG image:** https://crisppdf.in/og/reverse-pdf.svg
- **JSON-LD:** WebApplication · HowTo · FAQPage · BreadcrumbList · Speakable · Question×3

---

## 4. Programmatic SEO pages

### Size-target compression pages (9)
- **/compress-pdf-to-100kb** — "Compress PDF to 100KB — Free Online | CrispPDF"
- **/compress-pdf-to-200kb** — "Compress PDF to 200KB — Free Online | CrispPDF"
- **/compress-pdf-to-300kb** — "Compress PDF to 300KB — Free Online | CrispPDF"
- **/compress-pdf-to-500kb** — "Compress PDF to 500KB — Free Online | CrispPDF"
- **/compress-pdf-to-1mb** — "Compress PDF to 1MB — Free Online | CrispPDF"
- **/compress-pdf-to-2mb** — "Compress PDF to 2MB — Free Online | CrispPDF"
- **/compress-pdf-to-5mb** — "Compress PDF to 5MB — Free Online | CrispPDF"
- **/compress-pdf-to-10mb** — "Compress PDF to 10MB — Free Online | CrispPDF"
- **/compress-pdf-for-email** — email-optimised compression
- **/compress-pdf-for-whatsapp** — WhatsApp share limit
- **/compress-pdf-for-passport-photo** — passport-photo preset

### Format aliases (10)
- **/png-to-pdf**
- **/webp-to-pdf**
- **/heic-to-pdf**
- **/csv-to-pdf**
- **/txt-to-pdf**
- **/base64-pdf**
- **/blank-page-pdf**
- **/n-up-pdf**
- **/invert-pdf**
- **/reverse-pdf**
- **/duplicate-pages-pdf**
- **/extract-text-pdf**
- **/edit-metadata-pdf**
- **/compare-pdf**
- **/resize-pdf**

### Dynamic pSEO routes
- **/use-cases/{tool}-for-{use-case}** — use-case × tool combinations (see `src/lib/pseo/use-cases.ts`)
- **/vs/{tool}-vs-{competitor}** — comparison pages vs iLovePDF, Smallpdf, PDF24, Adobe, Sejda (see `src/lib/pseo/competitors.ts`)
- **/convert/{format}-to-{format}** — format-conversion pairs (see `src/lib/pseo/formats.ts`)
- **/blog/{slug}** — 12 planned posts (see `docs/seo/05-blog-plan.md`)
- **/tools/{slug}** — alias route for legacy tool URLs

---

## 5. Excluded from index (noindex)

- `/auth`, `/auth/callback` — authentication pages
- `/_authenticated/*` — admin panel (obfuscated path `/cp-crisp-7x92k`)
- `/feedback` thank-you states

---

## 6. Technical SEO files

| File | Path | Purpose |
|---|---|---|
| Sitemap | `/sitemap.xml` | 196 URLs, weekly changefreq |
| Robots | `/robots.txt` | Allow all; sitemap declared |
| LLMs manifest | `/llms.txt` | AI-crawler summary |
| LLMs full | `/llms-full.txt` | Full content for LLMs |
| AI policy | `/ai.txt` | AI-training opt-in signals |
| OG image | `/og/{slug}.svg` | Per-tool dynamic SVG |

---

## 7. Structured data inventory

| Schema type | Where |
|---|---|
| Organization | Root (`__root.tsx`) |
| WebSite + SearchAction | Root |
| WebApplication | Every tool page |
| HowTo | Every tool page |
| FAQPage | Tool pages, /faq, /feedback, home |
| BreadcrumbList | Tool, hub, pSEO, blog |
| Article | Blog posts |
| Speakable | Tool pages, pSEO |
| Question | Top 3 FAQs per tool (for AI Overviews) |

---

## 8. Analytics & tracking events

GA4 (`G-0YDJKTV4F2`) + PostHog capture:

- `page_view` — every SPA navigation
- `tool_view` — tool page load
- `file_upload` — user drops a file
- `tool_complete` — successful download (with bytes in/out, duration)
- `tool_error` — failures
- `share_click` — social share buttons
- `outbound_click` — external-domain links
- `scroll_depth` — 90% scroll milestone
- `web_vitals` — LCP, FID, CLS, INP, TTFB

All tool completions also logged to Supabase `operations` table for admin analytics.

---

## 9. Source-of-truth files

- `src/lib/tools.ts` — 40-tool registry
- `src/lib/tool-content.ts` — per-tool SEO copy, HowTo, FAQ
- `src/lib/tool-head.ts` — head() builder for tool routes
- `src/lib/site-url.ts` — absolute-URL helper
- `src/lib/seo/jsonld.ts` — JSON-LD generators
- `src/lib/seo/faq-jsonld.ts` — FAQ JSON-LD helper
- `src/lib/hreflang.ts` — hreflang link generator
- `src/lib/pseo/*.ts` — pSEO data (use-cases, competitors, formats, size-targets)
- `docs/seo/*.md` — 9-file keyword research pack
