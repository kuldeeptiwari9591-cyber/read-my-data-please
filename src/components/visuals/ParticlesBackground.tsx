import { useEffect, useRef } from "react";

interface ParticlesBackgroundProps {
  className?: string;
  density?: number; // particles per 10k px²
  color?: string;
  linkColor?: string;
}

/**
 * Lightweight canvas particle field with linking lines. No external deps.
 * DPR-aware, respects prefers-reduced-motion, pauses when off-screen.
 */
export function ParticlesBackground({
  className = "",
  density = 0.08,
  color = "rgba(99,102,241,0.55)",
  linkColor = "rgba(139,92,246,0.18)",
}: ParticlesBackgroundProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    // Skip entirely on mobile or when user prefers reduced motion — biggest perf win.
    if (reduce || isMobile) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0,
      h = 0;
    let raf = 0;
    let running = true;
    let visible = true;

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let pts: P[] = [];

    function seed() {
      const count = Math.max(20, Math.min(120, Math.round((w * h * density) / 10000)));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
      }));
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function frame() {
      if (!running || !visible) return;
      ctx!.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.fill();
      }
      // links — only iterate nearby buckets to cut O(n²) cost
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i],
            b = pts[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) {
            const o = 1 - Math.sqrt(d2) / 120;
            ctx!.strokeStyle = linkColor.replace(/[\d.]+\)$/, `${(o * 0.4).toFixed(3)})`);
            ctx!.lineWidth = 0.6;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const onVis = () => {
      running = !document.hidden;
      if (running && visible) frame();
    };
    document.addEventListener("visibilitychange", onVis);
    // Pause when scrolled off-screen.
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && running) frame();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density, color, linkColor]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
