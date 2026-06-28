import { createFileRoute, Link } from "@tanstack/react-router";
import { SeoAccordion } from "@/components/seo/SeoAccordion";
import { buildFaqJsonLd } from "@/lib/seo/faq-jsonld";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { hreflangLinks } from "@/lib/hreflang";
import { CheckCircle2, Shield, Zap, Sparkles, Users, Globe } from "lucide-react";

const CANONICAL = abs("/why-crisppdf");
const TITLE = "Why CrispPDF — Private, Free PDF Tools That Run in Your Browser";
const DESC =
  "CrispPDF processes PDFs in your browser — files never touch our servers. No signup, no watermarks, no ads. 40 free tools built for speed and privacy.";

const FAQS = [
  { q: "Is CrispPDF really free or is there a catch?", a: "There is no catch. CrispPDF's 40 tools are completely free with no daily limits, no signup, and no watermarks. We plan to add optional paid features for power users in the future, but the core toolkit will always be free." },
  { q: "Do you upload my files to a server?", a: "For 30 of our 40 tools, no — processing happens entirely in your browser. For 10 tools that require server processing (Office conversion, OCR), files are handled in memory only and discarded after processing. We never write files to disk or retain them." },
  { q: "How is CrispPDF different from iLovePDF?", a: "iLovePDF uploads all files to their servers; CrispPDF processes most files in your browser. iLovePDF has per-day limits on some tools; CrispPDF has no daily limits. Both are free for core tools." },
  { q: "How is CrispPDF different from Smallpdf?", a: "Smallpdf limits free users to 2 tasks per day and requires signup for most operations. CrispPDF has no daily limits and never requires signup." },
  { q: "How is CrispPDF different from Adobe Acrobat?", a: "Adobe Acrobat costs $19.99/month. CrispPDF is free. Adobe has deeper editing features; CrispPDF covers the 40 most-used operations that most users actually need." },
  { q: "Is CrispPDF safe for confidential documents?", a: "Yes. Most tools process files in your browser — the file never leaves your device. For the 10 server-processed tools, files are handled in-memory and discarded after output. No file contents, names, or metadata are logged." },
  { q: "Does CrispPDF work on mobile?", a: "Yes. All 40 tools are mobile-optimized and work on iOS Safari and Android Chrome without any app download." },
  { q: "Does CrispPDF work without internet?", a: "The browser-based tools (30 of 40) will work once the page has loaded, even if you lose your connection. The 10 server-based tools require an active connection." },
  { q: "Who built CrispPDF?", a: "CrispPDF is an independent product built by developers who believe PDF tools should be free, private, and accessible to everyone. We are not affiliated with Adobe, iLovePDF, or Smallpdf." },
  { q: "Is CrispPDF open source?", a: "The core PDF processing uses open-source libraries (pdf-lib, pdf.js, Tesseract.js). The CrispPDF application itself is not currently open source." },
  { q: "What browsers does CrispPDF support?", a: "Chrome, Firefox, Safari, and Edge — on desktop and mobile. Any browser released after 2019 works. No plugins required." },
  { q: "Does CrispPDF store any personal data?", a: "We store anonymized, hashed IP addresses only for rate limiting purposes. We do not store names, emails, file contents, filenames, or any identifying information." },
  { q: "Is CrispPDF GDPR compliant?", a: "Yes. We process minimal data, provide clear privacy information, do not use tracking cookies, and do not share data with third parties for advertising." },
  { q: "Does CrispPDF work in India?", a: "Yes, and we specifically optimized for Indian users. We support Aadhaar PDF unlocking, UPSC/SSC file size compression targets, passport photo conversion, and Hindi-language content." },
  { q: "Will CrispPDF always be free?", a: "The 40 core tools will always be free. We may add optional paid features (bulk API, priority processing) for users who need them. The free tier will never be degraded to force upgrades." },
];

const COMPARISON = [
  ["Price", "Free", "Free (limited)", "Free (2/day)", "$19.99/mo"],
  ["Signup required", "No", "No", "Yes (most ops)", "Yes"],
  ["Watermarks", "Never", "No", "Yes (free tier)", "No"],
  ["Daily limit", "None", "Some tools", "2 tasks/day", "None"],
  ["Files on server", "10 tools only", "Yes, all", "Yes, all", "Yes, all"],
  ["Privacy", "Browser-first", "Server", "Server", "Cloud"],
  ["Number of tools", "40", "25+", "20+", "30+ (paid)"],
  ["India-optimized", "Yes", "Partial", "No", "No"],
  ["Works offline", "Partial", "No", "No", "Yes (desktop)"],
];

