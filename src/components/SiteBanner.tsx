import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Row = {
  id: string;
  body: string;
  severity: "info" | "warning" | "success" | string;
};

const COLORS: Record<string, string> = {
  info: "bg-primary text-primary-foreground",
  warning: "bg-amber-500 text-black",
  success: "bg-emerald-500 text-black",
};

export function SiteBanner() {
  const [row, setRow] = useState<Row | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const { data } = await supabase
          .from("announcements")
          .select("id,body,severity")
          .eq("type", "banner")
          .eq("active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!cancel && data) {
          setRow(data as Row);
          try {
            const k = `crisppdf-banner-dismiss-${data.id}`;
            if (localStorage.getItem(k) === "1") setDismissed(true);
          } catch {}
        }
      } catch {
        /* silent */
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  if (!row || dismissed) return null;
  const cls = COLORS[row.severity] ?? COLORS.info;
  return (
    <div className={`relative w-full ${cls} px-4 py-2 text-center text-xs font-medium`}>
      <span>{row.body}</span>
      <button
        aria-label="Dismiss banner"
        onClick={() => {
          setDismissed(true);
          try {
            localStorage.setItem(`crisppdf-banner-dismiss-${row.id}`, "1");
          } catch {}
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-black/10"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
