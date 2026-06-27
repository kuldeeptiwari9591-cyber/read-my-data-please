# 04 — pSEO Page Plan

Three templates, ~155 total pages prioritized by expected traffic.

- **A. Use-case** — `/{tool}-for-{use-case}` (currently mounted at `/use-cases/$slug`; plan promotes the highest-volume ones to flat URLs)
- **B. Competitor comparison** — `/{tool}-vs-{competitor}` (currently `/vs/$slug`)
- **C. Format conversion** — `/{from}-to-{to}` (currently `/convert/$slug`)
- **D. Size-target compression** — `/compress-pdf-to-{size}` (NEW — India's biggest single opportunity)

Existing pSEO infrastructure in `src/lib/pseo/` already covers A, B, C. Template D is new.

---

## A. Use-case pages (50)

### Organize (10)

| Slug | H1 | Target KW | Vol | KDI | Competitor ranking |
|---|---|---|---|---|---|
| compress-pdf-for-email | Compress PDF for Email Attachments | compress pdf for email | high `[est]` | low | smallpdf blog |
| compress-pdf-for-whatsapp | Compress PDF for WhatsApp | compress pdf for whatsapp | med `[est]` | low | none strong |
| compress-pdf-for-upsc | Compress PDF for UPSC Application | compress pdf for upsc | med 🇮🇳 | low | random blogs |
| compress-pdf-for-ssc | Compress PDF for SSC Application | compress pdf for ssc | med 🇮🇳 | low | none |
| compress-pdf-for-ibps | Compress PDF for IBPS Bank Exams | compress pdf for ibps | med 🇮🇳 | low | none |
| merge-pdf-for-students | Merge PDF for Students | merge pdf for students | med `[est]` | low | ilovepdf blog |
| merge-pdf-for-college-assignment | Merge PDF for College Assignments | merge pdf for college assignment | med 🇮🇳 | low | none |
| merge-pdf-for-ebooks | Merge PDF for eBooks | merge pdf for ebook | low | low | none |
| split-pdf-for-chapters | Split PDF Into Chapters | split pdf by chapter | low | low | none |
| compress-pdf-for-printing | Compress PDF Before Printing | reduce pdf size before printing | low | low | none |

FAQs per page (3): "what's the maximum file size I can compress?", "does it work on mobile?", "is my file uploaded anywhere?".

### Convert (10)

| Slug | H1 | Target KW | Vol |
|---|---|---|---|
| word-to-pdf-for-resume | Word to PDF for Resume | word to pdf resume | med |
| word-to-pdf-for-cv | Word to PDF for CV | convert cv to pdf | med |
| jpg-to-pdf-for-passport | JPG to PDF for Passport Application | passport photo to pdf | med 🇮🇳 |
| jpg-to-pdf-for-visa | JPG to PDF for Visa Application | visa documents jpg to pdf | med |
| pdf-to-word-for-editing | PDF to Word for Editing | convert pdf to editable word | high |
| excel-to-pdf-for-invoices | Excel to PDF for Invoices | export invoice to pdf | med |
| html-to-pdf-for-receipts | HTML to PDF for Receipts | save receipt as pdf | med |
| pdf-to-jpg-for-thumbnails | PDF to JPG for Thumbnails | pdf to image thumbnail | low |
| pdf-to-excel-for-bank-statements | PDF to Excel for Bank Statements | bank statement pdf to excel | med |
| jpg-to-pdf-for-document-submission | JPG to PDF for Online Form Upload | image to pdf for form | med 🇮🇳 |

### Edit (10)

| Slug | H1 | Target KW |
|---|---|---|
| esign-pdf-for-contracts | Sign PDF for Contracts | sign contract pdf online |
| esign-pdf-for-job-application | Sign PDF for Job Applications | sign offer letter pdf |
| esign-pdf-for-lease | Sign PDF for Rental Lease | sign lease agreement pdf |
| esign-pdf-for-nda | Sign NDA as PDF | sign nda online free |
| ocr-pdf-for-scanned-documents | OCR PDF for Scanned Documents | scanned pdf to searchable |
| ocr-pdf-for-receipts | OCR PDF for Receipts | scan receipts to text |
| ocr-pdf-for-handwritten | OCR PDF for Handwritten Notes | handwritten pdf to text |
| watermark-pdf-for-drafts | Watermark PDF as DRAFT | draft watermark pdf |
| watermark-pdf-with-logo | Watermark PDF with Logo | add logo watermark pdf |
| add-page-numbers-pdf-for-thesis | Add Page Numbers for Thesis | thesis page numbers pdf |

### Secure (10)

| Slug | H1 | Target KW |
|---|---|---|
| protect-pdf-for-confidential | Password Protect Confidential PDFs | confidential pdf password |
| protect-pdf-for-clients | Password Protect Client PDFs | encrypt client pdf |
| redact-pdf-for-legal | Redact PDF for Legal Discovery | redact pdf legal |
| redact-pdf-for-medical | Redact PDF for Medical Records | hipaa redact pdf |
| redact-pdf-for-resume | Redact Sensitive Info on Resume | hide address on resume |
| unlock-pdf-for-printing | Unlock PDF for Printing | unlock pdf to print |
| unlock-pdf-for-editing | Unlock PDF for Editing | unlock pdf to edit |
| flatten-pdf-for-signing | Flatten PDF Before Signing | flatten before signature |
| pdf-to-pdfa-for-archiving | Convert to PDF/A for Archival | pdf to pdf/a archive |
| unlock-pdf-aadhaar | Remove Aadhaar PDF Password | aadhaar pdf password remove | very-high 🇮🇳 `[est]` |

---

## B. Competitor comparison pages (priority 15)

### iLovePDF

People searching for iLovePDF-vs comparisons want: privacy, no watermark, no signup, faster. iLovePDF weaknesses to highlight: uploads to server, premium gated features (OCR, edit), daily task limits on free, signup wall on most useful features.

| Slug | Vol estimate |
|---|---|
| merge-pdf-vs-ilovepdf | med |
| compress-pdf-vs-ilovepdf | med |
| pdf-to-word-vs-ilovepdf | med |
| ilovepdf-alternative | med `[est]` (zero SERP data — opportunity) |
| ilovepdf-vs-smallpdf | med `[est]` — comparison-of-competitors page |

### Smallpdf

Weaknesses: 2 tasks/day on free, mandatory account for most tools, premium $9/mo, uploads to server.

| Slug | Vol |
|---|---|
| compress-pdf-vs-smallpdf | med |
| pdf-to-word-vs-smallpdf | med |
| esign-pdf-vs-smallpdf | low |
| smallpdf-alternative | med |
| smallpdf-vs-ilovepdf | med |

### Adobe Acrobat

Weaknesses: $19.99/mo, requires download or signup, very limited free tier, slow.

| Slug | Vol |
|---|---|
| pdf-to-word-vs-adobe | med-high |
| edit-pdf-vs-adobe | med |
| adobe-acrobat-free-alternative | med-high |
| esign-pdf-vs-adobe-sign | med |
| ocr-pdf-vs-adobe | low |

**Comparison table columns**: Price · Free limit · Signup required · Watermark · Uploads file · Mobile experience · Browser-only · OCR included free.

---

## C. Format conversion pages (top 20)

Existing data in `src/lib/pseo/formats.ts` already covers 15. Adding these 5 high-value:

| Slug | Target KW | Vol | KDI | Status |
|---|---|---|---|---|
| png-to-pdf | png to pdf | 110,000 `[semrush:us]` | 49 | **route via jpg-to-pdf — high priority quick-win** |
| heic-to-pdf | heic to pdf | 40,500 `[semrush:us]` | 39 | **route via jpg-to-pdf — quick-win** |
| webp-to-pdf | webp to pdf | med | low | route via jpg-to-pdf |
| csv-to-pdf | csv to pdf | med | low | route via excel-to-pdf |
| txt-to-pdf | txt to pdf | med | low | route via word-to-pdf |
| rtf-to-pdf | rtf to pdf | med | low | route via word-to-pdf |
| odt-to-pdf | odt to pdf | med | low | route via word-to-pdf |
| ods-to-pdf | ods to pdf | low | low | route via excel-to-pdf |
| pdf-to-text | pdf to text | 9,900 `[semrush:us]` | low | route via extract-text-pdf |
| pdf-to-html | pdf to html | low | low | extract-text + wrap |
| pdf-to-csv | pdf to csv | med | low | route via pdf-to-excel |
| image-to-pdf | image to pdf | 49,500 `[semrush:us]` | low | route via jpg-to-pdf |
| pdf-to-image | pdf to image | med | low | route via pdf-to-jpg |
| pdfa-to-pdf | pdfa to pdf | low | low | new (need converter) |
| pdf-to-docx | pdf to docx | 22,200 `[semrush:us]` | low | alias for pdf-to-word |
| pdf-to-jpeg | pdf to jpeg | 33,100 `[semrush:us]` | low | alias for pdf-to-jpg |
| pdf-to-pptx | pdf to pptx | low | low | alias for pdf-to-ppt |
| pdf-to-xlsx | pdf to xlsx | med | low | alias for pdf-to-excel |
| svg-to-pdf | svg to pdf | low | low | new |
| epub-to-pdf | epub to pdf | med | med | new (needs lib) |

---

## D. Size-target compression pages (NEW template — biggest single opportunity)

| Slug | Primary KW | Vol/mo | KDI |
|---|---|---|---|
| compress-pdf-to-100kb | compress pdf to 100kb | 110,000 🇮🇳 `[semrush:in]` | low |
| compress-pdf-to-200kb | compress pdf to 200kb | 135,000 🇮🇳 `[semrush:in]` | low |
| compress-pdf-to-50kb | compress pdf to 50kb | est 40K 🇮🇳 | low |
| compress-pdf-to-500kb | compress pdf to 500kb | est 60K 🇮🇳 | low |
| compress-pdf-to-1mb | compress pdf to 1mb | est 30K 🇮🇳 | low |
| compress-pdf-to-2mb | compress pdf to 2mb | est 20K | low |
| compress-pdf-to-5mb | compress pdf to 5mb | est 15K | low |
| compress-pdf-to-10mb | compress pdf to 10mb | est 12K | low |
| compress-pdf-to-300kb | compress pdf to 300kb | est 30K 🇮🇳 | low |
| compress-pdf-to-400kb | compress pdf to 400kb | est 20K 🇮🇳 | low |

**Combined addressable**: ~470K searches/mo. Single template, preset compression target, unique copy per size. Should be the #1 build priority.
