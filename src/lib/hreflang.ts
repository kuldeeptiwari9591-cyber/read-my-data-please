import { SUPPORTED_LOCALES } from "./i18n";
import { abs } from "./site-url";

/**
 * Build hreflang <link> entries for a given path.
 * Uses query-param locale switching (?lang=hi) so a single route serves all locales.
 * URLs are absolute when VITE_SITE_URL is set.
 */
export function hreflangLinks(path: string) {
  const links: Array<{ rel: "alternate"; hrefLang: string; href: string }> = SUPPORTED_LOCALES.map(
    (l) => ({
      rel: "alternate",
      hrefLang: l.code,
      href:
        l.code === "en"
          ? abs(path)
          : abs(`${path}${path.includes("?") ? "&" : "?"}lang=${l.code}`),
    }),
  );
  links.push({ rel: "alternate", hrefLang: "x-default", href: abs(path) });
  return links;
}
