import { Link } from "@tanstack/react-router";
import { MessageSquare, Bug, Wrench, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

const CARDS = [
  {
    icon: MessageSquare,
    title: "Share feedback",
    body: "Rate a tool, tell us what's working, or call out friction we should fix.",
    cta: "Send feedback",
  },
  {
    icon: Bug,
    title: "Report a bug",
    body: "Found a tool that misbehaves? Tell us exactly what happened — we triage fast.",
    cta: "Report bug",
  },
  {
    icon: Wrench,
    title: "Request a tool",
    body: "Missing a PDF tool you'd actually use? Pitch it. We ship the most-requested ones.",
    cta: "Request tool",
  },
];

export function FeedbackCTA() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          // Built with users
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Help shape the next PDF tool.
        </h2>
        <p className="mt-4 text-muted-foreground">
          CrispPDF grows from what real users tell us. Feedback, bug reports, and tool requests
          all go to the same inbox — and we read every one.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              to="/feedback"
              className="group block focus:outline-none"
              aria-label={c.cta}
            >
              <GlassCard
                glow
                className="h-full p-6 transition-transform group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 ring-1 ring-primary/30">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  {c.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </GlassCard>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/feedback"
          className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.03]"
        >
          Open feedback form
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
