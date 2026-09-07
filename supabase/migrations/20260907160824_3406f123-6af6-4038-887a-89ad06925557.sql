-- Comptage automatique à l'insertion
CREATE OR REPLACE FUNCTION public.increment_channel_stats_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.is_duplicate THEN
    RETURN NEW;
  END IF;
  INSERT INTO public.channel_stats (channel_id, date, clicks, reservations, total_covers)
  VALUES (NEW.channel_id, (NEW.created_at AT TIME ZONE 'Europe/Paris')::date, 0, 1, NEW.guests_count)
  ON CONFLICT (channel_id, date)
  DO UPDATE SET reservations = channel_stats.reservations + 1,
                total_covers = channel_stats.total_covers + NEW.guests_count;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_reservation_insert ON public.reservations;
CREATE TRIGGER on_reservation_insert
AFTER INSERT ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.increment_channel_stats_on_insert();

-- L'ancien RPC devient neutre (évite le double comptage), signature conservée
CREATE OR REPLACE FUNCTION public.increment_channel_reservation(channel_slug text, covers_count integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN;
END;
$$;

-- Décrément sur le bon jour (jour de création, pas jour du repas)
CREATE OR REPLACE FUNCTION public.decrement_channel_stats_on_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.is_duplicate THEN
    RETURN OLD;
  END IF;
  UPDATE public.channel_stats
  SET reservations = GREATEST(COALESCE(reservations, 0) - 1, 0),
      total_covers = GREATEST(COALESCE(total_covers, 0) - OLD.guests_count, 0)
  WHERE channel_id = OLD.channel_id
    AND date = (OLD.created_at AT TIME ZONE 'Europe/Paris')::date;
  RETURN OLD;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_channel_stats_on_insert() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_channel_reservation(text, integer) TO anon, authenticated;