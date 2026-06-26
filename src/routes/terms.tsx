import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — CrispPDF" },
      { name: "description", content: "The rules for using CrispPDF. Short, plain-English, no surprises." },
      { property: "og:title", content: "Terms of Service — CrispPDF" },
      { property: "og:description", content: "The rules for using CrispPDF." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Use of the service</h2>
            <p className="mt-2">
              CrispPDF is provided free of charge for personal and professional use. You agree not to upload content
              that is illegal, violates someone else's rights, or is intended to attack the service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">No warranty</h2>
            <p className="mt-2">
              The service is provided &ldquo;as is&rdquo; without warranties of any kind. Keep copies of important
              files. We make a best effort to preserve quality but can't guarantee perfect fidelity on every conversion.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Liability</h2>
            <p className="mt-2">
              To the maximum extent permitted by law, CrispPDF is not liable for any indirect, incidental, or
              consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Changes</h2>
            <p className="mt-2">
              We may update these terms occasionally. Material changes will be reflected by the &ldquo;Last
              updated&rdquo; date above.
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
