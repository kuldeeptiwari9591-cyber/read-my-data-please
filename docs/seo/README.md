# CrispPDF SEO Research Pack

Research-only deliverable. No code changes yet — the next implementation prompt consumes these files.

## Files

| File | Purpose |
|---|---|
| [00-master-plan.md](./00-master-plan.md) | Top 100 KWs, quick wins, pSEO priority, content calendar, India quick wins |
| [01-tool-keywords.md](./01-tool-keywords.md) | Per-tool primary/secondary/long-tails + titles + meta descriptions (40 tools) |
| [02-india.md](./02-india.md) | India-specific KWs, Hinglish, mobile, students, government file-size niche |
| [03-longtail-clusters.md](./03-longtail-clusters.md) | 50 long-tails across 5 intent buckets |
| [04-pseo-pages.md](./04-pseo-pages.md) | Use-case + comparison + format-conversion page specs |
| [05-blog-plan.md](./05-blog-plan.md) | 12 blog posts: titles, keywords, outlines, internal links |
| [06-competitor-gap.md](./06-competitor-gap.md) | iLovePDF / Smallpdf / PDF24 gaps, PAA, schema audit |
| [07-aeo-geo.md](./07-aeo-geo.md) | 30 AI questions + 50-word TL;DRs for AnswerBlocks |
| [08-intent-map.md](./08-intent-map.md) | Info/nav/transactional/commercial intent map for top 15 tools |

## Source tags

Every keyword row carries one:

- `[semrush:us]` — pulled live from Semrush, US database (2026-06)
- `[semrush:in]` — pulled live from Semrush, India database (2026-06)
- `[est]` — estimated from category patterns + competitor SERPs, NOT a live measurement

Volume bands when an exact number is not available:
`low` <1K · `med` 1K–10K · `high` 10K–100K · `very-high` 100K+ monthly.

## Headline finding

India is the dominant market for PDF tools — by a huge margin.

| Domain | US traffic/mo | India traffic/mo | India / US |
|---|---|---|---|
| ilovepdf.com | ~7.4M | **47.4M** | 6.4× |
| smallpdf.com | (low US share) | **9.4M** | — |
| pdf24.org | — | 1.6M | — |

`compress pdf` in India = **2,240,000 searches/mo** vs **110,000** in the US.
`pdf merge` in India = **1,220,000 searches/mo** vs **135,000** in the US.

Strategy implication: every implementation choice (page weight, network, file-size presets, language) must default to **mobile-first, India-first**.
