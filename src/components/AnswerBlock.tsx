import type { ReactNode } from "react";

interface AnswerBlockProps {
  /** 40–60 word direct answer. Placed above the interactive tool for AEO. */
  children: ReactNode;
  /** Optional heading override; defaults to a screen-reader-only label. */
  heading?: string;
}

/**
 * AEO/GEO answer block. Renders a concise, extractable answer immediately
 * below the H1 and above the interactive tool. `data-speakable` is picked up
 * by the sitewide SpeakableSpecification JSON-LD.
 *
 * Keep the answer 40–60 words, self-contained (no "click below"), and
 * factually complete so an AI assistant can quote it directly.
 */
export function AnswerBlock({ children, heading }: AnswerBlockProps) {
  return (
    <section
      aria-label={heading ?? "Quick answer"}
      data-speakable
      className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-base leading-relaxed text-foreground sm:p-5"
    >
      {heading ? (
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
          {heading}
        </h2>
      ) : (
        <span className="sr-only">Quick answer</span>
      )}
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {children}
      </div>
    </section>
  );
}
