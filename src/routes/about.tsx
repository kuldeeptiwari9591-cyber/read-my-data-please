import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeoAccordion } from "@/components/seo/SeoAccordion";
import { buildFaqJsonLd } from "@/lib/seo/faq-jsonld";
import {
  Laptop,
  Server,
  Trash2,
  Mail,
  Upload,
  Cpu,
  Download,
  ShieldCheck,
  Zap,
  Globe2,
} from "lucide-react";
import { abs, OG_DEFAULT } from "@/lib/site-url";

export const Route = createFileRoute("/about")({
  head: () => {
    const canonical = abs("/about");
    const title = "About CrispPDF — How It Works & Why It's Free";
    const description =
      "How CrispPDF processes PDFs in your browser, why it's 100% free, and what makes it different. 40 privacy-first PDF tools — no signup, no watermarks, no ads.";
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
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: OG_DEFAULT },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(buildFaqJsonLd(ABOUT_FAQS)),
        },
      ],
    };
  },
  component: About,
});

const PIPELINE = [
  {
    icon: Upload,
    title: "1. You pick a file",
    body: "Drag a PDF into the upload zone or tap to browse. Your browser reads the file from your device — nothing is uploaded yet. The file picker also accepts paste-from-clipboard and folder drops for batch operations.",
  },
  {
    icon: Cpu,
    title: "2. Your browser does the work",
    body: "For 30 of CrispPDF's 40 tools, the entire operation runs in your browser using WebAssembly libraries like pdf-lib, pdf.js, and Tesseract.js. Your CPU merges, splits, compresses, or signs — your file never crosses the network.",
  },
  {
    icon: Download,
    title: "3. You download the result",
    body: "The processed PDF is generated as a Blob inside your browser and offered as a direct download. There is no server-side storage to clean up, no email link, no expiring URL. Close the tab and every trace is gone.",
  },
];

const SERVER_PIPELINE = [
  {
    icon: ShieldCheck,
    title: "Encrypted in transit",
    body: "For the 10 tools that need server power (OCR on large scans, Office conversion, HTML to PDF), your file travels over HTTPS to an isolated edge function in the nearest region — typically under 100 ms away.",
  },
  {
    icon: Server,
    title: "Processed in memory",
    body: "The edge function reads your file into RAM, runs the conversion or OCR, and writes the result to the HTTP response. No disk write, no database insert, no S3 bucket. The whole lifecycle is a single request-response.",
  },
  {
    icon: Trash2,
    title: "Discarded immediately",
    body: "When the response finishes streaming, the memory buffer is garbage-collected. There are no backups, no logs of file contents, and no admin dashboard where anyone could view what you processed.",
  },
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Privacy by architecture",
    body: "We can't see your files because the code that would let us see them doesn't exist. This isn't a policy — it's the system design.",
  },
  {
    icon: Zap,
    title: "Speed by physics",
    body: "Local processing is faster than a round trip to any server. A 50-page merge that takes 8 seconds on a competitor finishes in under 1 second here.",
  },
  {
    icon: Globe2,
    title: "Free by default",
    body: "Free tools, no signup, no watermarks, no daily limits, no ads. We do not believe basic PDF operations should ever cost money.",
  },
];

const STATS = [
  { n: "40", label: "tools" },
  { n: "0", label: "accounts required" },
  { n: "0", label: "watermarks" },
  { n: "0", label: "ads" },
];

const ABOUT_FAQS = [
  {
    q: "Who built CrispPDF and why?",
    a: "CrispPDF is built by a small independent team frustrated with bloated, ad-stuffed, paywalled PDF tools. We wanted a single place where any PDF operation is one click away, runs in seconds, costs nothing, and doesn't demand a signup. So we built it.",
  },
  {
    q: "Is CrispPDF really free, or is there a paywall I'll hit?",
    a: "All 40 tools are free with no daily limits, no file count caps, no premium tier, and no feature locked behind payment. There is no Pro plan. The only rate-limiting is a soft throttle to prevent automated abuse — normal use will never trigger it.",
  },
  {
    q: "How does CrispPDF make money if everything is free?",
    a: "It doesn't, yet. CrispPDF is currently funded out of pocket by the founders. Future revenue may come from an optional API for developers and a self-hosted version for businesses with compliance requirements. The free consumer tools will always stay free.",
  },
  {
    q: "Why is processing in my browser safer than on a server?",
    a: "Because your file physically never leaves your device. A server-based tool, even with the best policies, requires you to trust the operator's logs, backups, employees, and legal jurisdiction. Browser-based tools eliminate all of that by design — there is nothing on our side to leak, subpoena, or breach.",
  },
  {
    q: "Why are some tools still server-based then?",
    a: "OCR on large scanned documents, Office (DOCX/XLSX/PPTX) conversion, and HTML-to-PDF rendering require either heavy WebAssembly that would crash low-end devices or native libraries (LibreOffice, Chromium) that cannot run in a browser. We use a stateless edge function only when in-browser processing is impossible or impractical.",
  },
  {
    q: "What happens to my file after I close the tab?",
    a: "Nothing — there is nothing to clean up. Browser tools held your file in tab memory, which the browser releases on close. Server tools processed your file in RAM during a single HTTP request and released that memory the moment the response finished, long before you closed the tab.",
  },
  {
    q: "Is CrispPDF open source?",
    a: "Parts of the stack are: we contribute back to pdf-lib, pdf.js, and Tesseract.js where we find bugs. The CrispPDF application code is not currently open source, but we publish a clear privacy policy, a security disclosure process, and our infrastructure layout so you can verify the privacy claims.",
  },
  {
    q: "How is CrispPDF different from Smallpdf or iLovePDF?",
    a: "Three differences: (1) every tool is free with no daily limits — they paywall most features. (2) 30 of 40 tools run entirely in your browser — their tools upload everything to their servers. (3) No accounts, no watermarks, no upsells. The trade-off: we don't have a desktop app or team collaboration features.",
  },
  {
    q: "Does CrispPDF work without an internet connection?",
    a: "Partially. Once a tool page has loaded, the browser-based tools continue to work even if you lose connectivity, because the processing code is already in your tab. Server-based tools (OCR, Office conversion) need an active connection. We're exploring a PWA version with full offline mode.",
  },
  {
    q: "Where is CrispPDF hosted?",
    a: "Static pages are served from a global CDN with edge locations in 200+ cities. The server-only tools run on edge functions in the region closest to you. There is no central database of user files because user files never reach our infrastructure for the 30 browser tools.",
  },
  {
    q: "Can I use CrispPDF for commercial work?",
    a: "Yes. CrispPDF tools are free to use for personal, educational, and commercial purposes. There are no restrictions on the output files. Some advanced features (bulk API, white-label) are planned as paid tiers, but every existing consumer tool remains free for any use.",
  },
  {
    q: "How can I trust your privacy claims?",
    a: "Open your browser's DevTools network tab while using any browser-based tool — you'll see no upload requests at all. For server tools, the request is single-shot with no follow-up calls. Our privacy policy is plain English, our infrastructure choices are documented, and the architecture itself makes data retention impossible for most operations.",
  },
];

