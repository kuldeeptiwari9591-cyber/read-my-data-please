import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { TOOLS } from "@/lib/tools";
import { allUseCasePairs } from "@/lib/pseo/use-cases";
import { allComparisonPairs } from "@/lib/pseo/competitors";
import { FORMAT_PAIRS } from "@/lib/pseo/formats";
import { SIZE_TARGETS } from "@/lib/pseo/size-targets";

import { listPublishedPosts } from "@/lib/blog.functions";

const COMPRESS_USES = ["whatsapp", "email", "passport-photo"];
const ROOT_FORMAT_ALIASES = ["png-to-pdf", "heic-to-pdf", "webp-to-pdf", "csv-to-pdf", "txt-to-pdf"];

// Always emit absolute URLs. Falls back to crisppdf.com when VITE_SITE_URL is unset.
const BASE_URL = ((import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://crisppdf.com").replace(/\/$/, "");

interface SitemapEntry {
  path: string;
  changefreq?: "weekly" | "monthly";
  priority?: string;
  lastmod?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let posts: Awaited<ReturnType<typeof listPublishedPosts>> = [];
        try {
          posts = await listPublishedPosts();
        } catch {
          /* sitemap should still render without blog */
        }

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.5" },
          { path: "/why-crisppdf", changefreq: "monthly", priority: "0.7" },
          { path: "/faq", changefreq: "monthly", priority: "0.7" },
          { path: "/feedback", changefreq: "monthly", priority: "0.5" },
          { path: "/contact", changefreq: "monthly", priority: "0.5" },
          { path: "/privacy", changefreq: "monthly", priority: "0.3" },
          { path: "/terms", changefreq: "monthly", priority: "0.3" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          
          ...posts.map((p) => ({
            path: `/blog/${p.slug}`,
            changefreq: "monthly" as const,
            priority: "0.6",
            lastmod: p.published_at ?? undefined,
          })),
          { path: "/organize-pdf", changefreq: "monthly", priority: "0.7" },
          { path: "/convert-pdf", changefreq: "monthly", priority: "0.7" },
          { path: "/edit-pdf", changefreq: "monthly", priority: "0.7" },
          { path: "/secure-pdf", changefreq: "monthly", priority: "0.7" },
          ...TOOLS.map((t) => ({
            path: `/${t.slug}`,
            changefreq: "monthly" as const,
            priority: "0.8",
          })),
          ...allUseCasePairs().map((p) => ({
            path: `/use-cases/${p.toolSlug}-for-${p.useCaseSlug}`,
            changefreq: "monthly" as const,
            priority: "0.5",
          })),
          ...allComparisonPairs().map((p) => ({
            path: `/vs/${p.toolSlug}-vs-${p.competitorSlug}`,
            changefreq: "monthly" as const,
            priority: "0.5",
          })),
          ...FORMAT_PAIRS.map((f) => ({
            path: `/convert/${f.slug}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
          ...SIZE_TARGETS.map((s) => ({
            path: `/compress-pdf-to-${s.slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          ...COMPRESS_USES.map((u) => ({
            path: `/compress-pdf-for-${u}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          ...ROOT_FORMAT_ALIASES.map((slug) => ({
            path: `/${slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
