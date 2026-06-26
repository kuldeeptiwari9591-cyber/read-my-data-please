import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { abs, OG_DEFAULT } from "@/lib/site-url";

export const Route = createFileRoute("/privacy")({
  head: () => {
    const canonical = abs("/privacy");
    return {
      meta: [
        { title: "Privacy Policy — CrispPDF" },
        { name: "description", content: "How CrispPDF handles your files and personal data. Short version: we don't store them." },
        { property: "og:title", content: "Privacy Policy — CrispPDF" },
        { property: "og:description", content: "Privacy-first PDF tools. Your files stay yours." },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        { property: "og:image", content: OG_DEFAULT },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_DEFAULT },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">The short version</h2>
            <p className="mt-2">
              This page is maintained by the CrispPDF team to answer common privacy questions about the app.
              Most tools run entirely in your browser. We don't store your files. We don't require accounts.
              We don't sell data. We don't run third-party ad trackers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">File handling</h2>
            <p className="mt-2">
              Browser-side tools (the majority — Merge, Split, Rotate, Compress, Watermark, etc.) process your file
              entirely on your device using WebAssembly and JavaScript. The file never leaves your computer.
            </p>
            <p className="mt-2">
              A small number of tools (currently HTML to PDF) use a server function to render output. In those
              cases the input is processed in memory and discarded immediately after the response — we don't write
              files to disk and we don't keep logs of file contents.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Cookies & analytics</h2>
            <p className="mt-2">
              We use a minimal first-party preference for your theme choice. We do not run third-party analytics
              that profile you.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Contact</h2>
            <p className="mt-2">
              Privacy questions: <a href="mailto:privacy@crisppdf.app" className="text-primary hover:underline">privacy@crisppdf.app</a>.
            </p>
          </section>
        </div>

        <Link to="/" className="mt-12 inline-block text-sm text-primary hover:underline">
          ← Back to all tools
        </Link>
      </main>
      <Footer />
    </div>
  );
}
