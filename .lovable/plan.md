# CrispPDF → Vercel + Self-Owned Supabase Migration Plan

Goal: move frontend + SSR to **Vercel**, backend (DB, Auth, Storage, cron) to a **new Supabase project you own**, keep the `crisppdf.in` domain live with minimal downtime. No feature regressions.

---

## Phase 0 — Pre-flight (30 min)

1. Push the repo to GitHub via Lovable's GitHub integration (Plus (+) → GitHub → Create Repository). `.env` is already gitignored.
2. Inventory secrets you'll need on Vercel/Supabase:
   - Supabase: URL, publishable (anon) key, service role key, project ref, DB URL
   - hCaptcha: `VITE_HCAPTCHA_SITE_KEY`, `HCAPTCHA_SECRET`
   - PostHog: `VITE_POSTHOG_KEY`
   - Sentry: `VITE_SENTRY_DSN`
   - GA4: `VITE_GA4_ID`
   - `VITE_SITE_URL=https://crisppdf.in`
3. Freeze writes on the Lovable site for 30 min during cutover (optional banner via `SiteBanner`).

---

## Phase 1 — New Supabase project (1 hr)

1. Create a new Supabase project (region close to India, e.g. `ap-south-1`).
2. Run `migration-export/schema.sql` in the SQL editor — creates all tables, RLS, grants, functions (`has_role`), `app_role` enum, audit log.
3. Export data from current Lovable Cloud DB as CSV (Cloud → Database → Tables → Export):
   - `blog_posts`, `feedback`, `announcements`, `tool_settings`, `user_roles`, `operations`, `security_audit_log`
4. Import each CSV into the matching new table (Table Editor → Import).
5. Recreate `pg_cron` jobs (daily security scan): copy the SQL from current project's cron schedule into new project's SQL editor. Replace the target URL with the future Vercel URL.
6. Auth users: passwords cannot be exported. Either:
   - Bulk re-invite via Supabase Auth Admin API (users get magic-link reset), or
   - Ask users to reset password on next login.
7. Configure Google OAuth in new Supabase: Auth → Providers → Google → paste Client ID + Secret from Google Cloud Console; whitelist `https://crisppdf.in/auth/callback`.

---

## Phase 2 — Code portability changes (1 hr)

These edits are required because the project currently uses Lovable Cloud's managed auth broker.

1. **Replace Lovable auth broker** with raw Supabase OAuth:
   - Remove `@lovable.dev/cloud-auth-js` usages (search for `lovable.auth.signInWithOAuth`).
   - Swap to `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '${origin}/auth/callback' }})`.
2. **`src/routes/auth.callback.tsx`** already exists — verify it calls `supabase.auth.exchangeCodeForSession`.
3. **Server runtime**: project targets Cloudflare Workers via `@lovable.dev/vite-tanstack-config`. For Vercel, switch nitro preset:
   - Add `nitro: { preset: 'vercel' }` (or `vercel-edge` if you want edge) to `vite.config.ts`.
   - Verify no Workers-specific globals are used (none currently).
4. **`vercel.json`** — add rewrites so `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/ai.txt`, `/og/*` server routes resolve.
5. **Security headers**: move `public/_headers` (Cloudflare format) into `vercel.json` `headers` block.
6. **Remove Lovable-only files** before deploy: `.lovable/`, `lovable-tagger` references in `vite.config.ts` (handled by upstream plugin automatically when env isn't Lovable, but verify build).

---

## Phase 3 — Vercel setup (30 min)

1. Vercel → New Project → import the GitHub repo.
2. Framework preset: **Other** (TanStack Start handles its own build).
3. Build command: `bun run build` (or `npm run build`).
4. Output directory: `.output/public` (set by nitro vercel preset automatically).
5. Add all env vars from Phase 0 in Vercel → Settings → Environment Variables (Production + Preview).
6. Trigger first deploy. Test on the `*.vercel.app` URL.

---

## Phase 4 — Cutover (15 min downtime window)

1. In current Lovable site, enable maintenance banner ("brief migration in progress").
2. Re-export any new rows from Lovable DB created since Phase 1 CSV dump → import to new Supabase (delta sync).
3. In domain registrar DNS:
   - Remove Lovable A record (`185.158.133.1`).
   - Add Vercel records: `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com`.
4. In Vercel → Settings → Domains → add `crisppdf.in` and `www.crisppdf.in`. SSL auto-provisions.
5. Update Google OAuth Console redirect URIs to point to new Supabase callback.
6. Unpublish the Lovable project (Project settings → Unpublish) once Vercel serves traffic.

---

## Phase 5 — Post-migration (1 hr)

1. Verify: `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/og/compress-pdf`, `/api/public/hooks/security-scan`, blog page, feedback form with hCaptcha, Google sign-in, admin panel.
2. Re-run `scripts/ssr-check.mjs` against `https://crisppdf.in`.
3. Submit new sitemap in Google Search Console.
4. Email signed-up users (if any) a password-reset link.
5. Monitor PostHog + Sentry for 24h.

---

## What I'll do for you in build mode

When you say "go", I will:
- Add `nitro: { preset: 'vercel' }` to `vite.config.ts`
- Create `vercel.json` with rewrites + security headers
- Refactor Google sign-in from `lovable.auth` → raw `supabase.auth`
- Verify `auth.callback.tsx` handles PKCE exchange
- Update `migration-export/MIGRATION.md` with this exact runbook

## What only YOU can do
- Create the new Supabase project (need your account)
- Add env vars in Vercel
- Change DNS at registrar
- Re-invite auth users

Estimated total downtime: **~15 minutes** during DNS cutover.
