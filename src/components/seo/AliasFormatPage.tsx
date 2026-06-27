// Shared renderer for root-level format alias pages. Each alias route is
// just a thin wrapper that passes its slug to this component.
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { TOOLS_BY_SLUG, TOOLS } from "@/lib/tools";
import { FORMAT_PAIRS_BY_SLUG } from "@/lib/pseo/formats";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { hreflangLinks } from "@/lib/hreflang";

export function aliasHead(slug: string) {
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
}

export function AliasFormatPage({ slug }: { slug: string }) {
  const f = FORMAT_PAIRS_BY_SLUG[slug];
  if (!f) {
    return <div className="p-10 text-sm text-muted-foreground">Format not configured.</div>;
  }
  const tool = f.toolSlug ? TOOLS_BY_SLUG[f.toolSlug] ?? null : null;
  const related = TOOLS.filter((t) =>
    ["jpg-to-pdf", "pdf-to-jpg", "merge-pdf", "compress-pdf"].includes(t.slug),
  ).slice(0, 3);
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
        { q: `What's the difference between ${f.from} and ${f.to}?`, a: `${f.from} is the source format; ${f.to} is the output. Converting preserves visual content while changing the file structure.` },
      ]}
      related={related}
    />
  );
}
