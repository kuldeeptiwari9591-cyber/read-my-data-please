import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TOOLS } from "@/lib/tools";
import { submitFeedback } from "@/lib/feedback.functions";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { hreflangLinks } from "@/lib/hreflang";
import { Star, CheckCircle2, Bug, MessageSquare, Wrench, AlertTriangle } from "lucide-react";

const CANONICAL = abs("/feedback");
const TITLE = "Feedback & Feature Requests — CrispPDF";
const DESC = "Send feedback, report a bug, or request a new PDF tool. We read every submission.";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: CANONICAL },
      { property: "og:image", content: OG_DEFAULT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_DEFAULT },
    ],
    links: [{ rel: "canonical", href: CANONICAL }, ...hreflangLinks("/feedback")],
  }),
  component: FeedbackPage,
});

type Tab = "feedback" | "bug" | "tool_request";

function FeedbackPage() {
  const [tab, setTab] = useState<Tab>("feedback");
  const submit = useServerFn(submitFeedback);

  // shared
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // feedback
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [tool, setTool] = useState("general");
  const [fbMsg, setFbMsg] = useState("");

  // bug
  const [bugTool, setBugTool] = useState("");
  const [bugWhat, setBugWhat] = useState("");
  const [bugExpected, setBugExpected] = useState("");
  const [bugEnv, setBugEnv] = useState("");

  // request
  const [reqName, setReqName] = useState("");
  const [reqWhy, setReqWhy] = useState("");
  const [reqFreq, setReqFreq] = useState("Weekly");

  const reset = () => {
    setRating(0); setTool("general"); setFbMsg("");
    setBugTool(""); setBugWhat(""); setBugExpected(""); setBugEnv("");
    setReqName(""); setReqWhy(""); setReqFreq("Weekly");
    setEmail("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      let payload: Parameters<typeof submit>[0]["data"];
      if (tab === "feedback") {
        if (!rating) throw new Error("Please pick a star rating.");
        if (fbMsg.trim().length < 10) throw new Error("Please share at least 10 characters of feedback.");
        payload = {
          type: "feedback",
          tool_slug: tool,
          rating,
          message: JSON.stringify({ tool, rating, message: fbMsg.trim() }),
          email: email.trim() || null,
        };
      } else if (tab === "bug") {
        if (!bugTool) throw new Error("Please choose which tool.");
        if (bugWhat.trim().length < 10) throw new Error("Please describe what happened (10+ chars).");
        if (bugExpected.trim().length < 5) throw new Error("Please describe what you expected.");
        payload = {
          type: "bug",
          tool_slug: bugTool,
          rating: null,
          message: JSON.stringify({ tool: bugTool, what: bugWhat.trim(), expected: bugExpected.trim(), env: bugEnv.trim() }),
          email: email.trim() || null,
        };
      } else {
        if (reqName.trim().length < 3) throw new Error("Please name the tool you need.");
        if (reqWhy.trim().length < 10) throw new Error("Please explain why you need it (10+ chars).");
        payload = {
          type: "tool_request",
          tool_slug: null,
          rating: null,
          message: JSON.stringify({ name: reqName.trim(), why: reqWhy.trim(), frequency: reqFreq }),
          email: email.trim() || null,
        };
      }
      await submit({ data: payload });
      setDone(true);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold">Received!</h1>
          <p className="mt-3 text-muted-foreground">We read every submission. Thank you for helping make CrispPDF better.</p>
          <div className="mt-8 flex gap-3">
            <button onClick={() => setDone(false)} className="rounded-lg border border-border bg-surface/60 px-5 py-2.5 text-sm font-medium hover:border-primary/60">Send another</button>
            <Link to="/" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">Back home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Feedback &amp; Requests</h1>
        <p className="mt-3 text-muted-foreground">Tell us what's broken, what's missing, or what's great. We actually read every message.</p>

        {/* tabs */}
        <div className="mt-8 flex gap-2 rounded-xl border border-border bg-surface/40 p-1">
          {([
            { id: "feedback", label: "General Feedback", icon: MessageSquare },
            { id: "bug", label: "Report a Bug", icon: Bug },
            { id: "tool_request", label: "Request a Tool", icon: Wrench },
          ] as { id: Tab; label: string; icon: typeof Bug }[]).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTab(t.id); setError(null); }}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors md:text-sm ${tab === t.id ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-border bg-surface/40 p-6">
          {tab === "feedback" && (
            <>
              <Field label="How satisfied are you?" required>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      className="rounded-md p-1 transition-transform hover:scale-110"
                    >
                      <Star className={`h-7 w-7 ${(hoverRating || rating) >= n ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Which tool did you use?">
                <ToolSelect value={tool} onChange={setTool} includeGeneral />
              </Field>
              <Field label="Your feedback" required>
                <textarea value={fbMsg} onChange={(e) => setFbMsg(e.target.value)} rows={5} required minLength={10} className="textarea" placeholder="What worked, what didn't, what surprised you…" />
              </Field>
            </>
          )}

          {tab === "bug" && (
            <>
              <Field label="Which tool?" required>
                <ToolSelect value={bugTool} onChange={setBugTool} />
              </Field>
              <Field label="What happened?" required>
                <textarea value={bugWhat} onChange={(e) => setBugWhat(e.target.value)} rows={4} required minLength={10} className="textarea" placeholder="Steps you took and the result you saw." />
              </Field>
              <Field label="What did you expect?" required>
                <textarea value={bugExpected} onChange={(e) => setBugExpected(e.target.value)} rows={3} required minLength={5} className="textarea" placeholder="What you thought would happen." />
              </Field>
              <Field label="Browser + device (optional)">
                <input type="text" value={bugEnv} onChange={(e) => setBugEnv(e.target.value)} className="input" placeholder="Chrome 124, MacBook Air M2" />
              </Field>
            </>
          )}

          {tab === "tool_request" && (
            <>
              <Field label="Tool name / what you need" required>
                <input type="text" value={reqName} onChange={(e) => setReqName(e.target.value)} required minLength={3} className="input" placeholder="e.g. PDF to EPUB converter" />
              </Field>
              <Field label="Why do you need it?" required>
                <textarea value={reqWhy} onChange={(e) => setReqWhy(e.target.value)} rows={4} required minLength={10} className="textarea" placeholder="What problem would this solve for you?" />
              </Field>
              <Field label="How often would you use it?">
                <select value={reqFreq} onChange={(e) => setReqFreq(e.target.value)} className="input">
                  {["Daily", "Weekly", "Monthly", "Rarely"].map((f) => <option key={f}>{f}</option>)}
                </select>
              </Field>
            </>
          )}

          <Field label={tab === "feedback" ? "Email (optional)" : "Email (optional)"}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="Leave email if you want a reply" />
          </Field>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div className="flex-1">{error}</div>
              <button type="button" onClick={onSubmit} className="rounded bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">Retry</button>
            </div>
          )}

          <button type="submit" disabled={busy} className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60">
            {busy ? "Sending…" : tab === "feedback" ? "Send Feedback" : tab === "bug" ? "Report Bug" : "Request This Tool"}
          </button>
        </form>
      </main>
      <Footer />
      <style>{`
        .input, .textarea { width: 100%; border: 1px solid hsl(var(--border)); background: hsl(var(--background)); border-radius: 0.5rem; padding: 0.625rem 0.75rem; font-size: 0.875rem; }
        .input:focus, .textarea:focus { outline: 2px solid hsl(var(--primary) / 0.4); outline-offset: 0; }
        .textarea { resize: vertical; min-height: 90px; }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}{required && <span className="ml-1 text-destructive">*</span>}</span>
      {children}
    </label>
  );
}

function ToolSelect({ value, onChange, includeGeneral }: { value: string; onChange: (v: string) => void; includeGeneral?: boolean }) {
  return (
    <select required value={value} onChange={(e) => onChange(e.target.value)} className="input">
      {!includeGeneral && <option value="">Select a tool…</option>}
      {includeGeneral && <option value="general">General (not a specific tool)</option>}
      {TOOLS.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
    </select>
  );
}
