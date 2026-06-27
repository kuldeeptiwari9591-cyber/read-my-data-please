import { createServerFn } from "@tanstack/react-start";
import { createServerClient } from "@/integrations/supabase/server";

type FeedbackType = "feedback" | "bug" | "tool_request";

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      type: FeedbackType;
      tool_slug?: string | null;
      rating?: number | null;
      message: string;
      email?: string | null;
    }) => {
      if (!d || typeof d !== "object") throw new Error("Invalid payload");
      if (!["feedback", "bug", "tool_request"].includes(d.type))
        throw new Error("Invalid type");
      if (!d.message || d.message.length < 10 || d.message.length > 5000)
        throw new Error("Message must be 10–5000 characters");
      if (d.email && d.email.length > 200) throw new Error("Email too long");
      if (d.rating != null && (d.rating < 1 || d.rating > 5))
        throw new Error("Invalid rating");
      return d;
    },
  )
  .handler(async ({ data }) => {
    const supabase = createServerClient();
    const { error } = await supabase.from("feedback").insert({
      type: data.type,
      tool_slug: data.tool_slug ?? null,
      rating: data.rating ?? null,
      message: data.message,
      email: data.email ?? null,
      status: "open",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
