#!/usr/bin/env node
// SSR sanity check: fetches the homepage from a running server and asserts
// (1) the keyword-rich H2 headings are present in the raw HTML (not just
// client-rendered after hydration), and (2) every HOME_FAQS answer is
// present in the FAQPage JSON-LD block so Google can validate the schema.
//
// Usage:  BASE_URL=http://localhost:8080 node scripts/ssr-check.mjs
//         (defaults to http://localhost:8080)

const BASE = process.env.BASE_URL || "http://localhost:8080";

const REQUIRED_H2 = [
  "Free PDF Compressor, Merger, Converter",
  "How to compress, merge or convert a PDF online",
  "The free PDF editor that respects your privacy",
];

const REQUIRED_FAQ_ANSWER_FRAGMENTS = [
  "all 40 tools, no daily limits",          // "Is CrispPDF really free?"
  "files aren't stored",                     // "Are my files private?"
  "shouldn't need an account",               // "Why no signup?"
  "up to ~100 MB",                           // size limit
  "Chrome, Firefox, Safari",                 // browser support
];

const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
  console.log(`${cond ? "✓" : "✗"} ${msg}`);
}

const res = await fetch(BASE + "/", { headers: { Accept: "text/html" } });
const html = await res.text();

assert(res.ok, `GET / returned ${res.status}`);

// 1) H2 keyword headings must be in the server HTML
for (const h2 of REQUIRED_H2) {
  assert(html.includes(h2), `homepage HTML contains H2 fragment: "${h2}"`);
}

// 2) FAQ answers must be in the FAQPage JSON-LD block
const ldMatches = [...html.matchAll(
  /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
)].map((m) => m[1]);
assert(ldMatches.length > 0, "homepage emits at least one JSON-LD script");

const faqLd = ldMatches.find((s) => s.includes('"FAQPage"'));
assert(!!faqLd, "homepage emits FAQPage JSON-LD");

if (faqLd) {
  for (const frag of REQUIRED_FAQ_ANSWER_FRAGMENTS) {
    assert(faqLd.includes(frag), `FAQPage JSON-LD contains answer fragment: "${frag}"`);
  }
}

console.log(`\n${failures.length === 0 ? "PASS" : "FAIL"} — ${failures.length} failure(s)`);
process.exit(failures.length === 0 ? 0 : 1);
