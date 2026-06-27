## Goal
Layer **SEO + AEO (Answer Engine Optimization) + GEO (Generative Engine Optimization) + pSEO (Programmatic SEO)** on top of the existing 40 tools so CrispPDF ranks in Google, gets cited by ChatGPT/Perplexity/Gemini/Google AI Overviews, and captures long-tail traffic at scale.

The 40 core tool pages, canonicals, sitemap, JSON-LD, hreflang, and per-tool FAQs already exist — this plan adds the missing layers.

---

## 1. AEO — Answer Engine Optimization (cite-worthy structure)
Make every tool & blog page easy for LLMs to quote.

- **TL;DR / Answer block** at top of each tool page (40–60 word direct answer to "how do I {tool name}"). Used by AI Overviews and Perplexity.
- **Speakable schema** (`SpeakableSpecification`) on the TL;DR + FAQ — voice + AI assistants.
- **"Last updated" + "Reviewed by"** byline on every tool/blog page → `dateModified` in JSON-LD.
- Expand `HowTo` JSON-LD with `tool`, `supply`, `totalTime`, `estimatedCost: $0`.
- Add **`Question` + `Answer` JSON-LD** stand-alone (in addition to FAQPage) for top 3 questions per tool.
- Self-contained answers — every FAQ answer must stand alone without surrounding context (LLMs quote single sentences).

## 2. GEO — Generative Engine Optimization (get cited by LLMs)
- **`llms.txt`** at `/llms.txt` and `/llms-full.txt` — the emerging standard ChatGPT/Anthropic/Perplexity crawlers read. Lists all 40 tools + canonical descriptions.
- **`ai.txt`** declaring crawl policy for GPTBot, ClaudeBot, PerplexityBot, Google-Extended (allow — we *want* citations).
- **Statistics & comparison blocks** on tool pages ("CrispPDF processes a 50 MB PDF in ~3 s vs. iLovePDF ~8 s") — LLMs prefer pages with quotable numbers.
- **Author entity / Organization sameAs** linking to GitHub, X, LinkedIn → builds entity graph Google + LLMs use.

## 3. pSEO — Programmatic SEO (3 new route templates, ~600 pages)
Generated from data tables, each with unique copy + schema:

**A. Tool × Use-case** — `/{tool}-for-{use-case}` (≈200 pages)
  e.g. `/compress-pdf-for-email`, `/merge-pdf-for-students`, `/esign-pdf-for-contracts`
  Source: `useCases[]` array per tool (10 use-cases × 40 tools, filtered for sense → ~200).

**B. Tool comparisons** — `/{tool}-vs-{competitor}` (≈120 pages)
  e.g. `/merge-pdf-vs-ilovepdf`, `/compress-pdf-vs-smallpdf`, `/pdf-to-word-vs-adobe`
  Source: 3 competitors × 40 tools. Honest comparison table (price, privacy, watermark, signup, speed).

**C. Format conversions matrix** — `/{from}-to-{to}` (≈30 pages)
  Fills gaps in the convert grid: `/png-to-pdf`, `/csv-to-pdf`, `/txt-to-pdf`, etc. Routes either to a real tool or to a "coming soon + closest alternative" page (still indexable).

Each pSEO page has: unique H1, unique 150-word intro, unique FAQ (3 Qs), canonical to itself, JSON-LD, internal links to 3 sibling pages + parent tool.

## 4. Internal linking + topical authority
- **Related-tools cluster** (3 cards) at bottom of every tool page, grouped by category.
- **Breadcrumb on pSEO pages** (Home › Tool › Use case).
- **Hub pages** per category: `/organize-pdf`, `/convert-pdf`, `/edit-pdf`, `/secure-pdf` — list every tool in category with descriptions (currently flat).
- **Contextual links** in blog posts auto-linked to relevant tool pages.

