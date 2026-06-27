# CrispPDF — Migration from Lovable to Vercel / Netlify / Render

This folder contains everything you need to move CrispPDF off Lovable.

- `schema.sql` — consolidated DB schema (all migrations concatenated). Paste into your new Supabase project's SQL editor.
- `MIGRATION.md` — this checklist.

---

## Phase 1 — New Supabase project

1. Create project at https://supabase.com. Save `Project URL`, `anon key`, `service_role key`, `DB password`.
2. Supabase SQL Editor → paste **all of `schema.sql`** → Run. This creates every table, RLS policy, GRANT, function, trigger.
3. Enable extensions (Database → Extensions): `pg_cron`, `pg_net`.
4. Export data from Lovable Cloud (Cloud → Database → Tables → CSV) in this order, then import into the new project (Table Editor → Import CSV):
   1. `tool_settings`
   2. `announcements`
   3. `blog_posts`
   4. `feedback`
   5. `operations`
   6. `security_audit_log`
   7. `user_roles` (LAST — depends on auth.users)
5. Recreate auth users: Supabase Dashboard → Authentication → Users → Invite (sends password-reset email). `auth.users` rows cannot be CSV-imported on the free plan.
6. Configure Google OAuth: Authentication → Providers → Google → paste your own Google Cloud OAuth client ID/secret. Add `https://<your-domain>/auth/callback` to "Authorized redirect URIs" in Google Cloud Console.
7. Recreate the daily security-scan cron:
   ```sql
   SELECT cron.schedule(
     'daily-security-scan',
     '0 3 * * *',
     $$ SELECT net.http_post(
       url := 'https://YOUR-DOMAIN/api/public/hooks/security-scan',
       headers := '{"Content-Type":"application/json","apikey":"YOUR_ANON_KEY"}'::jsonb
     ); $$
   );
   ```

---

## Phase 2 — Code changes (one commit before deploy)

### 2a. Replace Lovable OAuth broker (only if used)
Search the codebase: `grep -r "lovable.auth" src/`. If anything matches, swap:
```ts
// before
await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
// after
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: { redirectTo: `${window.location.origin}/auth/callback` },
});
```
(CrispPDF currently has no `lovable.auth` calls — verified at export time.)

### 2b. Regenerate Supabase types
```bash
npx supabase login
npx supabase gen types typescript --project-id <new-project-ref> > src/integrations/supabase/types.ts
```

### 2c. Env vars rename
Vercel/Netlify/Render don't auto-inject `SUPABASE_*` server vars. Confirm `src/integrations/supabase/client.ts` and `client.server.ts` read the right names. If they read `process.env.SUPABASE_URL`, set that — not `VITE_SUPABASE_URL` — on the server side.

### 2d. Remove Lovable AI Gateway (only if used)
Search: `grep -r "LOVABLE_API_KEY\|ai.gateway.lovable" src/`. If matched, swap to OpenAI/Anthropic with your own key.

---

## Phase 3 — Deploy to Vercel (recommended)

1. Push repo to your own GitHub.
2. https://vercel.com → New Project → Import the repo. Framework auto-detected as Vite.
3. Project Settings → Environment Variables (all three envs — Production, Preview, Development):

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | new project URL |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | new anon key |
   | `VITE_SUPABASE_PROJECT_ID` | new project ref |
   | `SUPABASE_URL` | new project URL |
   | `SUPABASE_PUBLISHABLE_KEY` | new anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | new service role key |
   | `VITE_SITE_URL` | https://your-domain.com |
   | `VITE_GA4_ID` | G-XXXX |
   | `VITE_POSTHOG_KEY` | phc_… |
   | `VITE_SENTRY_DSN` | https://…ingest.sentry.io/… |
   | `VITE_HCAPTCHA_SITE_KEY` | hCaptcha site key |
   | `HCAPTCHA_SECRET` | hCaptcha secret |

4. Deploy. Smoke-test on `*.vercel.app`: compress PDF, merge, sign in, blog, feedback.
5. Add custom domain (Settings → Domains). Update DNS at your registrar per Vercel's instructions.
6. Once domain is live, set `VITE_SITE_URL` to final URL → redeploy so canonicals/sitemap absolutize.
7. Submit `https://your-domain/sitemap.xml` to Google Search Console + Bing Webmaster.

### Netlify variant
Same steps. Vite preset auto-detected. Env vars under Site Settings → Environment Variables. DNS via Netlify Domains.

### Render variant
Create a **Web Service** (not Static Site — server functions need Node). Build: `bun install && bun run build`. Start: `bun run start`. Same env vars. Slower cold starts than Vercel/Netlify.

---

## Phase 4 — Cutover day

1. On Lovable: set a maintenance banner (`tool_settings` → maintenance mode ON).
2. Re-export CSVs that changed since Phase 1 → re-import into new Supabase.
3. Flip DNS to Vercel (or remove Lovable A-record).
4. Watch Sentry + PostHog for 48 h.
5. Keep Lovable project alive for 7 days as fallback, then delete.

---

## Known losses

- Auth passwords (users reset via email invite).
- `pg_cron` jobs (recreated manually — only one in this project).
- Lovable AI Gateway — not used in CrispPDF, no action.
- Lovable connectors — none configured in CrispPDF.
- Realtime subscribers disconnect during DNS flip.

## Tables exported from this project

`announcements`, `blog_posts`, `feedback`, `operations`, `security_audit_log`, `tool_settings`, `user_roles`.

## DB functions exported

`has_role(uuid, app_role)` — SECURITY DEFINER, EXECUTE granted to anon + authenticated (required by RLS policies that check role for unauthenticated visitors).
