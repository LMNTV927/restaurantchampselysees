REVOKE ALL ON FUNCTION public.sync_channel_stats_on_update() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_channel_stats_on_insert() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.decrement_channel_stats_on_delete() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;