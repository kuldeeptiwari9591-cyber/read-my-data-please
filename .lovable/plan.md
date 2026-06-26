# CrispPDF — Phased Build Plan

The spec is 2,391 lines covering 30 tools, 3D scenes, auth, and a Flask backend. That's many turns of work. I'll deliver it in phases so you can review and steer between each.

## Stack adjustments (vs. the spec)

- **No Flask / Render.** Your project is TanStack Start on Cloudflare Workers. PDF tools run **fully client-side** with `pdf-lib` + `pdf.js` (better privacy, zero server cost). Anything that truly needs a server (e.g. OCR) becomes a TanStack server function later.
- **No Netlify.** Deploys via Lovable's built-in publish.
- **Lovable Cloud** instead of raw Supabase, enabled in Phase 4 when auth/history is added.
- **Three.js, Framer Motion, tsParticles, react-parallax-tilt** all kept — these are the visual signature.
- **Palette kept exactly** as specified (indigo #6366F1 / purple #8B5CF6 on #0A0A0F), even though I'd normally avoid purple — you asked for it explicitly.

## Phase 1 — Foundation + Landing (this turn)

1. Install: `framer-motion`, `three`, `@react-three/fiber`, `@react-three/drei`, `react-parallax-tilt`, `@tsparticles/react`, `@tsparticles/slim`, `pdf-lib`, `pdfjs-dist`, `lucide-react`.
2. Design system in `src/styles.css`: dark tokens (bg, surface, surface-elevated, border, primary indigo, secondary purple), gradient + glow tokens, Space Grotesk / Inter / JetBrains Mono via `<link>` in `__root.tsx`.
3. Shared components: `GlassCard`, `TiltCard`, `HeroScene` (3D floating PDF + orbiting docs + particle field), `ParticlesBackground`, `Header`, `Footer`.
4. `src/routes/index.tsx` — landing: hero with 3D scene, stats strip, grid of all 30 tools (as cards with icons + categories), "why crisppdf" section, footer. Tool cards link to `/tools/$slug`.
5. `src/routes/tools.$slug.tsx` — generic tool route that dispatches to a tool registry. Shows a placeholder "Coming soon" UI for tools not yet implemented.
6. Tool registry (`src/lib/tools.ts`): metadata for all 30 tools (slug, name, description, category, icon, status).
7. SEO: per-route `head()`, `robots.txt`, `sitemap.xml` with every tool route.

## Phase 2 — Core PDF tools (next turn)

Implement 6 highest-traffic tools client-side with `pdf-lib`:
Merge PDF, Split PDF, Compress PDF, Rotate PDF, Delete Pages, Reorder Pages. Each: drag-drop upload, live preview, download.

## Phase 3 — Convert + secondary tools

Images↔PDF, PDF→JPG, Watermark, Page numbers, Protect/Unlock, Extract text. ~10 tools.

## Phase 4 — Auth, history, remaining tools

Enable Lovable Cloud, add sign-in, recent-files history, and remaining specialty tools (OCR via server function, eSign, form fill, etc.).

## Phase 5 — Polish

Animated counters, processing globe, micro-interactions, perf pass, Lighthouse.

---

Approve and I'll execute **Phase 1** now. After it's live, say "next" for Phase 2.
