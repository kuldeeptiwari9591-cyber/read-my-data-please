-- Phase 1 security hardening: tighter bounds on public inserts,
-- and additional CHECK constraints on operations to prevent abuse.
-- Idempotent: safe to re-run.

-- Numeric bounds on operations (prevent absurd values from anon inserts).
ALTER TABLE public.operations
  DROP CONSTRAINT IF EXISTS operations_file_count_bounds,
  DROP CONSTRAINT IF EXISTS operations_bytes_in_bounds,
  DROP CONSTRAINT IF EXISTS operations_duration_bounds;

ALTER TABLE public.operations
  ADD CONSTRAINT operations_file_count_bounds
    CHECK (file_count IS NULL OR (file_count >= 0 AND file_count <= 1000)),
  ADD CONSTRAINT operations_bytes_in_bounds
    CHECK (bytes_in IS NULL OR (bytes_in >= 0 AND bytes_in <= 5368709120)), -- 5 GiB hard ceiling
  ADD CONSTRAINT operations_duration_bounds
    CHECK (duration_ms IS NULL OR (duration_ms >= 0 AND duration_ms <= 3600000)); -- 1 hour ceiling

-- Replace the INSERT policy to include the numeric bounds and a
-- reasonable tool_slug shape (lowercase kebab or digits, no arbitrary text).
DROP POLICY IF EXISTS "insert ops safely" ON public.operations;
CREATE POLICY "insert ops safely" ON public.operations
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(tool_slug) BETWEEN 1 AND 80
  AND tool_slug ~ '^[a-z0-9][a-z0-9-]{0,79}$'
  AND (error IS NULL OR char_length(error) <= 500)
  AND (user_id IS NULL OR user_id = auth.uid())
);

-- Reduce feedback INSERT window: 5000 chars was too permissive for anon.
DROP POLICY IF EXISTS "submit feedback safely" ON public.feedback;
CREATE POLICY "submit feedback safely" ON public.feedback
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(message) BETWEEN 5 AND 2000
  AND (email IS NULL OR char_length(email) <= 200)
  AND (tool_slug IS NULL OR char_length(tool_slug) <= 80)
  AND (rating IS NULL OR (rating BETWEEN 1 AND 5))
  AND (
    (auth.uid() IS NULL AND user_id IS NULL)
    OR (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid()))
  )
);
