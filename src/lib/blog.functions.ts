import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type BlogListItem = {
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  author: string | null;
  published_at: string | null;
};

export type BlogPost = BlogListItem & { body: string };

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogListItem[]> => {
    const sb = publicClient();
    const { data, error } = await sb
      .from("blog_posts")
      .select("slug,title,excerpt,cover_image,author,published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  },
);

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => {
    if (!d?.slug || typeof d.slug !== "string" || d.slug.length > 200) {
      throw new Error("Invalid slug");
    }
    return d;
  })
  .handler(async ({ data }): Promise<BlogPost | null> => {
    const sb = publicClient();
    const { data: row, error } = await sb
      .from("blog_posts")
      .select("slug,title,excerpt,body,cover_image,author,published_at")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });
