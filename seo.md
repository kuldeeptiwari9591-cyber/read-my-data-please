# CrispPDF — SEO Ledger

_Regenerated automatically from `src/lib/tools.ts` + `src/lib/tool-content.ts`._ 
_Last update: 2026-07-05._

## How SEO is wired

- **Root defaults** live in `src/routes/__root.tsx` (viewport, charset, favicon, default OG image `/og-default.svg`).
- **Per-tool head** is built by `buildToolHead(slug)` in `src/lib/tool-head.ts`, which pulls title/description/keywords/body/FAQs from `src/lib/tool-content.ts` and per-tool howTo steps from `src/lib/tool-howto.ts`.
- **JSON-LD emitted per tool page**: WebApplication, HowTo, FAQPage, BreadcrumbList, SpeakableSpecification, plus a Question node for the top 3 FAQs.
- **OG image**: `/og/{slug}.svg` (dynamic per tool), 1200×630.
- **Canonical + hreflang**: absolute URL from `abs(path)`; hreflang links added via `hreflangLinks()`.
- **Sitemap**: `src/routes/sitemap[.]xml.ts` enumerates every route; `public/robots.txt` allows all.
- **AI/LLM discovery**: `src/routes/ai[.]txt.ts`, `llms[.]txt.ts`, `llms-full[.]txt.ts`.

## Static / marketing routes

| Path | Head owner |
|---|---|
| `/` | `src/routes/index.tsx` |
| `/about` | `src/routes/about.tsx` |
| `/about-crisppdf` | `src/routes/about-crisppdf.tsx` |
| `/why-crisppdf` | `src/routes/why-crisppdf.tsx` |
| `/faq` | `src/routes/faq.tsx` |
| `/contact` | `src/routes/contact.tsx` |
| `/feedback` | `src/routes/feedback.tsx` |
| `/privacy` | `src/routes/privacy.tsx` |
| `/terms` | `src/routes/terms.tsx` |
| `/blog` | `src/routes/blog.index.tsx` |
| `/blog/:slug` | `src/routes/blog.$slug.tsx` |
| `/use-cases/:slug` | `src/routes/use-cases.$slug.tsx` |
| `/vs/:slug` | `src/routes/vs.$slug.tsx` |
| `/convert/:slug` | `src/routes/convert.$slug.tsx` |
| `/compress-pdf-to-{100kb,200kb,300kb,500kb,1mb,2mb,5mb,10mb}` | `src/routes/compress-pdf-to-*.tsx` |
| `/compress-pdf-for-{email,whatsapp,passport-photo}` | `src/routes/compress-pdf-for-*.tsx` |

## Tool routes (40)

Each row → route file `src/routes/{slug}.tsx`, which renders `<ToolPageView slug="{slug}">` and uses `buildToolHead("{slug}")` for its `<head>`.

### `/merge-pdf` — Merge PDF
- **Category:** organize
- **Title:** Merge PDF Files Online | Combine PDFs Securely - CrispPDF
- **Description:** Quickly stitch multiple PDF documents into one organized file. Drag, drop, and reorder pages instantly without downloading any software.
- **Keywords:** merge pdf, combine pdf files mac, free pdf merger tool, stitch pdf pages together, combine multiple documents into one pdf, reorder and merge pdf pages, merge aadhaar and pan pdf, multiple pdf to single pdf kaise kare, join marksheet pdf free, combine bank statements into one pdf, merge 2 pdf files online
- **OG image:** `/og/merge-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/split-pdf` — Split PDF
- **Category:** organize
- **Title:** Split PDF Files Online | Free PDF Page Extractor - CrispPDF
- **Description:** Extract specific pages or break a large PDF into multiple smaller documents easily. A fast, secure, and free online PDF splitter.
- **Keywords:** split pdf, separate pdf pages into individual files, extract one page from pdf mac, free pdf page cutter, save specific pages of a pdf, split pdf by file size, split pdf pages free online, pdf split kaise kare mobile me, extract page from ssc marksheet pdf, separate blank pages from pdf, cut pdf into two parts
- **OG image:** `/og/split-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/compress-pdf` — Compress PDF
- **Category:** organize
- **Title:** Compress PDF Online Free | Reduce File Size - CrispPDF
- **Description:** Shrink large PDF files for email attachments and fast web uploads without losing visual quality. Process documents securely in your browser.
- **Keywords:** compress pdf, reduce pdf file size mac, compress pdf for email attachment, shrink pdf without losing quality, best free pdf compressor, optimize pdf for web, compress pdf to 100kb, pdf size reducer 200kb for ssc, compress aadhaar pdf to 50kb, reduce pdf size for government exam form, pdf compress kaise kare
- **OG image:** `/og/compress-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/pdf-to-word` — PDF to Word
- **Category:** convert-from
- **Title:** Convert PDF to Word Online | Free DOCX Converter - CrispPDF
- **Description:** Turn PDF documents into editable Word files while keeping your original text, tables, and formatting intact. No email signup required.
- **Keywords:** pdf to word, pdf to docx converter mac, convert pdf to editable word free, pdf to word keep formatting, best pdf to word without adobe, turn pdf into word document, pdf to word converter free online, convert marksheet pdf to word, editable word file from pdf, pdf se word kaise banaye, convert hindi pdf to word
- **OG image:** `/og/pdf-to-word.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/pdf-to-excel` — PDF to Excel
- **Category:** convert-from
- **Title:** Convert PDF to Excel | Extract Tables to XLSX - CrispPDF
- **Description:** Pull data tables out of invoices and reports directly into an editable Excel spreadsheet. Keeps your rows and columns perfectly intact.
- **Keywords:** pdf to excel, convert pdf to excel keeping columns, extract tables from pdf to spreadsheet, best pdf to xlsx converter, turn pdf invoice into excel data, pdf to csv free, pdf bank statement to excel, convert pdf table to excel, sbi statement pdf to excel free, extract data from pdf to xls, pdf to excel kaise kare
- **OG image:** `/og/pdf-to-excel.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/pdf-to-ppt` — PDF to PowerPoint
- **Category:** convert-from
- **Title:** Convert PDF to PowerPoint | Free PPTX Slides - CrispPDF
- **Description:** Turn any PDF report into an editable PowerPoint deck. Preserves your layout, fonts, and images perfectly for your next presentation.
- **Keywords:** pdf to ppt, turn pdf into presentation slides, pdf to pptx converter mac, best pdf to powerpoint tool, editable ppt from pdf, convert pdf to google slides, pdf to powerpoint converter free, convert study notes pdf to ppt, pdf se ppt kaise banaye, presentation from pdf file, free pdf to pptx online
- **OG image:** `/og/pdf-to-ppt.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/pdf-to-jpg` — PDF to JPG
- **Category:** convert-from
- **Title:** Convert PDF to JPG Online | High Quality Image Export
- **Description:** Convert every page of your PDF into high-quality JPG images at up to 300 DPI. Download individually or as a single ZIP file instantly.
- **Keywords:** pdf to jpg, convert pdf to high resolution image, turn pdf pages into jpg mac, extract pictures from pdf file, pdf to jpeg 300 dpi, best free pdf to image converter, pdf to jpg converter 50kb, extract photo from exam pdf, convert aadhaar pdf to image, pdf ko photo kaise banaye, multi page pdf to jpg
- **OG image:** `/og/pdf-to-jpg.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/pdf-to-png` — PDF to PNG
- **Category:** convert-from
- **Title:** Convert PDF to PNG Online | High Resolution Images
- **Description:** Convert your PDF pages into sharp, high-resolution PNG images. Perfect for maintaining graphic quality and handling transparent backgrounds.
- **Keywords:** pdf to png, convert pdf to transparent png, high res pdf to png mac, save pdf as png file, turn vector pdf to png, batch convert pdf to png, pdf to png converter high quality, transparent logo pdf to png, extract sign from pdf, pdf se png kaise banaye, clear image from pdf free
- **OG image:** `/og/pdf-to-png.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/word-to-pdf` — Word to PDF
- **Category:** convert-to
- **Title:** Convert Word to PDF | DOCX to PDF Free - CrispPDF
- **Description:** Lock in your document formatting by converting DOCX or DOC files to PDF. Preserves fonts, tables, and images perfectly for sharing.
- **Keywords:** word to pdf, convert docx to pdf mac, save word document as pdf, best word to pdf keeping formatting, word to pdf high quality print, doc to pdf online converter, word to pdf converter free, docx to pdf mobile me kaise kare, save resume as pdf online, convert ms word to pdf format, word to pdf without software
- **OG image:** `/og/word-to-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/excel-to-pdf` — Excel to PDF
- **Category:** convert-to
- **Title:** Convert Excel to PDF | Fit Spreadsheets to PDF Page
- **Description:** Convert XLSX spreadsheets into professional PDF reports. Automatically adjusts formatting so all your columns fit neatly on the page.
- **Keywords:** excel to pdf, convert xlsx to pdf mac, save excel spreadsheet as pdf, fit excel columns to pdf page, best excel to pdf converter free, export xls to pdf, excel sheet to pdf converter, convert salary slip xls to pdf, excel to pdf print preview, fit excel to one page pdf, excel ko pdf kaise banaye
- **OG image:** `/og/excel-to-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/jpg-to-pdf` — JPG to PDF
- **Category:** convert-to
- **Title:** Convert JPG to PDF | Image to PDF Maker - CrispPDF
- **Description:** Transform JPG, PNG, and HEIC images into a single, high-quality PDF document. Quickly combine receipts or portfolio photos into one file.
- **Keywords:** jpg to pdf, convert jpeg to pdf mac, turn photos into pdf file, combine jpg files into one pdf, high resolution image to pdf, free picture to pdf converter, photo to pdf maker 50kb, mobile se photo ko pdf kaise banaye, combine front back aadhaar to pdf, multiple images to single pdf, picture to pdf online
- **OG image:** `/og/jpg-to-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/html-to-pdf` — HTML to PDF
- **Category:** convert-to
- **Title:** Convert HTML to PDF | Webpage to PDF Free - CrispPDF
- **Description:** Convert live URLs or raw HTML files directly into formatted PDF documents. Perfect for archiving webpages and creating offline backups.
- **Keywords:** html to pdf, convert url to pdf mac, save website as pdf document, capture webpage to pdf high quality, best html to pdf tool free, web to pdf converter, save webpage as pdf mobile, html code to pdf converter online, convert website page to pdf, webpage ko pdf kaise banaye, download article as pdf
- **OG image:** `/og/html-to-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/rotate-pdf` — Rotate PDF
- **Category:** organize
- **Title:** Rotate PDF Pages | Fix Sideways Documents - CrispPDF
- **Description:** Easily rotate one page or all pages in your PDF by 90 or 180 degrees. Fix sideways scans and save your document permanently in seconds.
- **Keywords:** rotate pdf, rotate pdf 90 degrees, fix upside down pdf pages mac, rotate specific pages in pdf file, save rotated pdf document, best free pdf rotator, rotate sideways pdf page, pdf ko seedha kaise kare, correct upside down pdf scan, rotate and save pdf permanently, rotate single page in pdf
- **OG image:** `/og/rotate-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/reorder-pdf-pages` — Reorder Pages
- **Category:** organize
- **Title:** Reorder PDF Pages | Drag & Drop Organizer - CrispPDF
- **Description:** Organize your documents visually. Drag and drop PDF pages to reorder them exactly how you need before finalizing and downloading.
- **Keywords:** reorder pdf pages, drag and drop pdf page reorder, change order of pages in pdf mac, rearrange pdf pages free tool, swap pdf pages, organize pdf document layout, rearrange pdf pages online, pdf ka page order kaise change kare, move last page to first in pdf, sort pdf pages for print, sequence pdf pages free
- **OG image:** `/og/reorder-pdf-pages.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/delete-pdf-pages` — Delete Pages
- **Category:** organize
- **Title:** Remove PDF Pages | Delete Unwanted Pages - CrispPDF
- **Description:** Quickly delete unwanted pages, blank sheets, or confidential sections from your PDF file. Visually select and remove pages in seconds.
- **Keywords:** delete pdf pages, delete specific pages from pdf mac, remove unwanted pages from pdf, cut page out of pdf file, free pdf page remover, batch delete pdf pages, remove blank page from pdf, delete wrong page from ssc form pdf, extract and delete pdf page, pdf se page kaise hataye, remove signature page pdf
- **OG image:** `/og/delete-pdf-pages.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/extract-pdf-pages` — Extract Pages
- **Category:** organize
- **Title:** Extract PDF Pages | Save Specific Pages - CrispPDF
- **Description:** Pull specific pages, chapters, or forms out of a bulky PDF and save them instantly as a clean, independent PDF document.
- **Keywords:** extract pdf pages, save one page of a pdf mac, extract specific pages from pdf free, pull pages out of pdf document, extract chapter from pdf, pdf page extractor, extract one page from marksheet pdf, pull chapter from book pdf, save specific page as pdf, pdf se ek page kaise nikale, separate front page pdf
- **OG image:** `/og/extract-pdf-pages.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/crop-pdf` — Crop PDF
- **Category:** edit
- **Title:** Crop PDF Pages | Trim Margins Visually - CrispPDF
- **Description:** Visually crop your PDF pages to remove messy scan borders, trim wide margins, or focus on specific document content. Free and fast.
- **Keywords:** crop pdf, crop pdf pages mac, trim margins from pdf document, free visual pdf cropper, reduce page size pdf, remove blank edges from pdf, crop extra white space from pdf, crop aadhaar card photo from pdf, trim pdf margins online, pdf ko crop kaise kare, resize pdf page area
- **OG image:** `/og/crop-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/repair-pdf` — Repair PDF
- **Category:** edit
- **Title:** Repair PDF Files | Recover Damaged Documents - CrispPDF
- **Description:** Attempt to recover and repair corrupted or damaged PDF files. Fix documents that throw errors when opening in standard PDF readers.
- **Keywords:** repair pdf, recover corrupted pdf mac, fix damaged pdf file online free, pdf repair tool, repair pdf cannot be opened error, restore broken pdf data, fix corrupted pdf file online, recover damaged ssc admit card pdf, repair invalid format pdf, open broken pdf file, corrupted pdf repair free
- **OG image:** `/og/repair-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/flatten-pdf` — Flatten PDF
- **Category:** secure
- **Title:** Flatten PDF Files | Lock Forms & Annotations - CrispPDF
- **Description:** Merge interactive form fields, annotations, and e-signatures into a final, flat PDF layer to ensure your document cannot be altered.
- **Keywords:** flatten pdf, flatten pdf mac, make pdf read only, flatten annotations and signatures, remove interactive fields from pdf, best free pdf flattener, flatten pdf to remove editable fields, lock signature in pdf, merge layers in pdf file, read only pdf kaise banaye, flatten form fields
- **OG image:** `/og/flatten-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/pdf-to-pdfa` — PDF to PDF/A
- **Category:** secure
- **Title:** Convert PDF to PDF/A | Archival Format - CrispPDF
- **Description:** Ensure your documents stand the test of time. Convert any PDF to the ISO-standard PDF/A format for secure, long-term digital archiving.
- **Keywords:** pdf to pdfa, convert pdf to pdf/a-1b mac, create archival pdf document, free pdf/a converter online, validate pdf/a compliance, iso 19005 pdf format, convert pdf to pdf/a online, iso standard pdf for government upload, pdf a format converter, long term archive pdf, pdfa kaise banaye
- **OG image:** `/og/pdf-to-pdfa.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/grayscale-pdf` — Grayscale PDF
- **Category:** edit
- **Title:** Convert PDF to Grayscale | Black & White - CrispPDF
- **Description:** Strip heavy colors from your PDF documents before printing. Convert to grayscale instantly to save on expensive printer ink.
- **Keywords:** grayscale pdf, convert pdf to grayscale mac, change pdf to black and white for printing, free grayscale pdf converter, strip color from pdf, save ink print pdf, convert pdf to black and white online, remove color from pdf to save ink, b/w pdf print preview, pdf ko black and white kaise kare, grayscale notes
- **OG image:** `/og/grayscale-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/protect-pdf` — Protect PDF
- **Category:** secure
- **Title:** Protect PDF Online | Add Password Encryption - CrispPDF
- **Description:** Apply strong AES-256 encryption to your sensitive files. Lock your PDF with a password to prevent unauthorized viewing, printing, or editing.
- **Keywords:** protect pdf, add password to pdf mac, encrypt pdf file online free, lock pdf from being printed or edited, best free pdf password protector, secure pdf, password protect pdf online, lock pdf with password free, encrypt sbi bank statement, pdf me password kaise lagaye, secure pdf document
- **OG image:** `/og/protect-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/unlock-pdf` — Unlock PDF
- **Category:** secure
- **Title:** Unlock PDF Online | Free Password Remover - CrispPDF
- **Description:** Remove frustrating password protection and print restrictions from your PDF files instantly. Regain full access to your own documents.
- **Keywords:** unlock pdf, remove password from pdf mac, free pdf password remover, unlock secured pdf for printing, bypass pdf owner password, decrypt pdf file, remove password from aadhaar pdf, unlock sbi bank statement online, pdf ka password kaise tode, open protected pdf without password, decrypt pdf free
- **OG image:** `/og/unlock-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/redact-pdf` — Redact PDF
- **Category:** secure
- **Title:** Redact PDF Files | Black Out Text Free - CrispPDF
- **Description:** Securely hide sensitive information before sharing a document. Permanently black out text, names, and account numbers from any PDF.
- **Keywords:** redact pdf, redact text in pdf mac, permanently black out text in pdf, censor sensitive information pdf free, hide personal data in pdf document, redact pdf, hide bank account number in pdf, black out text in pdf online free, censor pan card details pdf, hide sensitive info pdf, redact document
- **OG image:** `/og/redact-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/esign-pdf` — eSign PDF
- **Category:** edit
- **Title:** Sign PDF Online | Free e-Signature Tool - CrispPDF
- **Description:** Skip the expensive software. Draw, type, or upload your electronic signature to any PDF contract or form directly in your browser.
- **Keywords:** esign pdf, sign pdf online free without adobe, draw signature on document mac, legally binding e-signature free, best docusign alternative, sign pdf, draw signature on pdf online, add digital signature to form free, sign on pdf mobile, pdf par sign kaise kare, insert transparent signature pdf
- **OG image:** `/og/esign-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/watermark-pdf` — Watermark PDF
- **Category:** edit
- **Title:** Watermark PDF Online | Add Text or Logo - CrispPDF
- **Description:** Brand and protect your documents by stamping a text or image watermark across your PDF pages. Fully customize font, opacity, and angle.
- **Keywords:** watermark pdf, add watermark to pdf mac, insert transparent logo watermark, stamp confidential on pdf, best free pdf watermarker, add text watermark pdf, add logo watermark to pdf, insert draft watermark pdf, write name on pdf background, watermark kaise lagaye pdf me, stamp pdf pages free
- **OG image:** `/og/watermark-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/ocr-pdf` — OCR PDF
- **Category:** edit
- **Title:** OCR PDF Free | Make Scanned PDFs Searchable
- **Description:** Transform uneditable scanned documents into fully searchable and selectable text. A highly accurate, browser-based OCR tool for PDFs.
- **Keywords:** ocr pdf, convert scanned pdf to text mac, make pdf searchable free, best free ocr software online, extract text from image pdf, turn scan to text, make scanned pdf searchable, extract hindi text from image pdf, image to text converter online, pdf ko text me kaise convert kare, ocr free
- **OG image:** `/og/ocr-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/add-page-numbers-pdf` — Add Page Numbers
- **Category:** edit
- **Title:** Add Page Numbers to PDF | Format & Position - CrispPDF
- **Description:** Organize large reports by instantly adding page numbers to your PDF. Fully customize the numbering position, starting page, and font style.
- **Keywords:** add page numbers pdf, add page numbers to pdf mac, best tool to number pdf pages, insert pagination in pdf document, format pdf page numbers, bates numbering pdf, insert page numbers in pdf, add serial number to pdf pages, number pdf files for print, pdf me page number kaise dale, paginate pdf free
- **OG image:** `/og/add-page-numbers-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/add-watermark-text-pdf` — Add Watermark Text
- **Category:** edit
- **Title:** Add Text Watermark to PDF | Custom Stamps - CrispPDF
- **Description:** Protect your intellectual property or mark document status by adding customizable text watermarks like 'DRAFT' to your PDFs instantly.
- **Keywords:** add watermark text pdf, add draft watermark to pdf mac, stamp confidential text on pdf, best free text watermarker for pdf, text overlay pdf, insert watermark, add confidential text watermark, draft stamp on pdf, insert text background pdf, text watermark on pdf free, pdf watermark text editor
- **OG image:** `/og/add-watermark-text-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/extract-images-pdf` — Extract Images
- **Category:** edit
- **Title:** Extract Images from PDF | Save Pictures - CrispPDF
- **Description:** Strip a PDF of all its embedded images. Extract every picture in its original high resolution and download them in a convenient ZIP file.
- **Keywords:** extract images pdf, extract images from pdf mac, pull pictures out of pdf document, get all images from pdf high quality, free pdf image extractor tool, extract photos from pdf, save all pictures from pdf file, download images from pdf online, pdf se photo kaise nikale, rip images from pdf
- **OG image:** `/og/extract-images-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/invert-pdf` — Invert Colors PDF
- **Category:** edit
- **Title:** Invert PDF Colors | Dark Mode for Any Document
- **Description:** Instantly flip your PDF's color scheme. Create a dark mode reading experience or invert dark backgrounds to white for cheaper printing.
- **Keywords:** invert pdf, invert pdf colors mac, read pdf in dark mode, change pdf from black background to white for printing, reverse pdf colors free, invert pdf, invert pdf colors for printing, dark mode pdf reader online, reverse white text on black pdf, pdf ka color invert kaise kare, negative pdf
- **OG image:** `/og/invert-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/resize-pdf` — Resize PDF
- **Category:** organize
- **Title:** Resize PDF | Change Page Size to A4 or Letter - CrispPDF
- **Description:** Scale and resize your PDF document pages to exact standard dimensions like A4 or US Letter, ensuring perfect formatting for printing.
- **Keywords:** resize pdf, resize pdf pages mac, change pdf from letter to a4, custom pdf page dimensions, scale pdf size for printing, best free pdf resizer, resize pdf to a4 size, change pdf dimension to letter, resize for print online, pdf ka size a4 kaise kare, change pdf page size free
- **OG image:** `/og/resize-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/n-up-pdf` — N-up PDF
- **Category:** organize
- **Title:** N-up PDF | Print Multiple Pages Per Sheet - CrispPDF
- **Description:** Shrink and arrange multiple PDF pages onto a single sheet (N-up format). Save paper and create perfect handouts from your documents.
- **Keywords:** n-up pdf, multiple pages per sheet pdf mac, 2 up pdf printing, combine pages to save paper, create handout layout pdf, n-up pdf converter free, print multiple pages on one sheet pdf, 4 slides per page pdf, combine pdf pages for printing, ek page par 2 page kaise print kare, n up pdf
- **OG image:** `/og/n-up-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/blank-page-pdf` — Insert Blank Pages
- **Category:** organize
- **Title:** Insert Blank Page into PDF | Add Empty Pages - CrispPDF
- **Description:** Insert completely blank pages at the beginning, end, or between any existing pages in your PDF document. Free and instant in your browser.
- **Keywords:** blank page pdf, add blank page to pdf mac, insert empty page into pdf document, put blank page at end of pdf, free pdf blank page inserter, add blank page, insert blank page in pdf file, add empty page to pdf online, put blank sheet between pdf pages, pdf me khali page kaise jode, add blank page
- **OG image:** `/og/blank-page-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/duplicate-pages-pdf` — Duplicate Pages
- **Category:** organize
- **Title:** Duplicate PDF Pages | Clone Pages Within Document
- **Description:** Easily clone any page within your PDF. The duplicated page is inserted instantly next to the original without needing complex software.
- **Keywords:** duplicate pages pdf, duplicate pdf page mac, clone page within pdf document, repeat specific page in pdf file, free pdf page duplicator, copy pdf page, duplicate specific page in pdf, copy and paste page in same pdf, clone pdf page online, pdf ka page copy kaise kare, repeat page in pdf
- **OG image:** `/og/duplicate-pages-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/extract-text-pdf` — Extract Text
- **Category:** convert-from
- **Title:** Extract Text from PDF | Copy Plain Text - CrispPDF
- **Description:** Pull raw, plain text out of complex PDF layouts instantly. Perfect for feeding text to AI tools, data analysis, or simple copying.
- **Keywords:** extract text pdf, extract text from pdf mac, pdf to plain text converter, copy unformattable text from pdf document, free pdf text extractor, pdf to txt, extract plain text from pdf online, copy all text from pdf file, pdf to txt converter free, pdf se text kaise copy kare, rip text from pdf
- **OG image:** `/og/extract-text-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/edit-metadata-pdf` — Edit PDF Metadata
- **Category:** edit
- **Title:** Edit PDF Metadata | Change Author & Title - CrispPDF
- **Description:** Modify the hidden properties of your PDF files. Easily change the title, author, and subject, or strip metadata for privacy before sending.
- **Keywords:** edit metadata pdf, edit pdf metadata mac, change pdf author name, modify pdf properties without acrobat, remove metadata tags from pdf, free metadata editor, change pdf title and author, edit pdf properties online free, remove metadata from pdf, pdf ka naam kaise change kare, edit pdf info
- **OG image:** `/og/edit-metadata-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/compare-pdf` — Compare PDFs
- **Category:** edit
- **Title:** Compare PDFs | Visual Diff Checker Online - CrispPDF
- **Description:** Compare two versions of a PDF document side-by-side. Our visual diff tool highlights text changes, additions, and deletions instantly.
- **Keywords:** compare pdf, compare pdf files mac, spot differences between two pdfs, visual pdf diff checker, highlight text changes in pdf, best free pdf compare tool, compare two pdf files for differences, highlight changes in pdf online, pdf diff tool free, do pdf compare kaise kare, find changed text pdf
- **OG image:** `/og/compare-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/base64-pdf` — PDF ↔ Base64
- **Category:** convert-from
- **Title:** Base64 to PDF | Encode & Decode Strings - CrispPDF
- **Description:** Perfect for developers. Convert PDF files into Base64 strings for embedding, or decode Base64 text back into a viewable PDF document.
- **Keywords:** base64 pdf, pdf to base64 mac, encode pdf document to base64 string, base64 to pdf decoder online, free base64 pdf tool, convert pdf for api upload, convert pdf to base64 string online, decode base64 to pdf file, pdf to text code, pdf base64 encoder free, base64 decoder to pdf
- **OG image:** `/og/base64-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

### `/reverse-pdf` — Reverse PDF
- **Category:** organize
- **Title:** Reverse PDF Pages | Flip Document Order - CrispPDF
- **Description:** Instantly flip the page order of your entire PDF document. Fix reverse-scanned books and backwards files in one click for free.
- **Keywords:** reverse pdf, reverse pdf pages mac, flip order of pdf document, change pdf order from end to beginning, free pdf reverser, fix backward scanned pdf, reverse pdf page order online, flip pdf pages from last to first, correct reverse scanned pdf, pdf page order ulta kaise kare, backwards pdf
- **OG image:** `/og/reverse-pdf.svg`
- **JSON-LD:** WebApplication, HowTo (4 steps in `tool-howto.ts`), FAQPage (6 Qs in `tool-content.ts`), BreadcrumbList, Speakable

## Robots & discoverability

- `public/robots.txt` — allows all crawlers, points to `/sitemap.xml`.
- `src/routes/sitemap[.]xml.ts` — dynamic sitemap covering every static + tool + pSEO route.
- `src/routes/ai[.]txt.ts` — AI-agent policy (attribution, no-scrape hints).
- `src/routes/llms[.]txt.ts` + `llms-full[.]txt.ts` — LLM-friendly site summary for AEO/GEO.
- `src/lib/hreflang.ts` — emits alternate-language links per page.
- `src/lib/seo/jsonld.ts` — Organization, WebSite, Breadcrumb, Question, Speakable builders.

## Meta length guidelines followed

- Titles: 55–65 chars (India-first wording collapsed into Global titles).
- Descriptions: 145–160 chars.
- One H1 per page (the tool name inside `ToolPageView`).
- Every FAQ appears both as visible `<details>` **and** inside FAQPage JSON-LD.