export const Route = createFileRoute("/why-crisppdf")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "article" },
      { property: "og:image", content: OG_DEFAULT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: OG_DEFAULT },
    ],
    links: [{ rel: "canonical", href: CANONICAL }, ...hreflangLinks("/why-crisppdf")],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": CANONICAL,
              url: CANONICAL,
              name: TITLE,
              description: DESC,
              inLanguage: "en",
            },
            {
              "@type": "Article",
              headline: "Why CrispPDF — Private, Free PDF Tools That Run in Your Browser",
              author: { "@type": "Organization", name: "CrispPDF" },
              publisher: { "@type": "Organization", name: "CrispPDF", logo: { "@type": "ImageObject", url: abs("/og-default.svg") } },
              datePublished: "2025-01-01",
              dateModified: new Date().toISOString().slice(0, 10),
              mainEntityOfPage: CANONICAL,
              image: OG_DEFAULT,
            },
            { ...buildFaqJsonLd(FAQS), "@context": undefined },
            {
              "@type": "SpeakableSpecification",
              cssSelector: ["[data-speakable='true']"],
            },
          ],
        }),
      },
    ],
  }),
  component: WhyCrispPDF,
});

function WhyCrispPDF() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* HERO */}
        <section>
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl">Why CrispPDF?</h1>
          <p className="mt-4 text-xl text-muted-foreground" data-speakable="true">
            Because your PDF tools shouldn't know your business.
          </p>
          <div className="mt-6" data-speakable="true">
            <AnswerBlock
              title="What is CrispPDF?"
              answer="CrispPDF is a free online PDF toolkit that runs almost entirely inside your browser. When you compress, merge, or sign a PDF, the processing happens on your device — not on our servers. We never see your files, we never store them, and we never sell your data. All 40 tools. Always free. No signup."
            />
          </div>
        </section>

        {/* THE PROBLEM */}
        <section className="mt-16">
          <h2 className="font-display text-3xl font-bold tracking-tight">The problem with most free PDF tools</h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground" data-speakable="true">
            <p>Most free PDF tools are not actually free. They offer a few uses per day, add a watermark to your output, or require you to create an account before downloading your own file.</p>
            <p>Smallpdf limits free users to 2 tasks per day and requires signup for most operations. iLovePDF shows ads and throttles conversions. Adobe Acrobat costs $19.99/month for the same features CrispPDF provides at zero cost.</p>
            <p>More importantly, most PDF tools upload your files to their servers. Your tax documents, contracts, medical records, and Aadhaar PDFs travel over the internet to a company's server, get processed there, and are held in storage — sometimes indefinitely. These companies have privacy policies, but the fundamental risk is that your sensitive documents exist somewhere outside your control.</p>
            <p>CrispPDF takes a different approach. For 30 of the 40 tools (merge, split, rotate, compress, protect, unlock, sign, watermark, redact, crop, and more), processing happens entirely inside your browser using JavaScript. The file never leaves your device. There is nothing to breach.</p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-16">
          <h2 className="font-display text-3xl font-bold tracking-tight">How CrispPDF processes your files</h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground" data-speakable="true">
            <p>When you upload a PDF to CrispPDF, your browser reads the file locally — the same way you open a document in Preview or Adobe Reader. Our code (pdf-lib and pdf.js, both open-source libraries) then processes that file inside your browser's memory.</p>
            <p>For most tools, the processed output is generated and downloaded without any data ever being sent to the internet.</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { title: "Browser tools", color: "text-primary", items: ["Merge PDF", "Split PDF", "Compress PDF", "Rotate PDF", "eSign PDF", "Protect PDF", "Unlock PDF", "Redact PDF", "Crop PDF", "Watermark PDF", "+20 more"] },
              { title: "Server tools", color: "text-secondary", items: ["PDF to Word", "PDF to Excel", "PDF to PowerPoint", "OCR (large files)", "HTML to PDF"] },
              { title: "Never", color: "text-destructive", items: ["Store your files", "Sell your data", "Show ads", "Require signup", "Add watermarks"] },
            ].map((col) => (
              <div key={col.title} className="rounded-2xl border border-border bg-surface/40 p-5">
                <h3 className={`font-display text-sm font-semibold uppercase tracking-wider ${col.color}`}>{col.title}</h3>
                <ul className="mt-3 space-y-1.5 text-sm">{col.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            For the 10 tools that require server processing (Office format conversion, OCR on large files), files are sent to a secure server function, processed in memory, and the output is returned immediately. Files are never written to disk and are discarded after processing. You can verify this by checking your network tab in browser DevTools.
          </p>
        </section>

        {/* WHY FREE */}
        <section className="mt-16">
          <h2 className="font-display text-3xl font-bold tracking-tight">Why is CrispPDF free?</h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground" data-speakable="true">
            <p>CrispPDF is built on the belief that basic document tools should not cost money. Most of what people do with PDFs — merge, compress, sign, convert — is simple enough that it can run entirely in a browser. The cost of serving a JavaScript file to a million users is negligible.</p>
            <p>We are not a venture-backed startup with a growth target. CrispPDF is an independent product. It is free because it can be, and because we believe PDF tools that charge $20/month for operations that take milliseconds are exploiting a knowledge gap rather than providing value.</p>
            <p>We plan to introduce optional paid features for power users in the future (bulk processing, API access, priority support). The 40 core tools will remain free, forever.</p>
          </div>
        </section>

        {/* BUILT DIFFERENT */}
        <section className="mt-16">
          <h2 className="font-display text-3xl font-bold tracking-tight">What makes CrispPDF different</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { icon: Shield, title: "Privacy First", body: "Your files stay on your device for 30 of our 40 tools. For the 10 that use server processing, files are handled in-memory and discarded immediately. We do not log file contents, filenames, or user identity." },
              { icon: Zap, title: "No Signup, Ever", body: "Creating an account to use a PDF tool makes no sense. CrispPDF requires no email, no password, no OAuth. Open the tool. Use it. Download your file. Done." },
              { icon: Sparkles, title: "No Watermarks, Ever", body: "Watermarks on free-tier output are a coercion tactic. CrispPDF does not add any watermark, branding, or modification to your processed documents. What you put in is what you get out." },
              { icon: Users, title: "40 Tools, One Place", body: "iLovePDF has more tools. Adobe has deeper features. But CrispPDF covers the 40 operations that account for 95% of everyday PDF needs — free, fast, and without the friction of accounts, limits, or ads." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-surface/40 p-6">
                <c.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHO USES */}
        <section className="mt-16">
          <h2 className="font-display text-3xl font-bold tracking-tight">Who uses CrispPDF</h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground" data-speakable="true">
            <p><strong className="text-foreground">Students:</strong> Merging assignment PDFs, compressing files for college portal uploads (which often have 200KB or 1MB limits), converting notes to PDF for sharing. In India, government exam portals (UPSC, SSC, IBPS) have strict file size requirements — CrispPDF's compression size-targeting feature was built specifically for this use case.</p>
            <p><strong className="text-foreground">Professionals:</strong> Signing contracts without Adobe Acrobat, redacting sensitive information before sharing documents, converting Word files to PDF for client delivery.</p>
            <p><strong className="text-foreground">Small businesses:</strong> Invoicing (Excel to PDF), document archiving (PDF/A conversion), protecting sensitive documents with passwords, OCR-ing scanned receipts.</p>
            <p><strong className="text-foreground">Developers:</strong> HTML to PDF conversion for receipt generation, PDF metadata editing, extract-text for document processing pipelines.</p>
            <p>
              <strong className="text-foreground">Everyone:</strong> Removing that Aadhaar PDF password you always forget (it's your date of birth, DDMMYYYY). We built a dedicated page for it — see{" "}
              <Link
                to={"/unlock-pdf" as never}
                className="text-primary underline-offset-2 hover:underline"
              >
                Unlock PDF
              </Link>
              .
            </p>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="mt-16">
          <h2 className="font-display text-3xl font-bold tracking-tight">CrispPDF vs the alternatives</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface/40" data-speakable="true">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-surface/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Feature</th>
                  <th className="px-4 py-3 text-left text-primary">CrispPDF</th>
                  <th className="px-4 py-3 text-left">iLovePDF</th>
                  <th className="px-4 py-3 text-left">Smallpdf</th>
                  <th className="px-4 py-3 text-left">Adobe Acrobat</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row[0]} className="border-t border-border">
                    {row.map((cell, i) => (
                      <td key={i} className={`px-4 py-3 ${i === 1 ? "font-medium text-primary" : i === 0 ? "font-medium" : "text-muted-foreground"}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="font-display text-3xl font-bold tracking-tight">Questions about CrispPDF</h2>
          <SeoAccordion items={FAQS} className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface/40" />
        </section>

        {/* CTA */}
        <section className="mt-16 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-surface/40 to-secondary/10 p-10 text-center">
          <Globe className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight">Ready to use CrispPDF?</h2>
          <Link to="/" hash="tools" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
            <CheckCircle2 className="h-4 w-4" /> Browse All 40 Tools →
          </Link>
          <p className="mt-6 text-sm text-muted-foreground">Or go straight to:</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm">
            {[
              { slug: "compress-pdf", label: "Compress PDF" },
              { slug: "merge-pdf", label: "Merge PDF" },
              { slug: "pdf-to-word", label: "PDF to Word" },
              { slug: "esign-pdf", label: "eSign PDF" },
            ].map((t) => (
              <Link key={t.slug} to={("/" + t.slug) as never} className="rounded-lg border border-border bg-surface/60 px-4 py-2 hover:border-primary/60">{t.label}</Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
