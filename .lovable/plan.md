# Migrate CrispPDF from Lovable → Vercel (with Netlify variant)

Goal: move frontend, server functions, database, auth, secrets, and cron off Lovable with zero data loss and minimum downtime. Honest constraint up front: **auth user passwords cannot be exported on the free Supabase plan** — users will get a password-reset email. Everything else transfers cleanly.

Pre-built assets you already have in the repo: `migration-export/schema.sql` and `migration-export/MIGRATION.md`. This plan supersedes them where they conflict.

---

## Phase 0 — Pre-flight (30 min, do BEFORE touching anything)

1. Push the repo to your own GitHub account (Lovable → GitHub connect → transfer ownership in GitHub settings).
2. Pick a target host: **Vercel** (recommended — best TanStack Start support) or **Netlify** (works, same steps).
3. Buy / confirm the domain you want to launch on. Keep the existing `*.lovable.app` URL alive until cutover.
4. Make a Google Cloud OAuth client (Console → APIs & Services → Credentials → OAuth client ID → Web application). Save Client ID + Secret — you'll need them in Phase 2.
5. Sign up for: Supabase (free tier OK to start), Vercel, hCaptcha (you already have keys), PostHog, Sentry. Reuse existing PostHog / Sentry projects.

## Phase 1 — Stand up the new Supabase project (1 hr)

1. supabase.com → New Project. Region close to your users (India → Mumbai / Singapore). Save:
   - Project URL, anon (publishable) key, service_role key, DB password, project ref.
2. SQL Editor → paste the entire contents of `migration-export/schema.sql` → Run. Creates all 7 tables (`announcements`, `blog_posts`, `feedback`, `operations`, `security_audit_log`, `tool_settings`, `user_roles`) with RLS, GRANTs, the `has_role` function, and the `app_role` enum.
3. Database → Extensions → enable `pg_cron` and `pg_net`.
4. Authentication → Providers:
   - **Email**: enable. Turn ON "Confirm email" and "Leaked password protection (HIBP)".
   - **Google**: enable. Paste Client ID + Secret from Phase 0. Copy the Supabase callback URL (`https://<ref>.supabase.co/auth/v1/callback`) into Google Cloud → Authorized redirect URIs.
5. Authentication → URL Configuration → set Site URL to your final domain; add `https://<final-domain>/auth/callback` and `http://localhost:8080` (for local dev) to "Redirect URLs".

## Phase 2 — Code changes (one commit, do not deploy yet)

These are the only files that must change for portability:

1. **Replace Lovable OAuth broker.** Search `grep -rn "lovable.auth\|@/integrations/lovable" src/`. For each match, swap to standard Supabase:
   ```ts
   await supabase.auth.signInWithOAuth({
     provider: "google",
     options: { redirectTo: `${window.location.origin}/auth/callback` },
   });
   ```
   Currently CrispPDF has no `lovable.auth` calls (verified), but the `/auth` page may still need a Google button wired this way if you want Google sign-in post-migration.
2. **Create `/auth/callback` route** at `src/routes/auth.callback.tsx` that calls `supabase.auth.getSession()` then redirects to `/` (or saved path).
3. **Regenerate Supabase types** against new project:
   ```bash
   npx supabase login
   npx supabase gen types typescript --project-id <new-ref> > src/integrations/supabase/types.ts
   ```
4. **Verify `src/integrations/supabase/client.ts` and `client.server.ts`** read env names that Vercel will provide (`VITE_SUPABASE_URL`, `SUPABASE_URL`, etc.). No code change usually — just confirm.
5. **Delete the now-unused `@/integrations/lovable/*` import paths and `@lovable.dev/cloud-auth-js` from `package.json`** (only if step 1 found matches).
6. Commit as `chore: portability — swap Lovable OAuth, regen types`. **Do not deploy this commit on Lovable** — push to a `migration` branch.

## Phase 3 — Deploy frontend to Vercel (45 min)

1. vercel.com → Add New Project → import the GitHub repo → branch `migration`.
2. Framework: Vite (auto-detected). Build command: `bun run build`. Output: `.output/` (TanStack Start default — Vercel detects it).
3. Project Settings → Environment Variables (Production + Preview + Development for each):

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

