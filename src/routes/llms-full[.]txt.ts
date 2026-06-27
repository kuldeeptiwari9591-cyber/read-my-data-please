// /llms-full.txt — full content for LLM ingestion. Includes per-tool detail.
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { TOOLS } from "@/lib/tools";
import { getToolContent } from "@/lib/tool-content";
import { SITE_URL } from "@/lib/site-url";

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: async () => {
        const parts: string[] = [
          "# CrispPDF — Full Reference",
          "",
          "Free browser-first PDF toolkit. 40 tools. No signup, no watermarks. Most tools run locally in the user's browser, so files never leave the device.",
          "",
        ];
        for (const t of TOOLS) {
          const c = getToolContent(t.slug, t.name);
          parts.push(`## ${t.name}`);
          parts.push(`URL: ${SITE_URL}/${t.slug}`);
          parts.push(`Category: ${t.category}`);
          parts.push(`Processing: ${t.processing === "browser" ? "100% in-browser (files never uploaded)" : "server-assisted (files in-memory, discarded immediately)"}`);
          parts.push("");
          parts.push(c.seoDescription ?? t.description);
          parts.push("");
          parts.push("### How to use");
          c.howTo.forEach((s, i) => parts.push(`${i + 1}. **${s.name}** — ${s.text}`));
          parts.push("");
          parts.push("### FAQ");
          c.faqs.slice(0, 5).forEach((f) => {
            parts.push(`**${f.q}**`);
            parts.push(f.a);
            parts.push("");
          });
          parts.push("---");
          parts.push("");
        }
        return new Response(parts.join("\n"), {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
