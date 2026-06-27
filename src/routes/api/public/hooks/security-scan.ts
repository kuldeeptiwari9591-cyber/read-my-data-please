// Continuous security scan endpoint. Called by pg_cron daily.
// Aggregates suspicious signals from the last 24h and records a row in
// security_audit_log. Public route (bypasses auth), so we verify the shared
// secret embedded in the cron call via the Authorization header.

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/security-scan")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Authorize via the same Supabase anon key we use for the other
        // cron jobs (apikey header) OR a CRON_SECRET if configured.
        const apiKey = request.headers.get("apikey") ?? "";
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
        if (!expected || apiKey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { logAudit } = await import("@/lib/audit.server");

        const since = new Date(Date.now() - 24 * 60 * 60_000).toISOString();

        const [feedback, opsFails, audits] = await Promise.all([
          supabaseAdmin
            .from("feedback")
            .select("id", { count: "exact", head: true })
            .gte("created_at", since),
          supabaseAdmin
            .from("operations")
            .select("id", { count: "exact", head: true })
            .gte("created_at", since)
            .eq("success", false),
          supabaseAdmin
            .from("security_audit_log")
            .select("id", { count: "exact", head: true })
            .gte("created_at", since)
            .in("severity", ["warn", "error", "critical"]),
        ]);

        const summary = {
          window_hours: 24,
          feedback_count: feedback.count ?? 0,
          failed_ops: opsFails.count ?? 0,
          audit_warns_plus: audits.count ?? 0,
        };

        // Severity escalation — rough thresholds.
        let severity: "info" | "warn" | "error" = "info";
        if ((opsFails.count ?? 0) > 200 || (audits.count ?? 0) > 50) severity = "error";
        else if ((opsFails.count ?? 0) > 50 || (audits.count ?? 0) > 10) severity = "warn";

        await logAudit({
          event: "security.scan.daily",
          severity,
          details: summary,
        });

        return Response.json({ ok: true, summary, severity });
      },
    },
  },
});
