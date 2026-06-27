import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [
      { title: "Signing you in…" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const finish = (to: string) => {
      if (!cancelled) navigate({ to: to as any, replace: true });
    };

    // Supabase JS auto-exchanges the URL fragment / ?code= into a session.
    // We just wait for the session to be hydrated, then route.
    const stored = (() => {
      try {
        return sessionStorage.getItem("post_auth_redirect");
      } catch {
        return null;
      }
    })();
    const target = stored && stored.startsWith("/") ? stored : "/";
    try {
      sessionStorage.removeItem("post_auth_redirect");
    } catch {}

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        finish(target);
        return;
      }
      const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
          sub.subscription.unsubscribe();
          finish(target);
        }
      });
      // Fallback: if nothing fires in 5s, go home.
      setTimeout(() => {
        sub.subscription.unsubscribe();
        finish(target);
      }, 5000);
    });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <p className="text-sm text-muted-foreground">Completing sign in…</p>
    </div>
  );
}
