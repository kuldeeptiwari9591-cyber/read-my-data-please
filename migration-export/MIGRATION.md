# CrispPDF → Vercel + Self-Owned Supabase Migration Runbook

End state: frontend + SSR on **Vercel**, database/auth/storage/cron on a **new Supabase project you own**, custom domain `crisppdf.in` flipped over with ~15 min downtime.

---

## Phase 0 — Pre-flight

1. Push repo to GitHub (Lovable editor → Plus (+) → GitHub → Create Repository). `.env` is gitignored.
2. Gather what you'll paste into Vercel later:
   - `VITE_SUPABASE_URL` + `SUPABASE_URL` (new project URL)
   - `VITE_SUPABASE_PUBLISHABLE_KEY` + `SUPABASE_PUBLISHABLE_KEY` (anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SITE_URL=https://crisppdf.in`
   - `VITE_HCAPTCHA_SITE_KEY`, `HCAPTCHA_SECRET`
   - `VITE_POSTHOG_KEY`, `VITE_SENTRY_DSN`, `VITE_GA4_ID`

## Phase 1 — New Supabase project

1. Create a new Supabase project (region: Mumbai `ap-south-1` recommended).
2. SQL Editor → run `migration-export/schema.sql`. Creates: enums, tables, RLS policies, GRANTs, `has_role` function, audit log, triggers.
3. Export data from Lovable Cloud (Cloud → Database → Tables → Export CSV) for:
   `blog_posts`, `feedback`, `announcements`, `tool_settings`, `user_roles`, `operations`, `security_audit_log`.
4. Import each CSV into the matching table on the new project (Table Editor → Import).
5. Recreate `pg_cron`: in the new project's SQL editor, re-schedule the daily security scan. Update the URL to `https://crisppdf.in/api/public/hooks/security-scan` and use the new project's anon key in the `apikey` header.
6. Auth users — passwords cannot be exported. Either:
   - Use Supabase Auth Admin API to bulk-invite (sends magic-link reset), OR
   - Tell users to use "Forgot password" on first login.
7. Google OAuth: Google Cloud Console → add `https://<new-project-ref>.supabase.co/auth/v1/callback` to authorized redirect URIs. In Supabase: Auth → Providers → Google → paste Client ID + Secret → enable.

## Phase 2 — Code portability changes

These are already done in this repo where possible. Verify before deploy:

- [x] `/auth/callback` route exists (`src/routes/auth.callback.tsx`) and uses raw `supabase.auth`.
- [x] No `lovable.auth.signInWithOAuth` usage anywhere in `src/`.
- [x] `vercel.json` exists at repo root with security headers.
- [x] `vite.config.vercel.ts` ships a Vercel-targeted config (nitro preset = `vercel`).

**Action required just before deploying to Vercel:**

```bash
mv vite.config.ts vite.config.lovable.ts
mv vite.config.vercel.ts vite.config.ts
bun add -D @tanstack/react-start @vitejs/plugin-react @tailwindcss/vite vite-tsconfig-paths
```

The Lovable preset auto-includes plugins; the Vercel config installs them directly.

## Phase 3 — Vercel setup

1. Vercel → New Project → import GitHub repo.
2. Framework preset: **Other**.
3. Build command: `bun run build` (or `npm run build`).
4. Output directory: `.output/public` (auto-set by nitro Vercel preset).
5. Settings → Environment Variables → paste everything from Phase 0 for Production + Preview.
6. Deploy. Test the `*.vercel.app` URL end-to-end.

## Phase 4 — DNS cutover (≈15 min downtime)

1. Enable maintenance banner on Lovable site (optional).
2. Delta-export any new rows from Lovable DB since Phase 1 → import to new Supabase.
3. Domain registrar DNS:
   - Delete `A @ 185.158.133.1` (Lovable)
   - Add `A @ 76.76.21.21` (Vercel)
   - Add `CNAME www cname.vercel-dns.com`
4. Vercel → Project → Settings → Domains → add `crisppdf.in` and `www.crisppdf.in`. SSL auto-provisions.
5. Update Google OAuth authorized origins to include the new Supabase URL.
6. Unpublish the Lovable project once Vercel is serving traffic.

## Phase 5 — Post-migration

1. Verify live: `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/og/compress-pdf`, blog list + detail, feedback + hCaptcha, Google sign-in, admin panel at `/cp-crisp-7x92k`.
2. Run `node scripts/ssr-check.mjs https://crisppdf.in`.
3. Resubmit sitemap in Google Search Console.
4. Email users a password reset (if any auth users exist).
5. Monitor PostHog + Sentry for 24h.

---

## What only YOU can do

- Create the Supabase project (your account)
- Add env vars in Vercel
- Update DNS at registrar
- Update Google OAuth redirect URIs
- Re-invite auth users

Total active hands-on time: ~3 hours. Downtime: ~15 minutes at DNS flip.
