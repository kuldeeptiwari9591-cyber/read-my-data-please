import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { checkRateLimit } from "@/lib/server-rate-limit";
import { logAudit } from "@/lib/audit.server";

type FeedbackType = "feedback" | "bug" | "tool_request";

function clientFingerprint(): { ip: string; ua: string } {
  let ip = "unknown";
  try {
    ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
  } catch {
    /* not in request context */
  }
  const ua = getRequestHeader("user-agent") ?? "";
  return { ip, ua };
}

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      type: FeedbackType;
      tool_slug?: string | null;
      rating?: number | null;
      message: string;
      email?: string | null;
      captchaToken?: string | null;
    }) => {
      if (!d || typeof d !== "object") throw new Error("Invalid payload");
      if (!["feedback", "bug", "tool_request"].includes(d.type))
        throw new Error("Invalid type");
      if (!d.message || d.message.length < 10 || d.message.length > 5000)
        throw new Error("Message must be 10–5000 characters");
      if (d.email && d.email.length > 200) throw new Error("Email too long");
      if (d.rating != null && (d.rating < 1 || d.rating > 5))
        throw new Error("Invalid rating");
      const links = (d.message.match(/https?:\/\//gi) ?? []).length;
      if (links > 3) throw new Error("Too many links in message");
      return d;
    },
  )
  .handler(async ({ data }) => {
    const { ip, ua } = clientFingerprint();

    // hCaptcha verification (no-op when HCAPTCHA_SECRET unset)
    const { verifyHCaptcha } = await import("@/lib/hcaptcha.server");
    const captcha = await verifyHCaptcha(data.captchaToken, ip);
    if (!captcha.ok) {
      await logAudit({
        event: "feedback.captcha_failed",
        severity: "warn",
        ip,
        user_agent: ua,
        route: "/feedback",
        details: { reason: "reason" in captcha ? captcha.reason : "unknown" },
      });
      throw new Error("Captcha verification failed. Please try again.");
    }

    const rl = checkRateLimit({
      key: `feedback:${ip}`,
      limit: 5,
      windowMs: 60_000,
    });
    if (!rl.allowed) {
      await logAudit({
        event: "feedback.rate_limited",
        severity: "warn",
        ip,
        user_agent: ua,
        route: "/feedback",
        details: { retryInMs: rl.retryInMs, used: rl.used },
      });
      throw new Error(
        `Too many submissions — try again in ${Math.ceil(rl.retryInMs / 1000)}s`,
      );
    }

    const { error } = await supabaseAdmin.from("feedback").insert({
      type: data.type,
      tool_slug: data.tool_slug ?? null,
      rating: data.rating ?? null,
      message: data.message,
      email: data.email ?? null,
      status: "open",
    });
    if (error) {
      await logAudit({
        event: "feedback.insert_failed",
        severity: "error",
        ip,
        user_agent: ua,
        route: "/feedback",
        details: { message: error.message },
      });
      throw new Error(error.message);
    }

    await logAudit({
      event: "feedback.submitted",
      severity: "info",
      ip,
      user_agent: ua,
      route: "/feedback",
      details: { type: data.type, tool_slug: data.tool_slug ?? null },
    });

    return { ok: true };
  });
