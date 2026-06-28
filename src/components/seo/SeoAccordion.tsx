// SSR-friendly accordion using native <details>/<summary>.
// Both the question AND the answer are present in server-rendered HTML,
// so Google, Bing, and AI crawlers (ChatGPT, Perplexity, Claude) can read
// the answers without executing JavaScript — required for FAQPage rich
// results and People Also Ask eligibility.
import { ChevronDown } from "lucide-react";

export interface SeoFAQ {
  q: string;
  a: string;
}

interface Props {
  items: SeoFAQ[];
  /** Optional container className override */
  className?: string;
}

export function SeoAccordion({ items, className }: Props) {
  return (
    <div
      className={
        className ??
        "mt-4 divide-y divide-border rounded-2xl border border-border bg-surface/40"
      }
    >
      {items.map((f, i) => (
        <details key={i} className="group px-5 py-1 [&[open]>summary>svg]:rotate-180">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-medium">
            <span>{f.q}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
          </summary>
          <p
            className="pb-4 pr-6 text-sm leading-relaxed text-muted-foreground"
            data-speakable="true"
          >
            {f.a}
          </p>
        </details>
      ))}
    </div>
  );
}
