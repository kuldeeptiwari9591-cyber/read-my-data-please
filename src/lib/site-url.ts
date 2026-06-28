// Centralised absolute-URL helper for SEO tags and the sitemap.
// VITE_SITE_URL is set in .env (default https://crisppdf.com).

const RAW = (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://crisppdf.in";

export const SITE_URL: string = RAW.replace(/\/$/, "");

/** Absolute URL for the given path. Always absolute (uses SITE_URL fallback). */
export function abs(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE_URL}${path}`;
}

/** Default OG / Twitter card image. Lives in /public. */
export const OG_DEFAULT = abs("/og-default.svg");
