
CREATE TABLE IF NOT EXISTS public.tool_settings (
  slug text PRIMARY KEY,
  name text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tool_settings TO anon, authenticated;
GRANT ALL ON public.tool_settings TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.tool_settings TO authenticated;
ALTER TABLE public.tool_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads tool settings" ON public.tool_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage tool settings" ON public.tool_settings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'banner',
  ADD COLUMN IF NOT EXISTS eta text;
