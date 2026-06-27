ALTER TABLE public.feedback
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
  WITH CHECK (length(message) >= 5 AND length(message) <= 5000);