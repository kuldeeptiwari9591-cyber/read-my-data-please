import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "crisppdf-theme";
type Theme = "light" | "dark";

function readStored(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === "dark" || v === "light") return v;
  } catch {}
  return "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
}

export function ThemeToggle() {
  // Render a stable placeholder on SSR; swap to real state after mount to
  // avoid hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const t = readStored();
    setTheme(t);
    applyTheme(t);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-surface/60 text-muted-foreground transition-colors hover:text-foreground"
    >
      {mounted && theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
