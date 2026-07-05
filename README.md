# CrispPDF

A free, browser-first PDF toolkit — 40 tools that merge, split, compress,
convert, sign, protect, and repair PDFs without signup, watermarks, or
uploading your files to a server.

Live at **[crisppdf.in](https://crisppdf.in)**.

## Why CrispPDF

- **Runs in your browser.** Most tools use `pdf-lib`, `pdf.js`, and
  `tesseract.js` in a Web Worker — your file never leaves the device.
- **No signup, no watermarks, no daily limits.** Every tool is fully free.
- **Fast on any device.** Mobile Safari, Chromebook, or a decade-old laptop —
  same reliable UI.
- **SEO-first.** Every tool page ships unique title, meta, JSON-LD (WebApp,
  HowTo, FAQPage, BreadcrumbList) and a per-tool OG image.

## Tech stack

- **Framework:** TanStack Start v1 (React 19, Vite 7, SSR to Cloudflare Workers)
- **UI:** Tailwind CSS v4 + shadcn/ui + Radix
- **Backend:** Lovable Cloud (Supabase) — auth, RLS, feedback storage
- **PDF engines:** pdf-lib, pdf.js, tesseract.js (all client-side)
- **Analytics:** Vercel Analytics + Speed Insights, PostHog, GA4 (opt-in)
- **Error reporting:** Sentry (opt-in via `VITE_SENTRY_DSN`)

## Getting started

```bash
bun install
bun run dev        # http://localhost:8080
bun run build      # production build
bun run start      # serve the production build
```

Requires **Bun ≥ 1.1**. Node 20+ also works but Bun is the default in this
project.

## Environment

Copy `.env.example` to `.env` and fill in what you need — every var is
optional except the Supabase pair, which Lovable Cloud injects automatically.

| Var | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` | Lovable Cloud (managed) |
| `VITE_SITE_URL` | Absolute origin used for canonical + OG URLs |
| `VITE_GA4_ID` | Google Analytics 4 (opt-in) |
| `VITE_POSTHOG_KEY` | PostHog product analytics |
| `VITE_SENTRY_DSN` | Client Sentry DSN |
| `VITE_HCAPTCHA_SITE_KEY` / `HCAPTCHA_SECRET` | Spam protection on `/feedback` |

## Project layout

```
src/
├── routes/               file-based TanStack routes (index, /merge-pdf, /vs/*, /use-cases/*, sitemap.xml, api/*)
├── components/
│   ├── tools/            one React component per interactive tool
│   ├── seo/              AnswerBlock, FAQ accordion, PseoPageShell, etc.
│   └── ui/               shadcn primitives
├── lib/
│   ├── tools.ts          the 40-tool catalogue (source of truth)
│   ├── tool-content.ts   per-tool SEO title/description/keywords/body/FAQs
│   ├── tool-howto.ts     per-tool "How to use" steps (4 per tool)
│   ├── tool-head.ts      buildToolHead() → route head() for every tool page
│   ├── pseo/             programmatic SEO data (use cases, competitors, sizes)
│   └── seo/              JSON-LD builders (Organization, WebSite, HowTo…)
├── integrations/supabase/  auto-generated client + auth middleware (do not edit)
├── server.ts             Cloudflare Workers entry with h3 error normalisation
└── start.ts              TanStack Start middleware wiring
```

See `src/routes/README.md` for routing conventions and `seo.md` for the
per-page SEO ledger.

## Contributing

1. Fork or use the built-in Lovable → GitHub sync.
2. Create route files under `src/routes/` following the flat naming
   convention (e.g. `compress-pdf-to-100kb.tsx`).
3. Add SEO entries to `src/lib/tool-content.ts` and `src/lib/tool-howto.ts`
   for any new tool.
4. Run `bun run build` before opening a PR — TanStack Router is strict about
   missing files and unresolved imports.

## License

MIT — do whatever you like, credit appreciated but not required.
