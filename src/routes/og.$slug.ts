// Dynamic OG card per tool — returns an SVG with the tool name + tagline.
// Cached for 24h. Used by tool-head.ts so every tool gets a unique
// social-share preview instead of the same generic image.
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { TOOLS_BY_SLUG } from "@/lib/tools";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/og/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const raw = params.slug.replace(/\.svg$/i, "");
        const tool = TOOLS_BY_SLUG[raw];
        const title = tool ? tool.name : "CrispPDF";
        const desc = tool
          ? tool.description
          : "40 free PDF tools. No signup, no watermarks.";

        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A0A0F"/>
      <stop offset="100%" stop-color="#161629"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6366F1"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="980" cy="120" r="220" fill="#6366F1" opacity="0.18"/>
  <circle cx="160" cy="540" r="260" fill="#8B5CF6" opacity="0.14"/>
  <g font-family="'Inter', 'Helvetica', sans-serif" fill="#FFFFFF">
    <text x="80" y="120" font-size="28" font-weight="600" fill="url(#accent)" letter-spacing="4">CRISPPDF</text>
    <text x="80" y="290" font-size="84" font-weight="700">${escapeXml(title)}</text>
    <text x="80" y="370" font-size="32" font-weight="400" fill="#B4B4C7">${escapeXml(desc).slice(0, 90)}</text>
    <text x="80" y="560" font-size="24" font-weight="500" fill="#9CA3AF">Free · No signup · No watermarks · crisppdf.in</text>
  </g>
  <rect x="80" y="585" width="120" height="4" fill="url(#accent)"/>
</svg>`;

        return new Response(svg, {
          headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        });
      },
    },
  },
});
