# CrispPDF — Migration from Lovable to Vercel / Netlify

Authoritative migration guide. Mirrors `.lovable/plan.md`.

Pre-built assets in this folder:
- `schema.sql` — consolidated DB schema (paste into new Supabase SQL editor)
- `MIGRATION.md` — this file

Honest constraint up front: on the Supabase free plan, **auth user passwords cannot be exported**. Users will reset on first sign-in. Everything else transfers cleanly.

---

## Phase 0 — Pre-flight (30 min)

1. Push the repo to your own GitHub.
2. Pick host: **Vercel** (recommended) or Netlify.
3. Buy / confirm final domain. Keep `*.lovable.app` alive until cutover.
4. Google Cloud Console → Credentials → OAuth client ID (Web app). Save Client ID + Secret.
5. Accounts: Supabase, Vercel, hCaptcha (reuse existing keys), PostHog, Sentry.

## Phase 1 — New Supabase project (1 hr)

1. supabase.com → New Project. Region close to users (India: Mumbai/Singapore).
2. Save: Project URL, anon key, service_role key, DB password, project ref.
3. SQL Editor → paste all of `schema.sql` → Run. Creates 7 tables, RLS, GRANTs, `has_role`, `app_role` enum.
4. Database → Extensions → enable `pg_cron`, `pg_net`.
5. Auth → Providers:
   - Email: ON. Enable "Confirm email" and "Leaked password protection (HIBP)".
   - Google: ON. Paste Client ID + Secret. Copy Supabase callback URL (`https://<ref>.supabase.co/auth/v1/callback`) into Google Cloud Authorized redirect URIs.
6. Auth → URL Configuration → Site URL = final domain. Redirect URLs: `https://<final-domain>/auth/callback`, `http://localhost:8080`.

## Phase 2 — Code changes (one commit, do NOT deploy on Lovable)

CrispPDF has no `lovable.auth` calls today — verified. Code changes needed are minimal:

1. `/auth/callback` route — already added at `src/routes/auth.callback.tsx`. Reads `sessionStorage.post_auth_redirect` for the intended destination.
2. If you want Google sign-in on the new host, add a button to `src/routes/auth.tsx`:
   ```ts
   await supabase.auth.signInWithOAuth({
     provider: "google",
     options: { redirectTo: `${window.location.origin}/auth/callback` },
   });
   ```
   Set `sessionStorage.setItem("post_auth_redirect", search.redirect ?? "/")` before calling, so the callback knows where to land.
3. Regenerate types against new project:
   ```bash
   npx supabase login
   npx supabase gen types typescript --project-id <new-ref> > src/integrations/supabase/types.ts
   ```
4. Verify `src/integrations/supabase/client.ts` and `client.server.ts` use env names Vercel will provide (`VITE_SUPABASE_URL`, `SUPABASE_URL`, etc.). Usually no change needed.
5. Commit on a `migration` branch. Do NOT publish on Lovable from this branch.

## Phase 3 — Deploy frontend to Vercel (45 min)

1. vercel.com → Add New Project → import repo → `migration` branch.
2. Framework: Vite (auto). Build: `bun run build`. Output: `.output/` (TanStack Start default).
3. Project Settings → Environment Variables (Production + Preview + Development):

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | new project URL |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | new anon key |
   | `VITE_SUPABASE_PROJECT_ID` | new project ref |
   | `SUPABASE_URL` | new project URL |
   | `SUPABASE_PUBLISHABLE_KEY` | new anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | new service role key |
   | `VITE_SITE_URL` | https://your-final-domain.com |
   | `VITE_GA4_ID` | G-XXXX |
   | `VITE_POSTHOG_KEY` | phc_… |
   | `VITE_SENTRY_DSN` | https://…ingest.sentry.io/… |
   | `VITE_HCAPTCHA_SITE_KEY` | hCaptcha site key |
   | `HCAPTCHA_SECRET` | hCaptcha secret |

4. Deploy. Smoke-test on `*.vercel.app`: home, compress-pdf, merge-pdf, sign in, feedback (hCaptcha), blog, `/sitemap.xml`.
5. Settings → Domains → add custom domain. Update DNS at registrar (A `76.76.21.21` or CNAME per Vercel).
6. Once domain is live, set `VITE_SITE_URL` to final domain → redeploy so canonicals/sitemap absolutize.

### Netlify variant
Same steps. `netlify.toml` already exists in the repo. Env vars under Site Settings → Environment.

## Phase 4 — Data migration (cutover day, 30–60 min)

1. Freeze writes on Lovable: set `tool_settings.maintenance_mode = true` or push an `announcements` banner.
2. Export CSVs from Lovable Cloud → Database → Tables, in this order:
   1. `tool_settings`
   2. `announcements`
   3. `blog_posts`
   4. `feedback`
   5. `operations`
   6. `security_audit_log`
   7. `user_roles` (LAST)
3. Auth users: Cloud → Users → export emails CSV. Password hashes NOT exportable on free plan.
4. Import CSVs into new Supabase (Table Editor → Import CSV), same order.
5. Auth → Users → bulk invite (uploads emails CSV, sends password-reset to each).
6. Re-create your admin role after signing in:
   ```sql
   INSERT INTO user_roles(user_id, role)
   VALUES ((SELECT id FROM auth.users WHERE email='you@example.com'), 'admin');
   ```
7. Re-create daily security-scan cron:
   ```sql
   SELECT cron.schedule(
     'daily-security-scan', '0 3 * * *',
     $$ SELECT net.http_post(
       url := 'https://your-final-domain.com/api/public/hooks/security-scan',
       headers := '{"Content-Type":"application/json"}'::jsonb
     ); $$
   );
   ```

## Phase 5 — DNS flip & verification (15 min)

1. Registrar → change DNS to Vercel (remove Lovable A record).
2. Wait 5–30 min. Verify with `dig your-domain.com`.
3. Vercel auto-issues SSL.
4. Smoke-test live URL (same 6 flows as Phase 3).
5. Submit new `https://your-domain.com/sitemap.xml` to Google Search Console + Bing Webmaster.

## Phase 6 — Post-cutover (first 7 days)

1. Watch Sentry + PostHog for 48 h.
2. Keep Lovable project alive 7 days as fallback.
3. Email users to reset password on next sign-in (if you have a list).
4. Day 8: delete Lovable project.

---

## What you lose

- Auth passwords (free Supabase plan limit — users reset).
- Realtime subscribers during DNS flip (CrispPDF doesn't use realtime; impact = zero).
- Lovable AI Gateway, Lovable connectors — not used in CrispPDF, no action.

## What stays identical

- All 40 PDF tools (browser-side, zero server dependency).
- SEO infra: sitemap, robots, llms.txt, ai.txt, JSON-LD, pSEO routes.
- Schema, RLS, audit log, rate limiting, hCaptcha, PostHog, Sentry, web-vitals.
- Admin at `/_authenticated/cp-crisp-7x92k`.

## Tables exported

`announcements`, `blog_posts`, `feedback`, `operations`, `security_audit_log`, `tool_settings`, `user_roles`.

## DB functions

`has_role(uuid, app_role)` — SECURITY DEFINER, EXECUTE granted to anon + authenticated (required by RLS policies that check role for unauthenticated blog reads).
