// Server-side search input hardening. Use on every server function that
// accepts a free-text query and passes it into a database filter.

const MAX_LEN = 80;
const MAX_TOKENS = 6;

// Strip characters that have meaning in PostgREST `or=` / `ilike` filters,
// SQL wildcards, and control chars. Collapse whitespace.
export function sanitizeSearch(input: unknown): string {
  if (typeof input !== "string") return "";
  let s = input.normalize("NFKC").trim();
  if (!s) return "";
  // Remove control chars + PostgREST/SQL specials we don't want to forward.
  s = s.replace(/[\u0000-\u001F\u007F]/g, " ");
  s = s.replace(/[%_*,()'"`;\\]/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  if (s.length > MAX_LEN) s = s.slice(0, MAX_LEN);
  return s;
}

export function tokenizeSearch(input: unknown): string[] {
  const s = sanitizeSearch(input);
  if (!s) return [];
  return s.split(" ").filter((t) => t.length >= 2).slice(0, MAX_TOKENS);
}

// PostgREST `ilike` pattern with safe escaping.
export function ilikePattern(token: string): string {
  // sanitizeSearch already stripped % and _, so a plain wildcard wrap is safe.
  return `%${token}%`;
}
