
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
