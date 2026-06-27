import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, lazy, Suspense } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Header } from "@/components/Header";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  adminListPosts,
  adminUpsertPost,
  adminDeletePost,
  adminListFeedback,
  adminUpdateFeedbackStatus,
  adminOpsSummary,
  adminListToolSettings,
  adminSetToolEnabled,
  adminListAnnouncements,
  adminUpsertAnnouncement,
} from "@/lib/admin.functions";

const MDEditor = lazy(() => import("@uiw/react-md-editor"));

export const Route = createFileRoute("/_authenticated/cp-crisp-7x92k")({
  head: () => ({
    meta: [
      { title: "Admin — CrispPDF" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPanel,
});

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  published: boolean;
  published_at: string | null;
  updated_at: string;
};
type Feedback = {
  id: string;
  tool_slug: string | null;
  rating: number | null;
  message: string;
  email: string | null;
  created_at: string;
  type?: "feedback" | "bug" | "tool_request" | null;
  status?: "open" | "resolved" | "spam" | null;
};
type Op = {
  id: string;
  tool_slug: string;
  success: boolean;
  duration_ms: number | null;
  bytes_in: number | null;
  created_at: string;
};

const blank = {
  id: undefined as string | undefined,
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  published: false,
};

type ToolRow = { slug: string; name: string; enabled: boolean };
type Announcement = {
  id: string;
  type: string;
  title: string | null;
  body: string;
  severity: string;
  active: boolean;
  eta: string | null;
  created_at: string;
};

function AdminPanel() {
  const listPosts = useServerFn(adminListPosts);
  const upsertPost = useServerFn(adminUpsertPost);
  const deletePost = useServerFn(adminDeletePost);
  const listFeedback = useServerFn(adminListFeedback);
  const listOps = useServerFn(adminOpsSummary);
  const listTools = useServerFn(adminListToolSettings);
  const setToolEnabled = useServerFn(adminSetToolEnabled);
  const listAnnouncements = useServerFn(adminListAnnouncements);
  const upsertAnnouncement = useServerFn(adminUpsertAnnouncement);

  const [tab, setTab] = useState<"posts" | "feedback" | "ops" | "tools" | "settings">("posts");
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [ops, setOps] = useState<Op[]>([]);
  const [tools, setTools] = useState<ToolRow[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [draft, setDraft] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // banner & maintenance drafts
  const [bannerBody, setBannerBody] = useState("");
  const [bannerSeverity, setBannerSeverity] = useState<"info" | "warning" | "success">("info");
  const [bannerActive, setBannerActive] = useState(false);
  const [maintBody, setMaintBody] = useState("We're making CrispPDF better. Back shortly!");
  const [maintEta, setMaintEta] = useState("");
  const [maintActive, setMaintActive] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const refresh = async () => {
    try {
      const [p, f, o, t, a] = await Promise.all([
        listPosts(),
        listFeedback(),
        listOps(),
        listTools(),
        listAnnouncements(),
      ]);
      setPosts(p as PostRow[]);
      setFeedback(f as Feedback[]);
      setOps(o as Op[]);
      setTools(t as ToolRow[]);
      const ann = a as Announcement[];
      setAnnouncements(ann);
      const b = ann.find((x) => x.type === "banner");
      if (b) {
        setBannerBody(b.body);
        setBannerSeverity((b.severity as "info" | "warning" | "success") ?? "info");
        setBannerActive(b.active);
      }
      const m = ann.find((x) => x.type === "maintenance");
      if (m) {
        setMaintBody(m.body);
        setMaintEta(m.eta ?? "");
        setMaintActive(m.active);
      }
      setAllowed(true);
    } catch (e) {
      setAllowed(false);
      toast.error(e instanceof Error ? e.message : "Access denied");
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    if (!draft.slug || !draft.title || !draft.excerpt || !draft.body) {
      toast.error("Fill slug, title, excerpt, and body");
      return;
    }
    setBusy(true);
    try {
      await upsertPost({ data: draft });
      toast.success("Saved");
      setDraft(blank);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost({ data: { id } });
      toast.success("Deleted");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (allowed === false) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-md px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-bold">Access denied</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account doesn't have admin access. Ask an existing admin to grant you the role.
          </p>
          <button onClick={signOut} className="mt-6 text-sm text-primary">
            Sign out
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Admin</h1>
          <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground">
            Sign out
          </button>
        </div>

        <div className="mt-6 flex gap-2 border-b border-border">
          {(["posts", "feedback", "ops", "tools", "settings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm capitalize ${
                tab === t
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}{" "}
              {t === "posts"
                ? `(${posts.length})`
                : t === "feedback"
                  ? `(${feedback.length})`
                  : t === "ops"
                    ? `(${ops.length})`
                    : t === "tools"
                      ? `(${tools.length})`
                      : ""}
            </button>
          ))}
        </div>

        {tab === "posts" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr,1.2fr]">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {draft.id ? "Edit post" : "New post"}
              </h2>
              <div className="mt-4 space-y-3">
                <input
                  placeholder="slug-with-dashes"
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface/40 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Title"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface/40 px-3 py-2 text-sm"
                />
                <textarea
                  placeholder="Excerpt (≤500 chars)"
                  value={draft.excerpt}
                  onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-border bg-surface/40 px-3 py-2 text-sm"
                />
                <Suspense
                  fallback={
                    <textarea
                      value={draft.body}
                      onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                      rows={14}
                      className="w-full rounded-md border border-border bg-surface/40 px-3 py-2 font-mono text-xs"
                    />
                  }
                >
                  <div data-color-mode={isDark ? "dark" : "light"}>
                    <MDEditor
                      value={draft.body}
                      onChange={(v) => setDraft({ ...draft, body: v ?? "" })}
                      preview="live"
                      height={500}
                    />
                  </div>
                </Suspense>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.published}
                    onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                  />
                  Published
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={save}
                    disabled={busy}
                    className="rounded-md bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    {busy ? "Saving…" : draft.id ? "Update" : "Create"}
                  </button>
                  {draft.id && (
                    <button
                      onClick={() => setDraft(blank)}
                      className="rounded-md border border-border px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                All posts
              </h2>
              <div className="mt-4 space-y-2">
                {posts.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-lg border border-border bg-surface/40 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="font-semibold">{p.title}</span>
                        <span className="ml-2 text-xs text-muted-foreground">/{p.slug}</span>
                      </div>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] uppercase ${
                          p.published ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.published ? "Live" : "Draft"}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-3 text-xs">
                      <button
                        onClick={async () => {
                          // load full row so body is editable
                          const { data } = await supabase
                            .from("blog_posts")
                            .select("id,slug,title,excerpt,body,published")
                            .eq("id", p.id)
                            .maybeSingle();
                          if (data) setDraft({ ...data, id: data.id });
                        }}
                        className="text-primary"
                      >
                        Edit
                      </button>
                      <button onClick={() => remove(p.id)} className="text-destructive">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === "feedback" && (
          <FeedbackInbox feedback={feedback} onChange={refresh} />
        )}

        {tab === "ops" && (
          <div className="mt-8 space-y-6">
            <OpsChart ops={ops} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-2 py-2 text-left">Tool</th>
                    <th className="px-2 py-2 text-left">Status</th>
                    <th className="px-2 py-2 text-right">Duration</th>
                    <th className="px-2 py-2 text-right">Bytes in</th>
                    <th className="px-2 py-2 text-right">When</th>
                  </tr>
                </thead>
                <tbody>
                  {ops.map((o) => (
                    <tr key={o.id} className="border-t border-border">
                      <td className="px-2 py-2">{o.tool_slug}</td>
                      <td className="px-2 py-2">
                        <span className={o.success ? "text-primary" : "text-destructive"}>
                          {o.success ? "ok" : "fail"}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-right">{o.duration_ms ?? "—"} ms</td>
                      <td className="px-2 py-2 text-right">
                        {o.bytes_in ? (o.bytes_in / 1024).toFixed(1) + " KB" : "—"}
                      </td>
                      <td className="px-2 py-2 text-right text-xs text-muted-foreground">
                        {new Date(o.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "tools" && (
          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            {tools.length === 0 && (
              <p className="text-sm text-muted-foreground">No tools registered yet.</p>
            )}
            {tools.map((tl) => (
              <label
                key={tl.slug}
                className="flex items-center justify-between rounded-lg border border-border bg-surface/40 px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{tl.name}</div>
                  <div className="truncate text-xs text-muted-foreground">/{tl.slug}</div>
                </div>
                <input
                  type="checkbox"
                  checked={tl.enabled}
                  onChange={async (e) => {
                    const next = e.target.checked;
                    setTools((rows) =>
                      rows.map((r) => (r.slug === tl.slug ? { ...r, enabled: next } : r)),
                    );
                    try {
                      await setToolEnabled({ data: { slug: tl.slug, enabled: next } });
                      toast.success(`${tl.name} ${next ? "enabled" : "disabled"}`);
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Toggle failed");
                      refresh();
                    }
                  }}
                />
              </label>
            ))}
          </div>
        )}

        {tab === "settings" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <section className="rounded-2xl border border-border bg-surface/40 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Announcement banner
              </h2>
              <div className="mt-4 space-y-3">
                <textarea
                  placeholder="Announcement message"
                  value={bannerBody}
                  onChange={(e) => setBannerBody(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={bannerActive}
                      onChange={(e) => setBannerActive(e.target.checked)}
                    />
                    Active
                  </label>
                  {(["info", "warning", "success"] as const).map((s) => (
                    <label key={s} className="flex items-center gap-1 text-xs capitalize">
                      <input
                        type="radio"
                        name="bannerSev"
                        checked={bannerSeverity === s}
                        onChange={() => setBannerSeverity(s)}
                      />
                      {s}
                    </label>
                  ))}
                </div>
                {bannerBody && (
                  <div
                    className={`rounded-md px-3 py-2 text-xs ${
                      bannerSeverity === "warning"
                        ? "bg-amber-500 text-black"
                        : bannerSeverity === "success"
                          ? "bg-emerald-500 text-black"
                          : "bg-primary text-primary-foreground"
                    }`}
                  >
                    Preview: {bannerBody}
                  </div>
                )}
                <button
                  onClick={async () => {
                    const existing = announcements.find((a) => a.type === "banner");
                    try {
                      await upsertAnnouncement({
                        data: {
                          id: existing?.id,
                          type: "banner",
                          body: bannerBody || " ",
                          severity: bannerSeverity,
                          active: bannerActive,
                        },
                      });
                      toast.success("Banner saved");
                      refresh();
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Save failed");
                    }
                  }}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Save banner
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface/40 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Maintenance mode
              </h2>
              <div className="mt-4 space-y-3">
                <textarea
                  placeholder="Maintenance message"
                  value={maintBody}
                  onChange={(e) => setMaintBody(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  placeholder='ETA, e.g. "~2 hours"'
                  value={maintEta}
                  onChange={(e) => setMaintEta(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={maintActive}
                    onChange={(e) => setMaintActive(e.target.checked)}
                  />
                  Maintenance mode ON (admins still have access)
                </label>
                <button
                  onClick={async () => {
                    const existing = announcements.find((a) => a.type === "maintenance");
                    try {
                      await upsertAnnouncement({
                        data: {
                          id: existing?.id,
                          type: "maintenance",
                          body: maintBody,
                          severity: "warning",
                          active: maintActive,
                          eta: maintEta || null,
                        },
                      });
                      toast.success("Maintenance saved");
                      refresh();
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Save failed");
                    }
                  }}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Save maintenance
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

// ---------- Feedback inbox with type filter + status actions ----------
function FeedbackInbox({ feedback, onChange }: { feedback: Feedback[]; onChange: () => void }) {
  const updateStatus = useServerFn(adminUpdateFeedbackStatus);
  const [filter, setFilter] = useState<"all" | "feedback" | "bug" | "tool_request">("all");
  const filtered = feedback.filter((f) => filter === "all" || (f.type ?? "feedback") === filter);
  const counts = {
    all: feedback.length,
    feedback: feedback.filter((f) => (f.type ?? "feedback") === "feedback").length,
    bug: feedback.filter((f) => f.type === "bug").length,
    tool_request: feedback.filter((f) => f.type === "tool_request").length,
  };
  const setStatus = async (id: string, status: "resolved" | "spam") => {
    try {
      await updateStatus({ data: { id, status } });
      toast.success(status === "resolved" ? "Marked resolved" : "Marked as spam");
      onChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };
  const tabs: { id: typeof filter; label: string }[] = [
    { id: "all", label: `All (${counts.all})` },
    { id: "feedback", label: `Feedback (${counts.feedback})` },
    { id: "bug", label: `Bug Reports (${counts.bug})` },
    { id: "tool_request", label: `Tool Requests (${counts.tool_request})` },
  ];
  const renderMessage = (raw: string) => {
    try {
      const obj = JSON.parse(raw);
      return (
        <div className="space-y-1 text-sm">
          {Object.entries(obj).map(([k, v]) =>
            v ? (
              <div key={k}>
                <span className="font-medium capitalize text-foreground">{k}:</span>{" "}
                <span className="text-muted-foreground">{String(v)}</span>
              </div>
            ) : null,
          )}
        </div>
      );
    } catch {
      return <p className="whitespace-pre-wrap text-sm">{raw}</p>;
    }
  };
  const typeBadge = (t?: string | null) => {
    const v = t ?? "feedback";
    const cls =
      v === "bug"
        ? "bg-destructive/10 text-destructive border-destructive/30"
        : v === "tool_request"
          ? "bg-secondary/10 text-secondary border-secondary/30"
          : "bg-primary/10 text-primary border-primary/30";
    return <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cls}`}>{v.replace("_", " ")}</span>;
  };
  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-surface/30 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${filter === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">No items.</p>}
        {filtered.map((f) => (
          <div key={f.id} className={`rounded-lg border border-border bg-surface/40 px-4 py-3 ${f.status === "resolved" ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {typeBadge(f.type)}
                <span>{f.tool_slug ?? "general"}</span>
                {f.rating != null && <span>· {f.rating}/5</span>}
                {f.status && f.status !== "open" && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase">{f.status}</span>
                )}
              </div>
              <span>{new Date(f.created_at).toLocaleString()}</span>
            </div>
            <div className="mt-2">{renderMessage(f.message)}</div>
            {f.email && <p className="mt-1 text-xs text-muted-foreground">↩︎ {f.email}</p>}
            {f.status === "open" && (
              <div className="mt-3 flex gap-2">
                <button onClick={() => setStatus(f.id, "resolved")} className="rounded bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/25">
                  Resolve
                </button>
                <button onClick={() => setStatus(f.id, "spam")} className="rounded bg-destructive/15 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/25">
                  Spam
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Top tools bar chart ----------
function OpsChart({ ops }: { ops: Op[] }) {
  const data = (() => {
    const map = new Map<string, number>();
    for (const o of ops) map.set(o.tool_slug, (map.get(o.tool_slug) ?? 0) + 1);
    return [...map.entries()]
      .map(([tool, count]) => ({ tool, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  })();

  if (ops.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface/40 p-6 text-sm text-muted-foreground">
        No data yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Top tools (last 100 operations)
      </h3>
      <div className="mt-4 h-64">
        <Suspense fallback={<div className="h-full animate-pulse rounded-lg bg-muted/40" />}>
          <LazyBarChart data={data} />
        </Suspense>
      </div>
    </div>
  );
}

const LazyBarChart = lazy(async () => {
  const recharts = await import("recharts");
  const { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } = recharts;
  return {
    default: ({ data }: { data: { tool: string; count: number }[] }) => (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 16, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,127,0.15)" vertical={false} />
          <XAxis
            dataKey="tool"
            angle={-30}
            textAnchor="end"
            height={60}
            interval={0}
            tick={{ fill: "#6B7280", fontSize: 11 }}
          />
          <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: "transparent",
              border: "1px solid rgba(99,102,241,0.4)",
              borderRadius: 8,
              color: "#E5E7EB",
            }}
            cursor={{ fill: "rgba(99,102,241,0.08)" }}
          />
          <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    ),
  };
});
