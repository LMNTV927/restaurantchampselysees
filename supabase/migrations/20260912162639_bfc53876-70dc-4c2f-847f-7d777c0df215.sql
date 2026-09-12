CREATE OR REPLACE FUNCTION public.sync_channel_stats_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  d date := (NEW.created_at AT TIME ZONE 'Europe/Paris')::date;
BEGIN
  IF OLD.is_duplicate = NEW.is_duplicate AND OLD.guests_count = NEW.guests_count AND OLD.channel_id = NEW.channel_id THEN
    RETURN NEW;
  END IF;

  -- retirer l'ancienne contribution
  IF NOT OLD.is_duplicate THEN
    UPDATE public.channel_stats
    SET reservations = GREATEST(COALESCE(reservations, 0) - 1, 0),
        total_covers = GREATEST(COALESCE(total_covers, 0) - OLD.guests_count, 0)
    WHERE channel_id = OLD.channel_id
      AND date = (OLD.created_at AT TIME ZONE 'Europe/Paris')::date;
  END IF;

  -- ajouter la nouvelle contribution
  IF NOT NEW.is_duplicate THEN
    INSERT INTO public.channel_stats (channel_id, date, clicks, reservations, total_covers)
    VALUES (NEW.channel_id, d, 0, 1, NEW.guests_count)
    ON CONFLICT (channel_id, date)
    DO UPDATE SET reservations = channel_stats.reservations + 1,
                  total_covers = channel_stats.total_covers + NEW.guests_count;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_reservation_update_stats ON public.reservations;
CREATE TRIGGER on_reservation_update_stats
AFTER UPDATE ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.sync_channel_stats_on_update();

-- Recalcul complet des compteurs de réservations/couverts (les clics restent inchangés)
WITH agg AS (
  SELECT channel_id,
         (created_at AT TIME ZONE 'Europe/Paris')::date AS d,
         COUNT(*) AS res,
         SUM(guests_count) AS covers
  FROM public.reservations
  WHERE is_duplicate = false
  GROUP BY 1, 2
)
INSERT INTO public.channel_stats (channel_id, date, clicks, reservations, total_covers)
SELECT agg.channel_id, agg.d, 0, agg.res, agg.covers FROM agg
ON CONFLICT (channel_id, date)
DO UPDATE SET reservations = EXCLUDED.reservations, total_covers = EXCLUDED.total_covers;

UPDATE public.channel_stats s
SET reservations = 0, total_covers = 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.reservations r
  WHERE r.is_duplicate = false
    AND r.channel_id = s.channel_id
    AND (r.created_at AT TIME ZONE 'Europe/Paris')::date = s.date
) AND (COALESCE(s.reservations,0) <> 0 OR COALESCE(s.total_covers,0) <> 0);