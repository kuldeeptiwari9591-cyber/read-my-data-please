import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "./Logo";
import { supabase } from "@/integrations/supabase/client";

type Row = { body: string; eta: string | null };

export function MaintenanceGate({ children }: { children: ReactNode }) {
  const [maintenance, setMaintenance] = useState<Row | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const { data } = await supabase
          .from("announcements")
          .select("body,eta")
          .eq("type", "maintenance")
          .eq("active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (cancel) return;
        if (data) {
          setMaintenance(data as Row);
          // admin bypass
          const { data: session } = await supabase.auth.getSession();
          const uid = session.session?.user.id;
          if (uid) {
            const { data: role } = await supabase.rpc("has_role", {
              _user_id: uid,
              _role: "admin",
            });
            if (!cancel) setIsAdmin(Boolean(role));
          }
        }
      } finally {
        if (!cancel) setChecked(true);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  // Always bypass for admin route to avoid lockout
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/cp-crisp-7x92k")) {
    return <>{children}</>;
  }
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/auth")) {
    return <>{children}</>;
  }

  if (!checked || !maintenance || isAdmin) return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <div className="flex justify-center">
          <Logo size={64} withText={false} />
        </div>
        <h1 className="mt-8 font-display text-3xl font-bold">
          We're making CrispPDF better ✨
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{maintenance.body}</p>
        {maintenance.eta && (
          <p className="mt-4 inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted-foreground">
            Back in {maintenance.eta}
          </p>
        )}
      </div>
    </div>
  );
}
