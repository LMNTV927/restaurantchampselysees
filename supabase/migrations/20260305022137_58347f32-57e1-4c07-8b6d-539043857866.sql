
-- Trigger function: decrement channel_stats when a reservation is deleted
CREATE OR REPLACE FUNCTION public.decrement_channel_stats_on_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.channel_stats
  SET 
    reservations = GREATEST(COALESCE(reservations, 0) - 1, 0),
    total_covers = GREATEST(COALESCE(total_covers, 0) - OLD.guests_count, 0)
  WHERE channel_id = OLD.channel_id
    AND date = OLD.reservation_date;
  RETURN OLD;
END;
$$;

-- Attach the trigger to the reservations table
CREATE TRIGGER on_reservation_delete
  BEFORE DELETE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_channel_stats_on_delete();
