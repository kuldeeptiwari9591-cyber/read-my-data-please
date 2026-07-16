// India-first site. Emit en-IN (primary), en (fallback), and x-default
// so search engines geo-target Indian users while still serving the same
// URL globally. All three point at the same absolute URL — canonical stays
// self-referencing on the leaf route.
import { abs } from "@/lib/site-url";

export function hreflangLinks(path: string) {
  const href = abs(path);
  return [
    { rel: "alternate" as const, hrefLang: "en-IN", href },
    { rel: "alternate" as const, hrefLang: "en", href },
    { rel: "alternate" as const, hrefLang: "x-default", href },
  ];
}
