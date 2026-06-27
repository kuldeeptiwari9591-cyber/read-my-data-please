// Server-side hCaptcha verification. Safe no-op when not configured so dev
// keeps working without a key. Set HCAPTCHA_SECRET (and VITE_HCAPTCHA_SITE_KEY
// for the widget) in production.
export async function verifyHCaptcha(token: string | null | undefined, remoteip?: string) {
  const secret = process.env.HCAPTCHA_SECRET;
  if (!secret) return { ok: true, skipped: true as const };
  if (!token) return { ok: false, skipped: false as const, reason: "missing-token" };

  const body = new URLSearchParams({ secret, response: token });
  if (remoteip) body.set("remoteip", remoteip);

  try {
    const res = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    return json.success
      ? { ok: true, skipped: false as const }
      : { ok: false, skipped: false as const, reason: (json["error-codes"] ?? []).join(",") || "denied" };
  } catch (err) {
    return { ok: false, skipped: false as const, reason: err instanceof Error ? err.message : "verify-failed" };
  }
}
