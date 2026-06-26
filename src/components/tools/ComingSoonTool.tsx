import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Bell, CheckCircle2, Clock, Hammer, Server, ImageIcon, FileText } from "lucide-react";
import { FileDrop } from "./ToolShell";
import { GlassCard } from "@/components/GlassCard";
import { PHASE_META, TOOLS, type Tool } from "@/lib/tools";
import { toast } from "sonner";

interface ComingSoonToolProps {
  tool: Tool;
  accept?: string;
  multiple?: boolean;
}

const PHASE_ICONS = {
  next: Hammer,
  interactive: Sparkles,
  server: Server,
};

export function ComingSoonTool({ tool, accept = "application/pdf,.pdf", multiple = false }: ComingSoonToolProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const phase = tool.phase ?? "next";
  const meta = PHASE_META[phase];
  const PhaseIcon = PHASE_ICONS[phase];

  // Build live previews for image files
  useEffect(() => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    const urls = imgs.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const totalSize = useMemo(
    () => files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024,
    [files],
  );

  const cohort = useMemo(
    () => TOOLS.filter((t) => t.status === "soon" && t.phase === phase).slice(0, 6),
    [phase],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email");
    try {
      const key = "crisppdf.notify";
      const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
      prev.push({ tool: tool.slug, email, at: Date.now() });
      localStorage.setItem(key, JSON.stringify(prev));
    } catch {}
    setNotified(true);
    toast.success("We'll email you the moment it ships");
  };

  return (
    <div className="space-y-6">
      {/* Phase banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-3 rounded-2xl border bg-gradient-to-r p-4 ${meta.tone}`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/70 backdrop-blur-sm">
          <PhaseIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-semibold">{meta.label}</span>
            <span className="rounded-full bg-background/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">
              ETA · {meta.eta}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{meta.blurb}</p>
        </div>
        <Clock className="h-4 w-4 shrink-0 opacity-60" />
      </motion.div>

      {/* Stage area */}
      <GlassCard className="overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-primary/8 to-secondary/8 px-5 py-3 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            In development · Stage your files now
          </span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" /> Beta soon
          </span>
        </div>

        <div className="p-5">
          <FileDrop
            files={files}
            onFiles={setFiles}
            multiple={multiple}
            accept={accept}
            label={`Drop files for ${tool.name}`}
          />

          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 grid gap-3 sm:grid-cols-3"
            >
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Staged
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-gradient">{files.length}</p>
                <p className="text-xs text-muted-foreground">file{files.length > 1 ? "s" : ""}</p>
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Total size
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-gradient">
                  {totalSize.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">megabytes</p>
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Privacy
                </p>
                <p className="mt-1 font-display text-base font-semibold">100% local</p>
                <p className="text-xs text-muted-foreground">never uploaded</p>
              </div>
            </motion.div>
          )}

          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden rounded-lg border border-border bg-surface/40"
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {files.length > 0 && previews.length === 0 && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm text-muted-foreground">
              {files[0].type.startsWith("image/") ? (
                <ImageIcon className="h-5 w-5 text-primary" />
              ) : (
                <FileText className="h-5 w-5 text-primary" />
              )}
              Files staged locally. We'll process them with {tool.name} the moment the
              {phase === "server" ? " backend worker" : " engine"} ships.
            </div>
          )}
        </div>
      </GlassCard>

      {/* Notify */}
      <GlassCard className="p-5">
        {notified ? (
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div>
              <p className="font-medium">You're on the list.</p>
              <p className="text-xs text-muted-foreground">
                We'll email you when {tool.name} launches.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Bell className="h-4 w-4 text-primary" />
              Notify me when it launches
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@work.com"
              className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-transform hover:scale-[1.02]"
            >
              Notify me
            </button>
          </form>
        )}
      </GlassCard>

      {/* Cohort */}
      {cohort.length > 1 && (
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Shipping in the same wave
            </h3>
            <span className="font-mono text-xs text-muted-foreground">{meta.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {cohort.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.slug}
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface/40 px-3 py-2 text-sm"
                >
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate">{t.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
