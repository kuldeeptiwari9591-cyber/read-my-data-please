// English-only site — no hreflang alternates emitted.
export function hreflangLinks(_path: string) {
  return [] as Array<{ rel: "alternate"; hrefLang: string; href: string }>;
}
