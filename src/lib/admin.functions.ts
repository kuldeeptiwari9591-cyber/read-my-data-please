import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("blog_posts")
      .select("id,slug,title,excerpt,published,published_at,updated_at")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpsertPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: {
      id?: string;
      slug: string;
      title: string;
      excerpt: string;
      body: string;
      cover_image?: string | null;
      published: boolean;
    }) => {
      if (!d.slug || !/^[a-z0-9-]{1,120}$/.test(d.slug)) throw new Error("Invalid slug");
      if (!d.title || d.title.length > 200) throw new Error("Invalid title");
      if (!d.excerpt || d.excerpt.length > 500) throw new Error("Invalid excerpt");
      if (!d.body || d.body.length > 100_000) throw new Error("Invalid body");
      return d;
    },
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      body: data.body,
      cover_image: data.cover_image ?? null,
      published: data.published,
      published_at: data.published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };
    const q = data.id
      ? context.supabase.from("blog_posts").update(payload).eq("id", data.id)
      : context.supabase.from("blog_posts").insert(payload);
    const { error } = await q;
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => {
    if (!d?.id) throw new Error("Invalid id");
    return d;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListFeedback = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("feedback")
      .select("id,tool_slug,rating,message,email,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminOpsSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("operations")
      .select("id,tool_slug,success,duration_ms,bytes_in,created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });
