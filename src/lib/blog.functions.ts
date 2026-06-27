import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { checkRateLimit } from "@/lib/server-rate-limit";
import { tokenizeSearch, ilikePattern } from "@/lib/search-sanitize";

export type BlogListItem = {
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  author: string | null;
  published_at: string | null;
  tags: string[];
};

export type BlogPost = BlogListItem & { body: string };

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

function clientIp(): string {
  try {
    return getRequestIP({ xForwardedFor: true }) ?? "unknown";
  } catch {
    return "unknown";
  }
}

function enforceRate(bucket: string, limit: number) {
  const ip = clientIp();
  const ua = getRequestHeader("user-agent") ?? "";
  const rl = checkRateLimit({ key: `${bucket}:${ip}`, limit, windowMs: 60_000 });
  if (!rl.allowed) {
    // Lazy-load audit to avoid pulling the admin client into modules that
    // don't need it on the happy path.
    void import("@/lib/audit.server").then(({ logAudit }) =>
      logAudit({
        event: `${bucket}.rate_limited`,
        severity: "warn",
        ip,
        user_agent: ua,
        details: { retryInMs: rl.retryInMs },
      }),
    );
    throw new Error("Too many requests — slow down and try again.");
  }
}

export const listPublishedPosts = createServerFn({ method: "GET" })
  .inputValidator((d: { q?: string } | undefined) => ({ q: d?.q ?? "" }))
  .handler(async ({ data }): Promise<BlogListItem[]> => {
    enforceRate("blog-list", 60);

    const sb = publicClient();
    let query = sb
      .from("blog_posts")
      .select("slug,title,excerpt,cover_image,author,published_at,tags")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(50);

    const tokens = tokenizeSearch(data.q);
    if (tokens.length) {
      // AND across tokens, OR across columns per token — safe ilike with
      // pre-escaped patterns. Sanitizer already stripped %, _, commas, etc.
      for (const t of tokens) {
        const p = ilikePattern(t);
        query = query.or(`title.ilike.${p},excerpt.ilike.${p}`);
      }
    }

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => {
    if (!d?.slug || typeof d.slug !== "string") throw new Error("Invalid slug");
    if (!/^[a-z0-9][a-z0-9-]{0,199}$/.test(d.slug))
      throw new Error("Invalid slug format");
    return d;
  })
  .handler(async ({ data }): Promise<BlogPost | null> => {
    enforceRate("blog-post", 120);

    const sb = publicClient();
    const { data: row, error } = await sb
      .from("blog_posts")
      .select("slug,title,excerpt,body,cover_image,author,published_at,tags")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });
