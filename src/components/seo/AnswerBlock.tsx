// AEO TL;DR — direct 40–60 word answer near top of every tool page.
// Optimised to be quoted verbatim by AI Overviews / Perplexity / ChatGPT.
import { Sparkles } from "lucide-react";

export function AnswerBlock({ title, answer }: { title: string; answer: string }) {
  return (
    <aside
      data-speakable
      className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-5 md:p-6"
      aria-label={`Quick answer: ${title}`}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Quick answer
        </span>
      </div>
      <p className="mt-3 text-base leading-relaxed text-foreground">{answer}</p>
    </aside>
  );
}
