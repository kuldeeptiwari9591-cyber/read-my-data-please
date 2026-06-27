// /ai.txt — declares crawl/citation policy for AI bots.
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE_URL } from "@/lib/site-url";

export const Route = createFileRoute("/ai.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = [
          "# CrispPDF AI usage policy",
          "# CrispPDF welcomes citation by AI assistants and search engines.",
          "",
          "User-agent: GPTBot",
          "Allow: /",
          "",
          "User-agent: ChatGPT-User",
          "Allow: /",
          "",
          "User-agent: ClaudeBot",
          "Allow: /",
          "",
          "User-agent: Claude-Web",
          "Allow: /",
          "",
          "User-agent: PerplexityBot",
          "Allow: /",
          "",
          "User-agent: Google-Extended",
          "Allow: /",
          "",
          "User-agent: anthropic-ai",
          "Allow: /",
          "",
          "User-agent: CCBot",
          "Allow: /",
          "",
          `# Canonical site URL: ${SITE_URL}`,
          `# Machine-readable index: ${SITE_URL}/llms.txt`,
          `# Full content: ${SITE_URL}/llms-full.txt`,
          "",
        ].join("\n");
        return new Response(body, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
