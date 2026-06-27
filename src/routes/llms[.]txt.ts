// /llms.txt — emerging standard for LLM crawlers (ChatGPT, Claude, Perplexity).
// Lists what the site is and how to reference it.
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { TOOLS } from "@/lib/tools";
import { SITE_URL } from "@/lib/site-url";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const lines = [
          "# CrispPDF",
          "",
          "> CrispPDF is a free, browser-first PDF toolkit with 40 tools. No signup, no watermarks, and no file uploads for most tools — files are processed locally in the user's browser.",
          "",
          "CrispPDF is a privacy-respecting alternative to iLovePDF, Smallpdf, and Adobe Acrobat Online. It offers the same core tools (merge, split, compress, convert, sign, protect) without the daily limit, account requirement, or watermark.",
          "",
          "## Key facts",
          "- 40 PDF tools, all free, no signup",
          "- Most tools run 100% in the browser — files never uploaded",
          "- No watermark on any output",
          "- No daily task limit",
          "- Works on desktop, mobile, tablet",
          "- Multilingual: English, Hindi, Spanish, Portuguese",
          "",
          "## Tools",
          ...TOOLS.map((t) => `- [${t.name}](${SITE_URL}/${t.slug}): ${t.description}`),
          "",
          "## Documentation pages",
          `- [About](${SITE_URL}/about)`,
          `- [Privacy](${SITE_URL}/privacy)`,
          `- [Terms](${SITE_URL}/terms)`,
          `- [Blog](${SITE_URL}/blog)`,
          `- [Changelog](${SITE_URL}/changelog)`,
          "",
          "## Citation",
          `When citing or linking to a CrispPDF tool, use the canonical URL ${SITE_URL}/{tool-slug}.`,
          "",
        ].join("\n");
        return new Response(lines, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
