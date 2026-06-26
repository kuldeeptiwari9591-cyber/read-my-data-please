import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { hreflangLinks } from "@/lib/hreflang";

interface Release {
  version: string;
  date: string;
  highlights: string[];
}

const RELEASES: Release[] = [
  {
    version: "1.3.0",
    date: "2026-06-26",
    highlights: [
      "Shipped full 40-tool toolkit including 10 new utilities (Invert, Resize, N-up, Booklet, Blank Page, Duplicate, Extract Text, Metadata Editor, Compare, Base64).",
      "Launched blog system with seed posts on PDF workflows and privacy.",
      "Added multilingual support (English, Hindi, Spanish, Portuguese) with hreflang tags.",
      "Migrated every tool to dedicated flat URLs (/merge-pdf, /split-pdf, etc.) with 301 redirects from legacy /tools paths.",
      "Locked the entire site to a single dark theme for a focused, consistent experience.",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-05-14",
    highlights: [
      "Added OCR (image-to-searchable PDF) powered by Tesseract.js.",
      "Introduced eSign PDF with a built-in signature pad.",
      "Released Redact PDF with interactive masking on the page canvas.",
      "Wired admin operation logging and rate-limit banner for client tools.",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-04-02",
    highlights: [
      "Added Compress PDF, Watermark PDF (text + image), and Add Page Numbers.",
      "Introduced JPG ↔ PDF, PNG export, and Grayscale conversion.",
      "Improved Hero rendering with environment lighting and sparkle particles.",
      "Smarter search with synonyms and relevance scoring across the toolkit.",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-02-18",
    highlights: [
      "Initial launch with the core 15 tools: Merge, Split, Rotate, Reorder, Delete Pages, Extract Pages, Crop, Repair, Flatten, Unlock, Protect, PDF→JPG/PNG, JPG→PDF, and PDF/A.",
      "Glassmorphism design system with Space Grotesk + Inter + JetBrains Mono.",
      "All processing happens in your browser — files never leave your device.",
    ],
  },
];

export const Route = createFileRoute("/changelog")({
  head: () => {
    const path = "/changelog";
    const title = "Changelog — CrispPDF";
    const description = "Every release and update to CrispPDF — new tools, fixes, and improvements.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: abs(path) },
        { property: "og:image", content: OG_DEFAULT },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: abs(path) }, ...hreflangLinks(path)],
    };
  },
  component: ChangelogPage,
});

function ChangelogPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">// release notes</p>
        <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">CrispPDF Changelog</h1>
        <p className="mt-4 text-muted-foreground">
          What we ship, when we ship it. No marketing fluff.
        </p>

        <ol className="mt-12 space-y-10">
          {RELEASES.map((r) => (
            <li key={r.version} className="relative rounded-2xl border border-border bg-surface/40 p-7 backdrop-blur-xl">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                    v{r.version}
                  </span>
                  <time className="font-mono text-xs text-muted-foreground">{r.date}</time>
                </div>
              </div>
              <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                {r.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
      <Footer />
    </div>
  );
}
