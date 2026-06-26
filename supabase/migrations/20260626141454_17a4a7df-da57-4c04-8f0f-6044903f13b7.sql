
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
