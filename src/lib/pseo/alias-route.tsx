// Root-level format alias routes. Each renders the canonical PseoPageShell
// for a popular "X to PDF" / "PDF to X" query but lives at root for ranking.
import { createFileRoute, redirect } from "@tanstack/react-router";
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { TOOLS_BY_SLUG, TOOLS } from "@/lib/tools";
import { FORMAT_PAIRS_BY_SLUG } from "@/lib/pseo/formats";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { hreflangLinks } from "@/lib/hreflang";

// Slugs to expose at the root (https://crisppdf.com/png-to-pdf, etc.).
const ROOT_ALIASES = new Set([
  "png-to-pdf",
  "heic-to-pdf",
  "webp-to-pdf",
  "csv-to-pdf",
  "txt-to-pdf",
  "rtf-to-pdf",
  "pdf-to-text",
]);

function makeRoute(slug: string) {
  return createFileRoute(`/${slug}` as never)({
    beforeLoad: () => {
      if (!ROOT_ALIASES.has(slug)) {
        // unknown alias — fall through to a real tool route or 404
        throw redirect({ to: "/" });
      }
    },
    head: () => {
      const f = FORMAT_PAIRS_BY_SLUG[slug];
      if (!f) return { meta: [{ title: "Not found — CrispPDF" }] };
      const path = `/${slug}`;
      const canonical = abs(path);
      const title = `${f.from} to ${f.to} Free — Convert in Browser | CrispPDF`;
      const description = `Convert ${f.from} to ${f.to} online free. ${f.blurb} No upload, no signup, no watermark.`;
      return {
        meta: [
          { title },
          { name: "description", content: description },
          { property: "og:title", content: title },
          { property: "og:description", content: description },
          { property: "og:url", content: canonical },
          { property: "og:type", content: "website" },
          { property: "og:image", content: OG_DEFAULT },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:image", content: OG_DEFAULT },
        ],
        links: [{ rel: "canonical", href: canonical }, ...hreflangLinks(path)],
      };
    },
    component: () => <AliasPage slug={slug} />,
  });
}

function AliasPage({ slug }: { slug: string }) {
  const f = FORMAT_PAIRS_BY_SLUG[slug]!;
  const tool = f.toolSlug ? TOOLS_BY_SLUG[f.toolSlug] ?? null : null;
  const related = TOOLS.filter((t) => ["jpg-to-pdf", "pdf-to-jpg", "merge-pdf", "compress-pdf"].includes(t.slug)).slice(0, 3);
  return (
    <PseoPageShell
      crumbs={[
        { name: "CrispPDF", to: "/" },
        { name: "Convert", to: "/convert-pdf" },
        { name: `${f.from} to ${f.to}` },
      ]}
      badge={`Convert · ${f.from} → ${f.to}`}
      title={`${f.from} to ${f.to} — Free Online Converter`}
      answer={`To convert ${f.from} to ${f.to}, drop your ${f.fromExt} file into CrispPDF's ${f.via ?? tool?.name ?? "converter"}. ${f.blurb} Free, no signup, no watermark. Runs entirely in your browser — your file never reaches a server.`}
      intro={f.blurb}
      bullets={[
        `Handles ${f.fromExt} natively in the browser`,
        "No signup, no watermark, no daily limit",
        "Works on phone, tablet, and desktop",
        "Files never uploaded to any server",
      ]}
      ctaTool={tool}
      ctaLabel={`Open ${tool?.name ?? "tool"}`}
      faqs={[
        { q: `Is ${f.from} to ${f.to} free?`, a: `Yes — completely free, no signup, no daily limit, no watermark.` },
        { q: `Do you upload my ${f.from} file?`, a: `No. Conversion runs entirely in your browser using CrispPDF's ${f.via ?? tool?.name ?? "converter"}.` },
      ]}
      related={related}
    />
  );
}

// Export individual routes — TanStack Start needs one createFileRoute per file,
// so we re-export per alias from sibling files. This file only exposes helpers.
export { makeRoute };
