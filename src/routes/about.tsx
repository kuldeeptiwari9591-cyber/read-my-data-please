import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Laptop, Server, Trash2, Mail } from "lucide-react";
import { abs, OG_DEFAULT } from "@/lib/site-url";

export const Route = createFileRoute("/about")({
  head: () => {
    const canonical = abs("/about");
    return {
      meta: [
        { title: "About — CrispPDF" },
        { name: "description", content: "Why CrispPDF exists, what it stands for, and how it stays free." },
        { property: "og:title", content: "About — CrispPDF" },
        { property: "og:description", content: "40 free PDF tools, privacy-first, no signup, no watermarks." },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        { property: "og:image", content: OG_DEFAULT },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_DEFAULT },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: About,
});

const STEPS = [
  {
    icon: Laptop,
    title: "Browser-based processing",
    body: "Most tools run entirely on your device. Your files never leave your browser.",
  },
  {
    icon: Server,
    title: "Server tools for complex ops",
    body: "A few tools (OCR, Office conversion) use a secure server function. Files are processed in memory and immediately discarded.",
  },
  {
    icon: Trash2,
    title: "Auto-deleted after processing",
    body: "Anything that touches a server is gone within seconds. No backups, no logs, no exceptions.",
  },
];

const STATS = [
  { n: "40", label: "tools" },
  { n: "0", label: "accounts required" },
  { n: "0", label: "watermarks" },
  { n: "0", label: "ads" },
];

function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-20">
        {/* Hero */}
        <section className="text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Built for people who just need to get things done.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            CrispPDF is a free, privacy-first PDF toolkit. No ads. No accounts. No nonsense.
          </p>
        </section>

        {/* Mission */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">Our mission</h2>
          <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              PDF tools shouldn't cost money or require an account. We built CrispPDF because every
              existing solution is either slow, ad-stuffed, or hides basic features behind a paywall.
              You shouldn't need to create an account to merge two PDFs.
            </p>
            <p>
              CrispPDF runs primarily in your browser. Your files stay on your device. We don't see
              them, we don't store them, we don't log them. Privacy isn't a feature — it's the default.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">How it works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="rounded-xl border border-border bg-surface/40 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 ring-1 ring-primary/30">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">By the numbers</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-surface/40 p-5 text-center">
                <div className="font-display text-4xl font-bold text-gradient">{s.n}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mt-16 rounded-2xl border border-border bg-surface/40 p-7 md:p-10">
          <h2 className="font-display text-2xl font-semibold">Have a question or suggestion?</h2>
          <p className="mt-3 text-muted-foreground">
            Email us at{" "}
            <a href="mailto:hello@crisppdf.com" className="inline-flex items-center gap-1 text-primary hover:underline">
              <Mail className="h-4 w-4" /> hello@crisppdf.com
            </a>
          </p>
          <Link to="/contact" className="mt-4 inline-block text-sm text-primary hover:underline">
            Contact us →
          </Link>
        </section>

        <Link to="/" className="mt-12 inline-block text-sm text-primary hover:underline">
          ← Back to all tools
        </Link>
      </main>
      <Footer />
    </div>
  );
}
