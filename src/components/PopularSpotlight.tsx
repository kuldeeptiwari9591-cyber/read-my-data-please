import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { toolIconMap, categoryColorMap } from "@/lib/toolIcons";
import { TOOLS_BY_SLUG } from "@/lib/tools";

const POPULAR = [
  { slug: "compress-pdf", desc: "Shrink any PDF without losing quality", badge: "Most popular" },
  { slug: "merge-pdf", desc: "Combine multiple files in seconds", badge: "Team favourite" },
  { slug: "pdf-to-word", desc: "Get a fully editable .docx output", badge: "Most requested" },
  { slug: "esign-pdf", desc: "Sign documents without printing", badge: "Fastest growing" },
  { slug: "pdf-to-jpg", desc: "Convert every page to an image", badge: "Top converter" },
  { slug: "split-pdf", desc: "Extract exactly the pages you need", badge: "Student pick" },
];

export function PopularSpotlight() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">// POPULAR</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Most used tools
        </h2>
        <p className="mt-3 text-muted-foreground">The tools people come back for.</p>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
        {POPULAR.map((p, i) => {
          const tool = TOOLS_BY_SLUG[p.slug];
          if (!tool) return null;
          const Icon = toolIconMap[p.slug] ?? tool.icon;
          const color = categoryColorMap[tool.category] ?? "text-primary";
          return (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link
                to={("/" + p.slug) as never}
                className="group relative block h-full overflow-hidden rounded-xl border border-border bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]"
              >
                <div className="flex items-start justify-between">
                  <Icon className={`h-8 w-8 ${color}`} />
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-500">
                    {p.badge}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{tool.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
