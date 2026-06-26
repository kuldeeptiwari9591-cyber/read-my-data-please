// Centralised absolute-URL helper for SEO tags and the sitemap.
// Set VITE_SITE_URL in your environment (e.g. https://crisppdf.com) for
// absolute canonical / og:url / og:image / sitemap URLs. When unset, the
// helpers return relative paths so crawlers resolve them against the
// current host (safe in preview before a domain is wired up).

export const SITE_URL: string = (import.meta.env.VITE_SITE_URL as string | undefined) ?? "";

/** Absolute URL when SITE_URL is set, otherwise the original relative path. */
export function abs(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return SITE_URL ? `${SITE_URL.replace(/\/$/, "")}${path}` : path;
}

/** Default OG / Twitter card image. Lives in /public. */
export const OG_DEFAULT = abs("/og-default.svg");
