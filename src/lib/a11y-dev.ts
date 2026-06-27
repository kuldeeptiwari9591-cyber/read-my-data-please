// Dev-only axe-core audit. Logs accessibility findings to the browser console.
// Tree-shaken out of production builds via the import.meta.env.DEV guard.
export async function startAxeAudit() {
  if (typeof window === "undefined") return;
  if (!import.meta.env.DEV) return;
  try {
    const [{ default: React }, { default: ReactDOM }, axe] = await Promise.all([
      import("react"),
      import("react-dom"),
      import("@axe-core/react"),
    ]);
    await axe.default(React, ReactDOM, 1000, {
      rules: [
        // Tone down noisy rules for our shadcn primitives
        { id: "color-contrast", enabled: true },
      ],
    });
    // eslint-disable-next-line no-console
    console.info("[a11y] axe-core auditing enabled (dev only)");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[a11y] failed to start axe", err);
  }
}
