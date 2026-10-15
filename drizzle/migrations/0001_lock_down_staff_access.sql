CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','serveur'))
$$;

DROP POLICY IF EXISTS "Staff can read reservations" ON public.reservations;
DROP POLICY IF EXISTS "Staff can insert reservations" ON public.reservations;
DROP POLICY IF EXISTS "Staff can update reservations" ON public.reservations;
CREATE POLICY "Staff can read reservations" ON public.reservations FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can insert reservations" ON public.reservations FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update reservations" ON public.reservations FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff can read channel_stats" ON public.channel_stats;
DROP POLICY IF EXISTS "Staff can insert channel_stats" ON public.channel_stats;
DROP POLICY IF EXISTS "Staff can update channel_stats" ON public.channel_stats;
CREATE POLICY "Staff can read channel_stats" ON public.channel_stats FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can insert channel_stats" ON public.channel_stats FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update channel_stats" ON public.channel_stats FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Staff can insert channels" ON public.channels;
DROP POLICY IF EXISTS "Staff can update channels" ON public.channels;
CREATE POLICY "Admins can insert channels" ON public.channels FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update channels" ON public.channels FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

REVOKE EXECUTE ON FUNCTION public.decrement_channel_stats_on_delete() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_channel_stats_on_insert() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_channel_stats_on_update() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_channel_reservation(text, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid), public.has_role(uuid, app_role), public.is_staff(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.increment_channel_clicks(text) TO anon, authenticated;