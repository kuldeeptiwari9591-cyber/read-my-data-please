import { useState } from "react";
import { Sparkles, Bell, CheckCircle2 } from "lucide-react";
import { FileDrop } from "./ToolShell";
import { GlassCard } from "@/components/GlassCard";
import { toast } from "sonner";

interface ComingSoonToolProps {
  toolName: string;
  accept?: string;
  multiple?: boolean;
}

export function ComingSoonTool({
  toolName,
  accept = "application/pdf,.pdf",
  multiple = false,
}: ComingSoonToolProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    try {
      const key = "crisppdf.notify";
      const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
      prev.push({ tool: toolName, email, at: Date.now() });
      localStorage.setItem(key, JSON.stringify(prev));
    } catch {}
    setNotified(true);
    toast.success("We'll email you the moment it ships");
  };

  return (
    <div className="space-y-6">
      <GlassCard className="overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-primary/8 to-secondary/8 px-5 py-3 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            In active development · Try the upload now
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
            label={`Drop files for ${toolName}`}
          />

          {files.length > 0 && (
            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
              <p className="font-medium">
                {files.length} file{files.length > 1 ? "s" : ""} staged locally.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Nothing left your browser. The processor for {toolName} is being built — drop your
                email below and we'll ping you the moment it's live.
              </p>
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        {notified ? (
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div>
              <p className="font-medium">You're on the list.</p>
              <p className="text-xs text-muted-foreground">
                We'll email you when {toolName} launches.
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
    </div>
  );
}
