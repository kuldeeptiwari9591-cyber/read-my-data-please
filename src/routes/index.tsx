import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Globe2,
  FileLock2,
  Infinity as InfinityIcon,
} from "lucide-react";
import { HeroScene } from "@/components/HeroScene";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/SearchBar";
import { ParticlesBackground } from "@/components/visuals/ParticlesBackground";
import { GradientBlob } from "@/components/visuals/GradientBlob";
import {
  CATEGORY_META,
  PHASE_META,
  TOOLS,
  scoreTool,
  toolMatches,
  toolsByCategory,
  type ToolCategory,
  type ToolPhase,
} from "@/lib/tools";
import { abs, OG_DEFAULT } from "@/lib/site-url";

const PHASE_ORDER: ToolPhase[] = ["next", "interactive", "server"];

export const Route = createFileRoute("/")({
  head: () => {
    const canonical = abs("/");
    return {
      meta: [
        { title: "CrispPDF — 40 Free Online PDF Tools · No signup, no watermarks" },
        {
          name: "description",
          content:
            "Merge, split, compress, convert, sign, and protect PDFs. 40 free tools. No signup. No watermarks. Privacy-first.",
        },
        { property: "og:title", content: "CrispPDF — 40 Free Online PDF Tools" },
        {
          property: "og:description",
          content: "Every PDF tool you need. Free, crisp, and fast. No signup, no watermarks.",
        },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        { property: "og:image", content: OG_DEFAULT },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_DEFAULT },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: Index,
});

const CATEGORY_ORDER: ToolCategory[] = [
  "organize",
  "convert-to",
  "convert-from",
  "edit",
  "secure",
];

const STATS: Array<{ label: string; target?: number; suffix?: string; static?: string }> = [
  { label: "Free tools", target: 40, suffix: "+" },
  { label: "Signups required", target: 0 },
  { label: "Watermarks added", target: 0 },
  { label: "Daily uses", static: "∞" },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Privacy-first",
    body: "Your files are processed for you and never stored. No accounts, no logs of your documents.",
  },
  {
    icon: Zap,
    title: "Instant results",
    body: "No queues, no waiting rooms. Drop a file, get the result in seconds.",
  },
  {
    icon: InfinityIcon,
    title: "Truly free",
    body: "No daily limits, no surprise paywalls, no 'pro upgrade' nag screens.",
  },
  {
    icon: FileLock2,
    title: "No watermarks",
    body: "Your output is clean. Sign it, share it, print it. We never stamp our logo on your work.",
  },
  {
    icon: Globe2,
    title: "Works everywhere",
    body: "Any modern browser on any device. Mac, Windows, Linux, iOS, Android.",
  },
  {
    icon: Sparkles,
    title: "Crisp output",
    body: "Compression keeps text sharp. Conversions preserve layout. No quality compromises.",
  },
];

function Index() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<ToolCategory | "all">("all");

  const filtered = useMemo(() => {
    const list = TOOLS.filter((t) => toolMatches(t, query));
    const byCat = activeCat === "all" ? list : list.filter((t) => t.category === activeCat);
    if (!query) return byCat;
    return [...byCat].sort((a, b) => scoreTool(b, query) - scoreTool(a, query));
  }, [query, activeCat]);
  const isSearching = query.trim().length > 0 || activeCat !== "all";
  

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-secondary/15 blur-[140px]" />
      </div>

      <Header />

      {/* HERO */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <HeroScene />
        <ParticlesBackground className="opacity-70" />
        <GradientBlob className="-top-24 -left-24" size={520} />
        <GradientBlob
          className="top-1/3 -right-32"
          size={620}
          from="rgba(139,92,246,0.4)"
          to="rgba(6,182,212,0.25)"
          duration={18}
        />
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            40 free tools · no signup · no watermarks
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
          >
            Every PDF tool
            <br />
            <span className="text-gradient">you'll ever need.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg"
          >
            Merge, split, compress, convert, sign, and protect PDFs in seconds. Free forever. Crisp
            output. Privacy by default.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 w-full max-w-xl"
          >
            <SearchBar value={query} onChange={setQuery} placeholder="Search 40 tools — try 'merge' or 'compress'" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#tools"
              className="group inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.03]"
            >
              View all 40 tools
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-6 py-3 text-sm font-medium backdrop-blur-md transition-colors hover:border-primary"
            >
              How it works
            </a>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-20 grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4"
          >
            {STATS.map((s) => (
              <GlassCard key={s.label} className="px-4 py-5 text-center">
                <div className="font-display text-3xl font-bold text-gradient">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ALL TOOLS GRID */}
      <section id="tools" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            // The full toolkit
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            40 tools. One crisp app.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Five categories, every PDF workflow covered.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <SearchBar value={query} onChange={setQuery} />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveCat("all")}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                activeCat === "all"
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border bg-surface/60 text-muted-foreground hover:border-primary/60"
              }`}
            >
              All · {TOOLS.length}
            </button>
            {CATEGORY_ORDER.map((c) => {
              const n = toolsByCategory(c).length;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    activeCat === c
                      ? "border-primary bg-primary/15 text-foreground"
                      : "border-border bg-surface/60 text-muted-foreground hover:border-primary/60"
                  }`}
                >
                  {CATEGORY_META[c].label} · {n}
                </button>
              );
            })}
          </div>
        </div>

        {isSearching ? (
          <div className="mt-12">
            <p className="mb-6 text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
              {query && (
                <>
                  {" "}for <span className="font-mono text-foreground">"{query}"</span>
                </>
              )}
              {activeCat !== "all" && (
                <>
                  {" "}in <span className="text-foreground">{CATEGORY_META[activeCat].label}</span>
                </>
              )}
            </p>
            {filtered.length === 0 ? (
              <GlassCard className="p-10 text-center">
                <p className="font-display text-lg font-semibold">No tools matched</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a different keyword like "convert", "sign", or "compress".
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setActiveCat("all");
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-primary"
                >
                  Reset filters
                </button>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {filtered.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-16 space-y-20">
            {CATEGORY_ORDER.map((cat) => {
              const tools = toolsByCategory(cat);
              const meta = CATEGORY_META[cat];
              return (
                <div key={cat}>
                  <div className="mb-8 flex items-end justify-between gap-4 border-b border-border/60 pb-4">
                    <div>
                      <h3 className="font-display text-2xl font-semibold">{meta.label}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{meta.blurb}</p>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {tools.length} {tools.length === 1 ? "tool" : "tools"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {tools.map((t) => (
                      <ToolCard key={t.slug} tool={t} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ALL-LIVE BANNER */}
      <section id="roadmap" className="relative mx-auto max-w-5xl px-6 py-24">
        <GlassCard glow className="p-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            // Status
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            All <span className="text-gradient">40 tools</span> are live.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Every tool runs end-to-end today — no waitlists, no "coming soon" stubs. Most run
            fully in your browser; a few use a privacy-respecting server function.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-left sm:gap-6">
            {PHASE_ORDER.map((phase, idx) => {
              const meta = PHASE_META[phase];
              return (
                <div
                  key={phase}
                  className="rounded-xl border border-border/60 bg-surface/40 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-primary">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-sm font-semibold">{meta.label}</h3>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{meta.blurb}</p>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </section>


      {/* HOW IT WORKS */}
      <section id="how" className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            // How it works
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Three steps. Zero friction.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", title: "Pick a tool", body: "Choose from 40 PDF tools, organized by what you need to do." },
            { n: "02", title: "Drop your file", body: "Drag and drop. Everything runs the moment your file is ready." },
            { n: "03", title: "Download crisp output", body: "Get your result in seconds. No watermarks, no email gates, no upsells." },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard className="h-full p-6">
                <div className="font-mono text-xs text-primary">{s.n}</div>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            // Why CrispPDF
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Built different.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Most PDF sites are slow, ad-stuffed, and watermark your files. We don't.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <GlassCard glow className="h-full p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 ring-1 ring-primary/30">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">// FAQ</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Quick answers.
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {[
            {
              q: "Is CrispPDF really free?",
              a: "Yes — all 40 tools, no daily limits, no signup, no watermarks. Forever.",
            },
            {
              q: "Are my files private?",
              a: "Your files aren't stored. They're processed only to produce your output and then dropped immediately.",
            },
            {
              q: "Why no signup?",
              a: "You shouldn't need an account to merge two PDFs. Friction-free is the whole point.",
            },
            {
              q: "Is there a file size limit?",
              a: "Most tools handle PDFs up to ~100 MB comfortably. Very large files may take a few extra seconds.",
            },
            {
              q: "Do you have an API?",
              a: "Not yet. We're focused on the web app first. Tell us what you'd want and we'll prioritize.",
            },
          ].map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-border bg-surface/60 px-5 py-4 backdrop-blur-sm transition-colors hover:border-primary/60"
            >
              <summary className="cursor-pointer list-none font-display text-base font-medium">
                <span className="mr-3 text-primary">+</span>
                {f.q}
              </summary>
              <p className="mt-3 pl-6 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative mx-auto max-w-5xl px-6 py-24">
        <GlassCard glow className="overflow-hidden p-12 text-center">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Ready when you are.
          </h2>
          <p className="mt-4 text-muted-foreground">
            {TOOLS.length} tools, zero setup. Pick one and go.
          </p>
          <a
            href="#tools"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.03]"
          >
            Browse all tools
            <ArrowRight className="h-4 w-4" />
          </a>
        </GlassCard>
      </section>

      <Footer />
    </div>
  );
}
