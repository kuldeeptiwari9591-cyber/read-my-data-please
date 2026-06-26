import { SUPPORTED_LOCALES } from "./i18n";

/**
 * Build hreflang <link> entries for a given path.
 * Uses query-param locale switching (?lang=hi) so a single route serves all locales.
 */
export function hreflangLinks(path: string) {
  const links: Array<{ rel: "alternate"; hrefLang: string; href: string }> = SUPPORTED_LOCALES.map(
    (l) => ({
      rel: "alternate",
      hrefLang: l.code,
      href: l.code === "en" ? path : `${path}${path.includes("?") ? "&" : "?"}lang=${l.code}`,
    }),
  );
  links.push({ rel: "alternate", hrefLang: "x-default", href: path });
  return links;
}
