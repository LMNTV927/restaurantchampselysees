-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.increment_channel_clicks(channel_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  channel_uuid UUID;
BEGIN
  -- Get channel ID
  SELECT id INTO channel_uuid FROM public.channels WHERE slug = channel_slug AND is_active = true;
  
  IF channel_uuid IS NULL THEN
    RETURN;
  END IF;
  
  -- Insert or update stats
  INSERT INTO public.channel_stats (channel_id, clicks, date)
  VALUES (channel_uuid, 1, CURRENT_DATE)
  ON CONFLICT (channel_id, date)
  DO UPDATE SET 
    clicks = channel_stats.clicks + 1,
    updated_at = now();
END;
$$;

-- Function to increment reservations and covers
CREATE OR REPLACE FUNCTION public.increment_channel_reservation(channel_slug TEXT, covers_count INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  channel_uuid UUID;
BEGIN
  -- Get channel ID
  SELECT id INTO channel_uuid FROM public.channels WHERE slug = channel_slug AND is_active = true;
  
  IF channel_uuid IS NULL THEN
    RETURN;
  END IF;
  
  -- Insert or update stats
  INSERT INTO public.channel_stats (channel_id, reservations, total_covers, date)
  VALUES (channel_uuid, 1, covers_count, CURRENT_DATE)
  ON CONFLICT (channel_id, date)
  DO UPDATE SET 
    reservations = channel_stats.reservations + 1,
    total_covers = channel_stats.total_covers + covers_count,
    updated_at = now();
END;
$$;