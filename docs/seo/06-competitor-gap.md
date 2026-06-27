# 06 — Competitor Gap Analysis

Data pulled live from Semrush (`top_pages` + `domain_analysis` for ilovepdf.com, smallpdf.com, pdf24.org). All US-database unless flagged 🇮🇳.

## Headline traffic comparison

| Domain | Total US keywords | US-est traffic/mo | India keywords | India traffic/mo |
|---|---|---|---|---|
| ilovepdf.com | est ~120K | ~7.4M | 78,918 | **47.4M** |
| smallpdf.com | est ~80K | partial | 50,654 | 9.4M |
| pdf24.org | est ~40K | partial | 20,891 | 1.6M |

`[semrush:us]` `[semrush:in]`

## iLovePDF — top traffic pages (Semrush US)

| Page | Traffic share | Top KW |
|---|---|---|
| `/` | 15.9% | pdf |
| `/jpg_to_pdf` | 5.6% | jpg to pdf |
| `/merge_pdf` | 5.0% | merge pdf |
| `/pdf_to_word` | 5.0% | how to convert pdf to word |
| `/pdf_to_jpg` | 4.4% | pdf to jpg |
| `/word_to_pdf` | 2.2% | word to pdf |
| `/edit-pdf` | 1.7% | pdf editor |
| `/compress_pdf` | 1.1% | file compressor |
| `/split_pdf` | 0.8% | split pdf |
| `/pdf_to_excel` | 0.4% | pdf to excel |
| `/remove-pages` | 0.2% | delete pages from pdf |
| `/pdf-forms` | 0.1% | fill pdf |
| `/unlock_pdf` | 0.1% | unlock pdf |

`[semrush:us]`

### Keywords iLovePDF ranks for that CrispPDF can steal

1. `pdf` — generic head, very hard (KDI 32 but 301K vol)
2. `i love pdf` — branded, ignore
3. `pdf editor` (246K) — target via /edit-pdf hub
4. `pdf converter` (301K) — target via /convert-pdf hub
5. `pdf merger` (90.5K) — already targeted, push internal links
6. `pdf combiner` (135K) — add as secondary on merge-pdf
7. `combine pdf` (110K) — same
8. `fill pdf` (14.8K) — opportunity, CrispPDF lacks dedicated form-filler page
9. `delete pages from pdf` (already on /delete-pdf-pages — push)
10. `how to edit a pdf` (33.1K) — blog post target
11. `pdf filler` (74K) — CrispPDF has no form-fill page → BUILD
12. `online pdf editor` (33.1K) — /edit-pdf hub
13. `pdf to docx` (22.2K) — alias for pdf-to-word
14. `convert jpg to pdf free` (74K) — heavy push on jpg-to-pdf
15. `pdf to text` (9.9K) — extract-text-pdf
16. `pdf to image` — pdf-to-jpg
17. `pdf to ppt` — pdf-to-ppt
18. `merge to pdf documents` (33.1K) — merge-pdf
19. `transforma in pdf` (27.1K, multilingual) — i18n play
20. `how to convert pdf to word` (550K) — pdf-to-word + blog #4

## Smallpdf — top pages

| Page | Share | Top KW |
|---|---|---|
| `/pdf-to-word` | 5.9% | how to convert pdf to word |
| `/compress-pdf` | 5.9% | file compressor |
| `/merge-pdf` | 5.4% | merge pdf |
| `/jpg-to-pdf` | 3.4% | jpg to pdf |
| `/pdf-to-jpg` | 3.3% | pdf to jpg |
| `/heic-to-pdf` | 0.5% | heic to pdf |
| `/translate-pdf` | 0.5% | translate pdf |
| `/html-to-pdf` | 0.4% | html to pdf |
| `/png-to-pdf` | 0.4% | png to pdf |

`[semrush:us]`

### Smallpdf low-comp keywords CrispPDF can target

