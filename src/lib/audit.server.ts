// Server-only helper for writing to security_audit_log via the service role.
// Import only from .server.ts or inside server-function handlers (after auth checks).

import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type AuditSeverity = "info" | "warn" | "error" | "critical";

export interface AuditEntry {
  event: string;
  severity?: AuditSeverity;
  actor_id?: string | null;
  ip?: string | null;
  user_agent?: string | null;
  route?: string | null;
  details?: Record<string, unknown>;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    await supabaseAdmin.from("security_audit_log").insert({
      event: entry.event,
      severity: entry.severity ?? "info",
      actor_id: entry.actor_id ?? null,
      ip: entry.ip ?? null,
      user_agent: entry.user_agent ?? null,
      route: entry.route ?? null,
      details: (entry.details ?? {}) as never,
    });
  } catch (e) {
    // Never throw from audit — it must not break user-facing flows.
    console.error("[audit] failed", e);
  }
}
