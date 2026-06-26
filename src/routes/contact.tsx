import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, MessageSquare, Bug } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CrispPDF" },
      { name: "description", content: "Get in touch with the CrispPDF team — feedback, bug reports, and feature requests." },
      { property: "og:title", content: "Contact — CrispPDF" },
      { property: "og:description", content: "Send feedback, report a bug, or request a feature." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const ITEMS = [
  { icon: Mail, title: "General contact", body: "Reach us at hello@crisppdf.app for anything that doesn't fit below." },
  { icon: Bug, title: "Report a bug", body: "Found something broken? Email bugs@crisppdf.app with the tool name and what happened." },
  { icon: MessageSquare, title: "Feature requests", body: "Want a tool we don't have yet? Tell us at ideas@crisppdf.app and we'll prioritize it." },
];

function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Contact us</h1>
        <p className="mt-4 text-muted-foreground">
          We read every message. Pick the channel that fits.
        </p>
        <div className="mt-10 space-y-4">
          {ITEMS.map((i) => {
            const Icon = i.icon;
            return (
              <div key={i.title} className="flex gap-4 rounded-xl border border-border bg-surface/40 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 ring-1 ring-primary/30">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold">{i.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{i.body}</p>
                </div>
              </div>
            );
          })}
        </div>
        <Link to="/" className="mt-12 inline-block text-sm text-primary hover:underline">
          ← Back to all tools
        </Link>
      </main>
      <Footer />
    </div>
  );
}
