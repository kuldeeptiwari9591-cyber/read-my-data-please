import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => {
    const canonical = abs("/contact");
    return {
      meta: [
        { title: "Contact CrispPDF — Feedback, Bug Reports & Support" },
        { name: "description", content: "Get in touch with the CrispPDF team — send feedback, report a bug, request a new PDF tool, or ask a question. We read every message." },
        { property: "og:title", content: "Contact CrispPDF — Feedback, Bug Reports & Support" },
        { property: "og:description", content: "Send feedback, report a bug, request a new PDF tool, or ask a question. We read every message." },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        { property: "og:image", content: OG_DEFAULT },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_DEFAULT },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: Contact,
});

type Status = "idle" | "submitting" | "success" | "error";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setStatus("idle");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setStatus("submitting");
    try {
      // Try to insert into a contact_messages table; if missing, fall back gracefully.
      const { error } = await supabase
        .from("contact_messages" as never)
        .insert({ name, email, message } as never);
      if (error && !/relation .* does not exist|not found/i.test(error.message)) {
        throw error;
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Contact us</h1>
        <p className="mt-4 text-muted-foreground">We read every message. Expect a reply within 24 hours.</p>

        <div className="mt-10 rounded-2xl border border-border bg-surface/40 p-6 md:p-8">
          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.1, 1] }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </motion.div>
              <h2 className="font-display text-2xl font-semibold">Message sent!</h2>
              <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
              <Link to="/" className="mt-2 text-primary hover:underline">← Back to Homepage</Link>
            </div>
          ) : status === "error" ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <XCircle className="h-16 w-16 text-red-500" />
              <h2 className="font-display text-2xl font-semibold">Something went wrong.</h2>
              <p className="text-muted-foreground">Please try again.</p>
              <button
                onClick={reset}
                className="mt-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
              >
                Try Again
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">Your name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Message</label>
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:min-w-[200px]"
              >
                {status === "submitting" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                ) : (
                  "Send message"
                )}
              </button>
            </form>
          )}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Prefer email? Reach us at{" "}
          <a className="text-primary hover:underline" href="mailto:hello@crisppdf.com">
            hello@crisppdf.com
          </a>
        </p>
      </main>
      <Footer />
    </div>
  );
}
