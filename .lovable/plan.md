# Migrating CrispPDF off Lovable — Full Process

Honest take first: **possible, but you lose meaningful infra**. The TanStack Start app itself ports cleanly. The Lovable Cloud backend (managed Supabase) does **not** export as a full database dump — only per-table CSV. So a clean cutover means standing up your own Supabase project and replaying schema + data into it. Lovable-specific helpers (`lovable.auth.signInWithOAuth` broker, managed `_authenticated` gate, hCaptcha env injection, scheduled `pg_cron` security scan) need manual re-wiring.

---

## What moves where

| Piece | Today (Lovable) | Target |
|---|---|---|
| Frontend (React/TanStack Start) | Lovable build → Cloudflare Workers | Netlify / Vercel / Render |
| Server functions (`createServerFn`) | Same Worker | Same host as frontend (all three support it) |
| Server routes (`/api/public/*`) | Same Worker | Same host |
| Database + Auth + Storage | Lovable Cloud (managed Supabase) | Your own Supabase project (recommended) |
| Secrets (`LOVABLE_API_KEY`, hCaptcha, Sentry, GA4, PostHog) | Lovable secrets | Host env vars |
| Cron (`pg_cron` daily security scan) | Lovable Cloud | Supabase pg_cron OR host scheduler |
| Domain | Lovable Domains | New host's DNS panel |

---

## Host recommendation

- **Vercel** — best DX for TanStack Start, native edge functions, good free tier. **Pick this** unless you have a reason not to.
- **Netlify** — works, comparable. Pick if you already use Netlify.
- **Render** — runs as a Node server (not edge). Heavier, slower cold starts. Only pick if you need long-running processes.

I'll write the plan around Vercel; swap names for Netlify/Render — the steps are identical.

---

## Phase 1 — Stand up your own Supabase project (do FIRST)

1. Create a new project at supabase.com. Copy `Project URL`, `anon key`, `service_role key`, DB password.
2. Export schema from current Lovable Cloud DB. Two paths:
   - **You run it:** I'll bundle every migration in `supabase/migrations/` into one consolidated `schema.sql` you paste into the new project's SQL editor. This recreates tables, RLS, GRANTs, functions, triggers, `pg_cron` jobs.
   - **Lovable support:** ask them for a `pg_dump` of your project. Lovable docs say only CSV is self-serve, but support can sometimes help on a paid plan.
3. Export data per table as CSV from Lovable Cloud → Database → Tables → Download CSV. Tables to export: `announcements`, `blog_posts`, `feedback`, `operations`, `security_audit_log`, `tool_settings`, `user_roles`.
4. Import CSVs into the new Supabase project (Table Editor → Import CSV per table). Order matters: `user_roles` last (depends on `auth.users`).
5. Recreate auth users. `auth.users` rows can't be CSV-imported. Either:
   - Use Supabase Auth Admin API to re-invite users (they reset password), OR
   - On Supabase paid plan, request an auth migration.
6. Re-enable extensions: `pg_cron`, `pg_net`. Re-create the daily security scan cron job.

---

## Phase 2 — Strip Lovable-specific code

Things that won't work outside Lovable and need swapping:

1. **`lovable.auth.signInWithOAuth("google", …)`** — replace with `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } })`. Configure Google OAuth in the new Supabase dashboard (Auth → Providers → Google) with your own client ID/secret from Google Cloud Console.
2. **Managed `_authenticated/route.tsx`** — keep the file but verify it's the version that calls `supabase.auth.getUser()`. It already is — no change needed.
3. **`@/integrations/supabase/client.ts`, `client.server.ts`, `auth-middleware.ts`, `auth-attacher.ts`, `types.ts`** — these are auto-generated. Replace env reads to point at your new project (URL + keys). Regenerate `types.ts` with `npx supabase gen types typescript`.
4. **`LOVABLE_API_KEY`** — only used if you call Lovable AI Gateway. If yes, either keep paying Lovable for the gateway, or swap to direct OpenAI/Anthropic with your own keys (need code changes wherever the gateway is called).
5. **Lovable connector gateway calls** (Google Search Console etc.) — replace with direct provider OAuth in your app.
6. **hCaptcha env vars** — `VITE_HCAPTCHA_SITEKEY` + `HCAPTCHA_SECRET` move to Vercel env.

---

## Phase 3 — Deploy frontend to Vercel

1. Push the repo to your own GitHub (Lovable Connect → GitHub if not already; then transfer ownership in GitHub).
2. `vercel.com` → Import Project → pick repo. Vercel auto-detects Vite/TanStack Start.
3. Add env vars in Vercel Project Settings → Environment Variables:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
   - `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_SITE_URL` (your final domain), `VITE_GA4_ID`, `VITE_POSTHOG_KEY`, `VITE_SENTRY_DSN`
   - `VITE_HCAPTCHA_SITEKEY`, `HCAPTCHA_SECRET`
4. First deploy → verify on the `*.vercel.app` URL. Smoke-test 5 tools, sign-in, blog, feedback.
5. Add custom domain in Vercel → Domains. Update DNS (A `76.76.21.21` or CNAME per Vercel instructions). Wait for SSL.
6. Re-publish `VITE_SITE_URL` with the final domain and redeploy so canonicals/sitemap absolutize.
7. Resubmit `/sitemap.xml` to Google Search Console for the new domain.

---

## Phase 4 — Cutover

1. Freeze writes on Lovable (set a maintenance banner via `tool_settings`).
2. Re-export any CSVs that changed since Phase 1 and re-import.
3. Flip DNS to Vercel.
4. Monitor Sentry + PostHog for errors for 48h.
5. Keep Lovable project running 7 days as a fallback before deleting.

---

## What you should expect to break or lose

- **Auth users + passwords** — users will need to reset passwords unless you pay Supabase for an auth migration.
- **Realtime subscribers** disconnect during cutover.
- **`pg_cron` jobs** must be recreated on the new DB.
- **Daily security scan endpoint** (`/api/public/hooks/security-scan`) keeps working; just re-point cron at the Vercel URL.
- **Lovable AI Gateway**: if used, either keep paying for it or rewrite call sites.
- **SEO**: 1–4 weeks of ranking dip on a domain change (mitigated by 301s; not needed if same domain).

---

## What I will do next (after you approve)

1. Generate `schema.sql` — a single consolidated SQL file with every table, RLS policy, GRANT, function, trigger, and cron job, ready to paste into the new Supabase project's SQL editor.
2. Generate `MIGRATION.md` in the repo with the exact Phase 1–4 checklist + Vercel/Netlify/Render command snippets.
3. List every file that contains `lovable.` or Lovable-specific env vars so you know exactly what to edit when you cut over.
4. **Not** modify any auth, OAuth, or env code yet — that flip happens at cutover so the current live app keeps working.

Approve and I'll generate `schema.sql` + `MIGRATION.md`.
