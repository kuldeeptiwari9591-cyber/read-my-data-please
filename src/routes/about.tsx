import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CrispPDF" },
      { name: "description", content: "Why CrispPDF exists, what it stands for, and how it stays free." },
      { property: "og:title", content: "About — CrispPDF" },
      { property: "og:description", content: "30 free PDF tools, privacy-first, no signup, no watermarks." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold md:text-5xl">About CrispPDF</h1>
        <div className="prose prose-invert mt-8 space-y-5 text-muted-foreground">
          <p>
            CrispPDF is a free, privacy-first toolkit for working with PDFs. We started it because every other PDF
            website is a frustrating combination of ads, signup walls, daily limits, and watermarks. Even simple
            things — merging two PDFs, shrinking a file for email — somehow take five steps and a credit card.
          </p>
          <p>
            CrispPDF runs almost entirely in your browser. Your files never leave your device for most tools.
            There's no account to create. There's no upsell. There's no &ldquo;pro&rdquo; tier that hides the
            features you actually need.
          </p>
          <p>
            We pay for the small server pieces (HTML-to-PDF rendering) out of pocket. If you find the app useful,
            tell a friend or link to it. That's the whole business model.
          </p>
        </div>
        <Link to="/" className="mt-12 inline-block text-sm text-primary hover:underline">
          ← Back to all tools
        </Link>
      </main>
      <Footer />
    </div>
  );
}