## 5. Technical SEO hardening
- **Sitemap split**: `/sitemap.xml` index → `/sitemap-tools.xml`, `/sitemap-pseo.xml`, `/sitemap-blog.xml`, `/sitemap-static.xml` (Google's 50k-URL rule + faster recrawl).
- **`<lastmod>`** populated from build timestamp / blog `updated_at`.
- **WebSite + SearchAction JSON-LD** at root (sitelinks search box).
- **Image alt text audit** — every `<img>` (logo, icons, blog images) gets descriptive alt.
- **Core Web Vitals**: lazy-load below-fold hero canvas (already partial), defer non-critical JS, preload logo + hero font.
- **404 → suggest tools** based on URL slug (already animated, add fuzzy match).

## 6. Content / E-E-A-T signals
- **About page**: add team / founder section (real or stated as solo dev) → Person schema.
- **Tool pages**: add "Built and maintained by [Name], updated {date}" line.
- **Blog**: expand from 3 → 12 posts (9 new, covering long-tail like "how to merge PDF on iPhone without app", "reduce PDF size below 100 KB").
- **Trust signals**: visible "No upload — runs in your browser" badge near every upload zone (already there partially) + privacy summary on every tool page.

## 7. Tracking what works
- GA4 already wired. Add **`tool_view`, `pseo_view`, `comparison_click`, `outbound_click`** events.
- **Search Console**: emit `/llms.txt` + new sitemaps so user can submit them after launch.

---

## Technical details

### New files
- `src/lib/pseo/use-cases.ts` — `Record<toolSlug, UseCase[]>`
- `src/lib/pseo/competitors.ts` — competitor data table
- `src/lib/pseo/formats.ts` — format conversion matrix
- `src/routes/$tool-for-$useCase.tsx` — dynamic pSEO route (or flat split files generated)
- `src/routes/$tool-vs-$competitor.tsx`
- `src/routes/$from-to-$to.tsx`
- `src/routes/organize-pdf.tsx`, `convert-pdf.tsx`, `edit-pdf.tsx`, `secure-pdf.tsx` — category hubs
- `src/routes/llms[.]txt.ts`, `src/routes/llms-full[.]txt.ts`
- `src/routes/ai[.]txt.ts`
- `src/routes/sitemap-tools[.]xml.ts`, `sitemap-pseo[.]xml.ts`, `sitemap-blog[.]xml.ts`
- `src/components/seo/AnswerBlock.tsx` (TL;DR component)
- `src/components/seo/RelatedTools.tsx`
- `src/components/seo/ComparisonTable.tsx`
- `src/lib/seo/jsonld.ts` — centralised JSON-LD builders (Question, Speakable, Organization, BreadcrumbList)

### Modified files
- `src/components/ToolPageView.tsx` — inject AnswerBlock, RelatedTools, last-updated byline
- `src/lib/tool-head.ts` — add Question/Speakable schema, dateModified
- `src/routes/sitemap[.]xml.ts` — convert to sitemap-index
- `src/routes/__root.tsx` — add WebSite+SearchAction JSON-LD
- `public/robots.txt` — point at sitemap-index, allow AI crawlers
- `src/lib/tools.ts` — add `useCases`, `lastUpdated` fields

### Out of scope (ask before doing)
- Multi-language pSEO duplication (would 4× page count — confirm first)
- Paid backlink / outreach campaigns
- Real benchmark numbers (need actual measurements; will use honest placeholders flagged in code)

---

## Build order
1. AEO foundation (AnswerBlock + Speakable + dateModified) — biggest LLM ranking win, lowest effort
2. `llms.txt` + `ai.txt` + WebSite JSON-LD — 30 min, instant GEO win
3. Category hub pages + RelatedTools internal-link block
4. pSEO templates (use-case → comparison → format) — biggest scale, do in that order
5. Sitemap split + new sitemaps
6. Blog expansion (9 new posts) — last, longest-running

---

Shall I proceed with all 6 phases, or do you want to ship in smaller chunks (e.g. **Phase 1–3 only** first, then review traffic before pSEO)?
