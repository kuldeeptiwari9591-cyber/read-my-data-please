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
          <div className="mt-8 space-y-2">
            {feedback.length === 0 && (
              <p className="text-sm text-muted-foreground">No feedback yet.</p>
            )}
            {feedback.map((f) => (
              <div key={f.id} className="rounded-lg border border-border bg-surface/40 px-4 py-3 text-sm">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {f.tool_slug ?? "general"} · {f.rating ?? "—"}/5
                  </span>
                  <span>{new Date(f.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap">{f.message}</p>
                {f.email && <p className="mt-1 text-xs text-muted-foreground">{f.email}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === "ops" && (
          <div className="mt-8 overflow-x-auto">
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
        )}
      </main>
    </div>
  );
}
