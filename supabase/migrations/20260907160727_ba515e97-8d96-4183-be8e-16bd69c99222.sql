-- RESERVATIONS ------------------------------------------------------------
DROP POLICY IF EXISTS "Public read reservations" ON public.reservations;
DROP POLICY IF EXISTS "Public insert reservations" ON public.reservations;
DROP POLICY IF EXISTS "Public update reservations" ON public.reservations;

CREATE POLICY "Staff can read reservations" ON public.reservations
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can insert reservations" ON public.reservations
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff can update reservations" ON public.reservations
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

REVOKE ALL ON public.reservations FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reservations TO authenticated;
GRANT ALL ON public.reservations TO service_role;

-- CHANNELS -----------------------------------------------------------------
DROP POLICY IF EXISTS "Public insert channels" ON public.channels;
DROP POLICY IF EXISTS "Public update channels" ON public.channels;

CREATE POLICY "Staff can insert channels" ON public.channels
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff can update channels" ON public.channels
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

REVOKE ALL ON public.channels FROM anon;
GRANT SELECT ON public.channels TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.channels TO authenticated;
GRANT ALL ON public.channels TO service_role;

-- CHANNEL STATS ------------------------------------------------------------
DROP POLICY IF EXISTS "Public read channel_stats" ON public.channel_stats;
DROP POLICY IF EXISTS "Public insert channel_stats" ON public.channel_stats;
DROP POLICY IF EXISTS "Public update channel_stats" ON public.channel_stats;

CREATE POLICY "Staff can read channel_stats" ON public.channel_stats
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can insert channel_stats" ON public.channel_stats
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff can update channel_stats" ON public.channel_stats
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

REVOKE ALL ON public.channel_stats FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.channel_stats TO authenticated;
GRANT ALL ON public.channel_stats TO service_role;

-- FUNCTION EXECUTION -------------------------------------------------------
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE ALL ON FUNCTION public.get_user_role(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.get_user_role(uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO service_role;
-- tracking RPCs stay callable by visitors (click / reservation counters)
GRANT EXECUTE ON FUNCTION public.increment_channel_clicks(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_channel_reservation(text, integer) TO anon, authenticated;