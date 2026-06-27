
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
