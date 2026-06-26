import confetti from "canvas-confetti";

/** Subtle indigo/purple burst. Respects prefers-reduced-motion. */
export function celebrate(originY = 0.7) {
  if (typeof window === "undefined") return;
  try {
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduce) return;
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: originY },
      colors: ["#6366F1", "#8B5CF6", "#A5B4FC", "#C4B5FD"],
      shapes: ["circle", "square"],
      scalar: 0.8,
      ticks: 120,
      disableForReducedMotion: true,
    });
  } catch {
    /* never break a download for fireworks */
  }
}
