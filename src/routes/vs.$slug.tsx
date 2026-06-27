import { createFileRoute, notFound } from "@tanstack/react-router";
import { PseoPageShell } from "@/components/seo/PseoPageShell";
import { TOOLS_BY_SLUG, TOOLS } from "@/lib/tools";
import { COMPETITORS_BY_SLUG, parseComparisonPair } from "@/lib/pseo/competitors";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { breadcrumbLd, questionLd, speakableLd } from "@/lib/seo/jsonld";

function resolve(slug: string) {
  const parsed = parseComparisonPair(slug);
  if (!parsed) return null;
  const tool = TOOLS_BY_SLUG[parsed.toolSlug];
  const comp = COMPETITORS_BY_SLUG[parsed.competitorSlug];
  if (!tool || !comp) return null;
  if (!comp.toolSlugs.includes(tool.slug)) return null;
  return { tool, comp };
}

export const Route = createFileRoute("/vs/$slug")({
  head: ({ params }) => {
    const r = resolve(params.slug);
    if (!r) return { meta: [{ title: "Not found — CrispPDF" }] };
    const { tool, comp } = r;
    const title = `CrispPDF ${tool.name} vs ${comp.name} — Honest Comparison`;
    const description = `Compare CrispPDF ${tool.name} with ${comp.name}: price, privacy, watermarks, signup, file limits, and processing speed. Updated 2026.`;
    const path = `/vs/${params.slug}`;
    const canonical = abs(path);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
        { property: "og:image", content: OG_DEFAULT },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_DEFAULT },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd([
          { name: "CrispPDF", url: abs("/") },
          { name: tool.name, url: abs(`/${tool.slug}`) },
          { name: `vs ${comp.name}`, url: canonical },
        ])) },
        { type: "application/ld+json", children: JSON.stringify(speakableLd(path)) },
        { type: "application/ld+json", children: JSON.stringify(questionLd(
          `Is CrispPDF ${tool.name} better than ${comp.name}?`,
          `For privacy-first, browser-based ${tool.name.toLowerCase()}, CrispPDF wins: no upload, no signup, no daily limit, no watermark. ${comp.name} offers more enterprise integrations and team features behind its paid tiers.`,
        )) },
      ],
    };
  },
  component: function ComparisonPage() {
    const { slug } = Route.useParams();
    const r = resolve(slug);
    if (!r) throw notFound();
    const { tool, comp } = r;
    const related = TOOLS.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 3);
    const answer = `CrispPDF ${tool.name} runs entirely in your browser with no signup, no daily limit, and no watermark — at $0 forever. ${comp.name} offers more enterprise features and team management but requires an account and uploads files to its servers.`;

    const rows: Array<[string, string, string]> = [
      ["Price", "Free forever", comp.pricing],
      ["Free-tier limit", "Unlimited", comp.freeLimit],
      ["Signup required", "Never", comp.signupRequired],
      ["Watermark on output", "Never", comp.watermark],
      ["File upload", tool.processing === "browser" ? "No — runs in browser" : "In-memory, discarded after", comp.uploads],
      ["Works offline", "Yes (after first load)", "No"],
      ["Open source friendly", "Yes — MIT-style terms", "Proprietary"],
    ];

    return (
      <PseoPageShell
        crumbs={[
          { name: "CrispPDF", to: "/" },
          { name: tool.name, to: `/${tool.slug}` },
          { name: `vs ${comp.name}` },
        ]}
        badge={`Comparison`}
        title={`CrispPDF ${tool.name} vs ${comp.name}`}
        answer={answer}
        intro={`Both CrispPDF and ${comp.name} let you ${tool.short.toLowerCase()} online. The difference is where the work happens and what it costs you. Here's an honest, side-by-side look at how the two stack up in 2026 — no affiliate links, no sponsored placement.`}
        bullets={[]}
        ctaTool={tool}
        ctaLabel={`Try CrispPDF ${tool.name}`}
        faqs={[
          { q: `Is CrispPDF really free vs ${comp.name}?`, a: `Yes — every CrispPDF tool including ${tool.name} is free forever, with no daily task limit, no email gate, and no watermark.` },
          { q: `Why would I use ${comp.name} instead?`, a: `${comp.name} makes sense if your team needs enterprise SSO, audit logs, or batch automation via API. For one-off and freelance work, CrispPDF is usually faster.` },
          { q: `Is my file private with CrispPDF?`, a: tool.processing === "browser" ? `Yes — ${tool.name} runs locally in your browser. ${comp.name} uploads your file to its servers for processing.` : `Files are processed in-memory and discarded immediately on CrispPDF; ${comp.name} retains files per its cloud retention policy.` },
        ]}
        related={related}
      >
        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-surface/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/60">
                <th className="p-3 text-left font-display font-semibold">Feature</th>
                <th className="p-3 text-left font-display font-semibold text-primary">CrispPDF</th>
                <th className="p-3 text-left font-display font-semibold">{comp.name}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([feat, ours, theirs]) => (
                <tr key={feat} className="border-b border-border/40 last:border-0">
                  <td className="p-3 font-medium">{feat}</td>
                  <td className="p-3 text-success">{ours}</td>
                  <td className="p-3 text-muted-foreground">{theirs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PseoPageShell>
    );
  },
});
