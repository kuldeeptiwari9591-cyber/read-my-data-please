
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Operations log
CREATE TABLE public.operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tool_slug TEXT NOT NULL,
  file_count INT,
  bytes_in BIGINT,
  duration_ms INT,
  success BOOLEAN NOT NULL DEFAULT true,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.operations TO anon, authenticated;
GRANT ALL ON public.operations TO service_role;
ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert ops" ON public.operations
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read ops" ON public.operations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX operations_tool_idx ON public.operations(tool_slug, created_at DESC);

-- Feedback
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tool_slug TEXT,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  message TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.feedback TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submits feedback" ON public.feedback
  FOR INSERT TO anon, authenticated WITH CHECK (char_length(message) BETWEEN 1 AND 2000);
CREATE POLICY "admins read feedback" ON public.feedback
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Blog
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  cover_image TEXT,
  author TEXT DEFAULT 'CrispPDF Team',
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads published posts" ON public.blog_posts
  FOR SELECT TO anon, authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage posts" ON public.blog_posts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Announcements
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads active announcements" ON public.announcements
  FOR SELECT TO anon, authenticated USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage announcements" ON public.announcements
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

DROP POLICY "anyone can insert ops" ON public.operations;
CREATE POLICY "anyone can insert ops" ON public.operations
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(tool_slug) BETWEEN 1 AND 80
    AND (error IS NULL OR char_length(error) <= 500)
  );

DROP POLICY "anyone submits feedback" ON public.feedback;
CREATE POLICY "anyone submits feedback" ON public.feedback
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(message) BETWEEN 1 AND 2000
    AND (email IS NULL OR char_length(email) <= 200)
    AND (tool_slug IS NULL OR char_length(tool_slug) <= 80)
  );

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
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}'::text[];INSERT INTO public.tool_settings (slug,name,enabled) VALUES
  ('merge-pdf', 'Merge PDF', true),
  ('split-pdf', 'Split PDF', true),
  ('compress-pdf', 'Compress PDF', true),
  ('pdf-to-word', 'PDF to Word', true),
  ('pdf-to-excel', 'PDF to Excel', true),
  ('pdf-to-ppt', 'PDF to PowerPoint', true),
  ('pdf-to-jpg', 'PDF to JPG', true),
  ('pdf-to-png', 'PDF to PNG', true),
  ('word-to-pdf', 'Word to PDF', true),
  ('excel-to-pdf', 'Excel to PDF', true),
  ('jpg-to-pdf', 'JPG to PDF', true),
  ('html-to-pdf', 'HTML to PDF', true),
  ('rotate-pdf', 'Rotate PDF', true),
  ('reorder-pdf-pages', 'Reorder Pages', true),
  ('delete-pdf-pages', 'Delete Pages', true),
  ('extract-pdf-pages', 'Extract Pages', true),
  ('crop-pdf', 'Crop PDF', true),
  ('repair-pdf', 'Repair PDF', true),
  ('flatten-pdf', 'Flatten PDF', true),
  ('pdf-to-pdfa', 'PDF to PDF/A', true),
  ('grayscale-pdf', 'Grayscale PDF', true),
  ('protect-pdf', 'Protect PDF', true),
  ('unlock-pdf', 'Unlock PDF', true),
  ('redact-pdf', 'Redact PDF', true),
  ('esign-pdf', 'eSign PDF', true),
  ('watermark-pdf', 'Watermark PDF', true),
  ('ocr-pdf', 'OCR PDF', true),
  ('add-page-numbers-pdf', 'Add Page Numbers', true),
  ('add-watermark-text-pdf', 'Add Watermark Text', true),
  ('extract-images-pdf', 'Extract Images', true),
  ('invert-pdf', 'Invert Colors PDF', true),
  ('resize-pdf', 'Resize PDF', true),
  ('n-up-pdf', 'N-up PDF', true),
  ('blank-page-pdf', 'Insert Blank Pages', true),
  ('duplicate-pages-pdf', 'Duplicate Pages', true),
  ('extract-text-pdf', 'Extract Text', true),
  ('edit-metadata-pdf', 'Edit PDF Metadata', true),
  ('compare-pdf', 'Compare PDFs', true),
  ('base64-pdf', 'PDF Base64', true),
  ('reverse-pdf', 'Reverse PDF', true)
ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name;ALTER TABLE public.feedback
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'feedback'
    CHECK (type IN ('feedback','bug','tool_request')),
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','resolved','spam'));
CREATE INDEX IF NOT EXISTS feedback_type_idx ON public.feedback(type);
CREATE INDEX IF NOT EXISTS feedback_status_idx ON public.feedback(status);
GRANT INSERT ON public.feedback TO anon;
DROP POLICY IF EXISTS "Public can submit feedback" ON public.feedback;
CREATE POLICY "Public can submit feedback"
  ON public.feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (length(message) >= 5 AND length(message) <= 5000);GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated;
-- Tighten feedback INSERT: enforce user_id matches auth.uid() (or null for anon)
DROP POLICY IF EXISTS "anyone submits feedback" ON public.feedback;
DROP POLICY IF EXISTS "Public can submit feedback" ON public.feedback;

CREATE POLICY "submit feedback safely" ON public.feedback
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(message) BETWEEN 1 AND 5000
  AND (email IS NULL OR char_length(email) <= 200)
  AND (tool_slug IS NULL OR char_length(tool_slug) <= 80)
  AND (
    (auth.uid() IS NULL AND user_id IS NULL)
    OR (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid()))
  )
);

-- Tighten operations INSERT: prevent user_id spoofing
DROP POLICY IF EXISTS "anyone can insert ops" ON public.operations;

CREATE POLICY "insert ops safely" ON public.operations
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(tool_slug) BETWEEN 1 AND 80
  AND (error IS NULL OR char_length(error) <= 500)
  AND (user_id IS NULL OR user_id = auth.uid())
);

-- Security audit log: server-only writes (service role), admin-only reads.
CREATE TABLE public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL,
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info','warn','error','critical')),
  actor_id uuid NULL,
  ip text NULL,
  user_agent text NULL,
  route text NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.security_audit_log TO authenticated;
GRANT ALL ON public.security_audit_log TO service_role;

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log"
  ON public.security_audit_log
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Inserts happen only via service_role (server functions / scheduled scans);
-- no INSERT policy is needed for the anon/authenticated roles.

CREATE INDEX idx_security_audit_log_created_at ON public.security_audit_log (created_at DESC);
CREATE INDEX idx_security_audit_log_event ON public.security_audit_log (event);