function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        {/* Hero */}
        <section className="text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            About CrispPDF
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            A privacy-first PDF toolkit built for people who just need to get
            things done. 40 free tools. No accounts. No watermarks. No ads.
          </p>
        </section>

        {/* Mission */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">Our mission</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              PDF tools shouldn't cost money or require an account. Every
              existing solution is either slow, ad-stuffed, or hides basic
              features behind a paywall. You shouldn't need to create an
              account to merge two PDFs or compress one for an email
              attachment.
            </p>
            <p>
              CrispPDF runs primarily in your browser. Your files stay on your
              device. We don't see them, we don't store them, we don't log
              them. Privacy isn't a feature we charge for — it's the default
              behaviour of the system.
            </p>
          </div>
        </section>

        {/* How it works — in detail */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">
            How it works — in detail
          </h2>
          <p className="mt-3 text-muted-foreground">
            CrispPDF has two processing paths. Most tools run entirely in your
            browser. A few unavoidable cases use a stateless edge function.
            Here's exactly what happens at each step.
          </p>

          <h3 className="mt-8 font-display text-lg font-semibold text-foreground">
            Path A — Browser-only (30 of 40 tools)
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {PIPELINE.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="rounded-xl border border-border bg-surface/40 p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 ring-1 ring-primary/30">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="mt-4 font-display text-base font-semibold">
                    {s.title}
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              );
            })}
          </div>

          <h3 className="mt-10 font-display text-lg font-semibold text-foreground">
            Path B — Server-assisted (10 of 40 tools)
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {SERVER_PIPELINE.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="rounded-xl border border-border bg-surface/40 p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 ring-1 ring-secondary/30">
                    <Icon className="h-5 w-5 text-secondary" />
                  </div>
                  <h4 className="mt-4 font-display text-base font-semibold">
                    {s.title}
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              The technical stack, briefly:
            </p>
            <p className="mt-2">
              Browser tools use{" "}
              <span className="font-mono text-foreground">pdf-lib</span> for
              structure edits,{" "}
              <span className="font-mono text-foreground">pdf.js</span> for
              rendering and text extraction,{" "}
              <span className="font-mono text-foreground">Tesseract.js</span>{" "}
              for in-browser OCR, and Web Workers to keep the UI responsive on
              large files. Server tools run on Cloudflare Workers and Edge
              Functions written in TypeScript with zero state between
              requests.
            </p>
          </div>
        </section>

        {/* Principles */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">
            What we stand for
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PRINCIPLES.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-xl border border-border bg-surface/40 p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 ring-1 ring-primary/30">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">
            By the numbers
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-surface/40 p-5 text-center"
              >
                <div className="font-display text-4xl font-bold text-gradient">
                  {s.n}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs about CrispPDF itself */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">
            About CrispPDF — frequently asked
          </h2>
          <p className="mt-3 text-muted-foreground">
            Common questions about who we are, how we operate, and what makes
            CrispPDF different.
          </p>
          <SeoAccordion
            items={ABOUT_FAQS}
            className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface/40"
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Looking for tool-specific answers?{" "}
            <Link to="/faq" className="text-primary hover:underline">
              Browse the full FAQ →
            </Link>
          </p>
        </section>

        {/* Contact */}
        <section className="mt-16 rounded-2xl border border-border bg-surface/40 p-7 md:p-10">
          <h2 className="font-display text-2xl font-semibold">
            Have a question or suggestion?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Email us at{" "}
            <a
              href="mailto:hello@crisppdf.com"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <Mail className="h-4 w-4" /> hello@crisppdf.com
            </a>
          </p>
          <Link
            to="/contact"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            Contact us →
          </Link>
        </section>

        <Link
          to="/"
          className="mt-12 inline-block text-sm text-primary hover:underline"
        >
          ← Back to all tools
        </Link>
      </main>
      <Footer />
    </div>
  );
}
