// Best-effort, fire-and-forget operations logger. Never throws, never blocks
// the user. Used to populate the admin dashboard with anonymised tool usage.

import { supabase } from "@/integrations/supabase/client";

export interface OpEntry {
  toolSlug: string;
  fileCount?: number;
  bytesIn?: number;
  durationMs?: number;
  success?: boolean;
  error?: string;
}

export function logOperation(entry: OpEntry) {
  try {
    void supabase.from("operations").insert({
      tool_slug: entry.toolSlug,
      file_count: entry.fileCount ?? null,
      bytes_in: entry.bytesIn ?? null,
      duration_ms: entry.durationMs ?? null,
      success: entry.success ?? true,
      error: entry.error ? entry.error.slice(0, 500) : null,
    });
  } catch {
    /* swallow — logging must never break a tool */
  }
}