1. `heic to pdf` 40.5K, KDI 39 — **build dedicated page (quick-win)**
2. `png to pdf` 110K, KDI 49 — **build dedicated page (quick-win)**
3. `html to pdf` — already have
4. `translate pdf` — CrispPDF missing → consider via LLM gateway
5. `pdf compressor` 74K
6. `sejda pdf editor` 18.1K — comparison page opportunity
7. `pdfescape` est 30K — comparison
8. `convertio` est 40K — comparison
9. `pdf-xchange` est 25K — comparison
10. `nitro pdf` est 60K — comparison

## PDF24

Strongest in DE market (50K German keywords). Weak in US/IN — not a primary competitor here. Lesson: PDF24's German dominance shows what a single-country focus produces — replicate the pattern for India.

## Content types ranking (across all 3 competitors)

| Type | Share of top-ranking URLs |
|---|---|
| Tool landing pages | ~75% |
| Generic home | ~10% |
| Blog tutorials | ~10% |
| Format-pair pages (png-to-pdf, heic-to-pdf) | ~3% |
| Comparison pages | ~0% — **wide open** |
| Use-case pages | ~1% — **wide open** |

## Featured snippet opportunities competitors miss

These KWs trigger Google's "featured snippet" box but the top result is a thin tool page — CrispPDF can win with a 50-word direct answer:

| Keyword | Vol | Current snippet holder | Angle |
|---|---|---|---|
| how to compress pdf below 1mb | med | none | Step list |
| how to merge pdf files without adobe | med | none | Step list |
| how to remove password from pdf | 9,900 | adobe.com (weak) | Step list |
| how to ocr a pdf | 590 | adobe.com | Definition + steps |
| how to redact a pdf | 4,400 | adobe.com | Step list + warning |
| how to compress pdf to 100kb | med 🇮🇳 | random Indian blogs | Numbered steps |
| what is pdf ocr | 320 | none | Definition (30 words) |

## "People also ask" (top 10 across head terms)

From SERP analysis of merge-pdf, compress-pdf, pdf-to-word:

1. Is it safe to merge PDFs online?
2. What is the best free PDF merger?
3. How do I combine PDF files for free?
4. Why is my PDF so large?
5. How can I reduce PDF size without losing quality?
6. Is iLovePDF safe to use?
7. Is Smallpdf really free?
8. What is the difference between PDF and PDF/A?
9. Can I edit a PDF in Microsoft Word?
10. How do I unlock a PDF without the password?

Each becomes a self-contained Q+A block on the relevant tool page (Question schema, AEO).

## Schema markup audit

| Schema type | iLovePDF | Smallpdf | PDF24 | CrispPDF (now) | Gap |
|---|---|---|---|---|---|
| WebSite + SearchAction | ✅ | ✅ | ✅ | ✅ | none |
| Organization | ✅ | ✅ | partial | ✅ | none |
| SoftwareApplication | partial | ✅ | ✅ | ❌ | **add** |
| HowTo per tool | ❌ | partial | ❌ | partial | **expand** |
| FAQPage | ✅ | ✅ | ✅ | ✅ | none |
| BreadcrumbList | ✅ | ✅ | ✅ | ✅ | none |
| Question (standalone) | ❌ | ❌ | ❌ | ✅ | **CrispPDF lead** |
| Speakable | ❌ | ❌ | ❌ | ✅ | **CrispPDF lead** |
| AggregateRating | ✅ | ✅ | ❌ | ❌ | **add (real reviews only)** |
| VideoObject | ❌ | partial | ❌ | ❌ | optional |

**Actions**:
1. Add `SoftwareApplication` schema with `applicationCategory: Multimedia` and `offers.price: 0` on every tool page — qualifies us for "free" app rich results.
2. Expand existing `HowTo` to include `tool`, `supply`, `totalTime`, `estimatedCost: $0`.
3. Add `AggregateRating` only when we have real user reviews — fake reviews trigger manual penalty.