4. Deploy → wait for `*.vercel.app` URL.
5. Smoke test on `*.vercel.app`: home loads, compress-pdf works, merge-pdf works, sign up + sign in, feedback submits with hCaptcha, blog renders, sitemap loads.
6. Add custom domain (Settings → Domains). Update DNS at registrar per Vercel's instructions (A `76.76.21.21` or CNAME). Wait for SSL (5-30 min).
7. Update `VITE_SITE_URL` env to the final domain → redeploy so canonicals/sitemap absolutize.

### Netlify variant (skip if using Vercel)
Same flow. New site → import from GitHub → Vite auto-detected. Env vars under Site Settings → Environment. `netlify.toml` already exists in the repo. DNS via Netlify Domains tab.

## Phase 4 — Data migration (cutover day, 30-60 min)

1. **Freeze writes on Lovable**: Cloud → set `tool_settings.maintenance_mode = true` or push a banner via `announcements`.
2. **Export from Lovable** (Cloud → Database → Tables → Download CSV) in this order:
   1. `tool_settings`
   2. `announcements`
   3. `blog_posts`
   4. `feedback`
   5. `operations`
   6. `security_audit_log`
   7. `user_roles` (LAST — depends on auth.users)
3. **Auth users**: Cloud → Users → export CSV of email addresses. You cannot transfer password hashes on free plan.
4. **Import into new Supabase**: Table Editor → Import CSV per table, same order. For `user_roles` you'll first need users to exist — see step 5.
5. **Recreate auth users**: in new Supabase Authentication → Users → bulk invite (uploads CSV of emails, sends password-reset to each). Users set a new password on first sign-in.
6. **Re-create admin user_roles**: once your own admin user is re-invited and you've signed in, run in SQL Editor:
   ```sql
   INSERT INTO user_roles(user_id, role)
   VALUES ((SELECT id FROM auth.users WHERE email='you@example.com'), 'admin');
   ```
7. **Recreate the daily security-scan cron** in SQL Editor:
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

1. At your registrar, change DNS to point to Vercel (remove the Lovable A record).
2. Wait 5-30 min for propagation. Verify with `dig your-domain.com`.
3. Vercel issues SSL automatically.
4. Hit the live URL: smoke-test the same 6 flows from Phase 3 step 5.
5. Submit new `https://your-domain.com/sitemap.xml` to Google Search Console + Bing Webmaster Tools. Add a property for the new domain if you migrated domains.

## Phase 6 — Post-cutover (first 7 days)

1. Watch Sentry for errors and PostHog for funnel drop-offs for 48 h.
2. Keep the Lovable project running 7 days as fallback.
3. Email users (if you have a list) telling them to reset password on next sign-in.
4. Day 8: delete Lovable project.

---

## What you will lose

- **Auth passwords** — users reset via email (free Supabase plan limit).
- **Realtime subscriptions** disconnect during the DNS flip (no realtime usage in CrispPDF, so impact = zero).
- **Lovable connectors / Lovable AI Gateway** — not used in CrispPDF, no action.
- **Lovable-managed Google OAuth broker** — replaced with standard Supabase OAuth (Phase 2 step 1).

## What stays identical

- All 40 PDF tools (run in the browser, no server dependency).
- All SEO infra (sitemap, robots, llms.txt, ai.txt, JSON-LD, pSEO routes).
- Database schema, RLS, audit log, rate limiting, hCaptcha, PostHog, Sentry, web-vitals tracking.
- Admin panel at `/_authenticated/cp-crisp-7x92k`.

## Estimated total time

~4-5 hours of focused work across two days (Phases 0-3 day one, Phases 4-6 day two during a low-traffic window).

## What I do next if you approve

1. Create the `migration` branch.
2. Wire `supabase.auth.signInWithOAuth("google", …)` into `/auth` page + add `/auth/callback` route.
3. Update `migration-export/MIGRATION.md` to match this plan exactly.
4. Hand you the commit to push — you handle the Vercel + Supabase clicks since they need your credentials.

Approve and I'll start with step 2.
