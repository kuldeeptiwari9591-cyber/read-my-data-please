import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// Canonical host + scheme. Prevents duplicate content between www/apex and
// http/https. Apex (crisppdf.in) is canonical.
const CANONICAL_HOST = "crisppdf.in";

function canonicalRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  // Only enforce for the production host family; leave preview / localhost alone.
  if (!/(?:^|\.)crisppdf\.in$/i.test(url.hostname)) return null;

  const needsHostRewrite = url.hostname.toLowerCase() !== CANONICAL_HOST;
  const needsSchemeRewrite = url.protocol !== "https:";
  if (!needsHostRewrite && !needsSchemeRewrite) return null;

  url.protocol = "https:";
  url.hostname = CANONICAL_HOST;
  url.port = "";
  return Response.redirect(url.toString(), 301);
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Baseline HTTP security headers applied to every response. We keep CSP
// permissive-but-scoped (allow the app's own origin, Supabase, and inline
// styles used by shadcn/tailwind); nonce-based tightening lands in a
// follow-up PR that threads the nonce through <Scripts nonce=...>.
const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": [
    "default-src 'self'",
    // Inline styles are needed for shadcn / tailwind runtime injection.
    "style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com",
    // Third-party scripts: GA/GTM, PostHog, Sentry, hCaptcha, Vercel Analytics/Speed Insights.
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.posthog.com https://*.i.posthog.com https://*.sentry.io https://browser.sentry-cdn.com https://js.sentry-cdn.com https://hcaptcha.com https://*.hcaptcha.com https://va.vercel-scripts.com https://vercel.live",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://hcaptcha.com https://*.hcaptcha.com",
    // XHR/fetch/beacon endpoints for the same set of vendors + Supabase.
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://*.analytics.google.com https://*.google-analytics.com https://*.posthog.com https://*.i.posthog.com https://*.ingest.sentry.io https://*.sentry.io https://hcaptcha.com https://*.hcaptcha.com https://vitals.vercel-insights.com https://vercel.live",
    // hCaptcha challenge iframe + Vercel live preview toolbar.
    "frame-src 'self' https://hcaptcha.com https://*.hcaptcha.com https://vercel.live",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; "),
};

function withSecurityHeaders(response: Response): Response {
  // Skip for opaque/redirect responses that don't own their headers.
  if (response.status === 301 || response.status === 302 || response.status === 304) {
    return response;
  }
  const headers = new Headers(response.headers);
  // Remove deprecated header if any upstream layer set it.
  headers.delete("X-XSS-Protection");
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const redirect = canonicalRedirect(request);
      if (redirect) return redirect;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return withSecurityHeaders(normalized);
    } catch (error) {
      console.error(error);
      return withSecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
