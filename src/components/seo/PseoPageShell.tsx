// Shared layout for pSEO pages (use-case, comparison, format). Keeps the
// presentation consistent so every page gets the same SEO scaffolding:
// breadcrumb, hero answer, internal links, FAQ, related tools.
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { ToolCard } from "@/components/ToolCard";
import type { Tool } from "@/lib/tools";

export interface PseoCrumb {
  name: string;
  to?: string;
}

export interface PseoFaq {
  q: string;
  a: string;
}

export function PseoPageShell({
  crumbs,
  badge,
  title,
  answer,
  intro,
  bullets,
  ctaTool,
  ctaLabel,
  faqs,
  related,
  children,
}: {
  crumbs: PseoCrumb[];
  badge: string;
  title: string;
  answer: string;
  intro: string;
  bullets: string[];
  ctaTool: Tool | null;
  ctaLabel: string;
  faqs: PseoFaq[];
  related: Tool[];
  children?: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute top-1/2 right-0 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-[140px]" />
      </div>
      <Header />
      <section className="mx-auto max-w-4xl px-6 py-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {c.to ? (
                <Link to={c.to as never} className="transition-colors hover:text-foreground">
                  {c.name}
                </Link>
              ) : (
                <span className="font-mono text-foreground">{c.name}</span>
              )}
              {i < crumbs.length - 1 && <span>/</span>}
            </span>
          ))}
        </nav>

        <div className="mt-6">
          <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
            {badge}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight md:text-5xl" data-speakable>
            {title}
          </h1>
        </div>

        <AnswerBlock title={title} answer={answer} />

        <p className="mt-8 text-base leading-relaxed text-muted-foreground">{intro}</p>

        {ctaTool && (
          <div className="mt-8">
            <Link
              to={("/" + ctaTool.slug) as never}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {bullets.length > 0 && (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 rounded-xl border border-border/60 bg-surface/40 p-4 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        {children}

        {faqs.length > 0 && (
          <div className="mt-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">// FAQ</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">Frequently asked</h2>
            <div className="mt-6 grid gap-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-border bg-surface/60 px-5 py-4 backdrop-blur-sm transition-colors hover:border-primary/60"
                >
                  <summary className="cursor-pointer list-none font-display text-sm font-medium leading-snug faq-q">
                    <span className="mr-2 text-primary">+</span>
                    {f.q}
                  </summary>
                  <p className="mt-3 pl-5 text-sm leading-relaxed text-muted-foreground faq-a">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-xl font-semibold">Related tools</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
