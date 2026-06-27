import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export function ToolDisabledGate({
  slug,
  toolName,
  children,
}: {
  slug: string;
  toolName: string;
  children: ReactNode;
}) {
  const [state, setState] = useState<"loading" | "enabled" | "disabled">("loading");
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const { data } = await supabase
          .from("tool_settings")
          .select("enabled")
          .eq("slug", slug)
          .maybeSingle();
        if (cancel) return;
        // If no row, default enabled
        setState(data && data.enabled === false ? "disabled" : "enabled");
      } catch {
        if (!cancel) setState("enabled");
      }
    })();
    return () => {
      cancel = true;
    };
  }, [slug]);

  if (state === "loading" || state === "enabled") return <>{children}</>;
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-10 text-center">
      <h2 className="font-display text-2xl font-semibold">{toolName} is temporarily unavailable</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        This tool is temporarily unavailable. We'll be back shortly!
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
      >
        Back to homepage
      </Link>
    </div>
  );
}
