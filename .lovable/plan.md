## CrispPDF SEO Research Plan (no code)

Deliverable: a research-only knowledge pack under `docs/seo/` that the next prompt uses to implement. Zero code/route changes this turn.

### Data sourcing
- **Semrush API** (US database default, IN database for India task) for the 15 highest-value tools and 3 main competitors only — exact volumes, KDI, SERP, gaps.
- **Knowledge-grounded estimates** (banded volume: low / med / high / very-high) for the remaining 25 tools, long-tails, AEO questions, and blog ideas.
- Every Semrush-derived number gets a source tag `[semrush:us]` or `[semrush:in]`; every estimate gets `[est]` so we can later upgrade estimates to real data.

### Top 15 tools getting full Semrush treatment
merge-pdf, split-pdf, compress-pdf, pdf-to-word, pdf-to-excel, pdf-to-jpg, word-to-pdf, jpg-to-pdf, rotate-pdf, unlock-pdf, protect-pdf, esign-pdf, ocr-pdf, edit-metadata-pdf (proxy for "edit pdf"), watermark-pdf.

Per tool: `keyword_research` (primary + related + questions), `serp_analysis` (KDI + who ranks), `keyword_compare` (primary vs 2 long-tails).

### Competitor pull
`domain_analysis` + `top_pages` + `competitive_analysis` for ilovepdf.com, smallpdf.com, pdf24.org — feeds Task 6 gap analysis and Task 4B comparison page priority. India angle: re-run `domain_analysis` on database `in` for the same three.

### Output files under `docs/seo/`

```text
docs/seo/
├── 00-master-plan.md       Final deliverable: Top 100, quick wins, pSEO priority, content calendar, India quick wins
├── 01-tool-keywords.md     Task 1 — 40-row table (15 Semrush-backed, 25 estimated)
├── 02-india.md             Task 2 — Hinglish, mobile, student, state/city
├── 03-longtail-clusters.md Task 3 — 50 long-tails across 5 intent buckets
├── 04-pseo-pages.md        Task 4 — use-case (40), comparison (50), format (20) page specs
├── 05-blog-plan.md         Task 5 — 12 posts with outline, internal links, KW
├── 06-competitor-gap.md    Task 6 — gap keywords, PAA, schema audit
├── 07-aeo-geo.md           Task 7 — 30 AI questions + 50-word TL;DRs per tool
└── 08-intent-map.md        Task 8 — info/nav/transactional/commercial map for top 15
```

### Format inside each file
- Tables exactly matching the user's requested columns.
- Each keyword row carries: volume band, competition, intent, target URL, source tag.
- Every claim about competitor weakness is concrete (price, watermark, signup wall, upload-to-server) — no vibes.

### Master plan structure (`00-master-plan.md`)
1. Top 100 keywords ranked by `(volume × intent) / competition`, with target page + priority (P0/P1/P2).
2. 20 quick-win keywords (low competition + med volume, rankable in 2–4 weeks).
3. 50 pSEO pages to ship first — ordered, with expected traffic band.
4. Content calendar (Week 1 tool-page optimisation → Week 2–4 blog → Month 2 pSEO → Month 3 comparisons).
5. India-first top 10 with Hindi/Hinglish variants.

### Honest constraints
- Semrush volumes for non-US markets can be sparse; India numbers will lean on `database: in` where available and fall back to bands.
- "Featured snippet opportunity (yes/no)" judged from SERP feature presence in `serp_analysis`; for non-Semrush rows it stays an estimate flagged `[est]`.
- I will not invent specific monthly numbers for the 25 estimated tools — only bands.

### Out of scope this turn
- No route, component, schema, or sitemap changes.
- No new pSEO/blog/route files — only the research markdown under `docs/seo/`.
- No multi-language keyword research beyond India (EN+HI); ES/PT/HI variants for the other locales come in a later pass if you want.

### Build order once approved
1. Run all Semrush calls (top 15 tools US + IN, 3 competitors US + IN, ~10 SERPs).
2. Write the 8 task files in parallel.
3. Synthesise `00-master-plan.md` last from the other 8.

Approve and I'll execute the research and write the 9 files — no app code touched.