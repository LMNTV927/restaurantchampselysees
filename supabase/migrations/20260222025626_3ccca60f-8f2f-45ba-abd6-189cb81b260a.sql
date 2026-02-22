
-- Table: channels
CREATE TABLE public.channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: channel_stats
CREATE TABLE public.channel_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  clicks INTEGER DEFAULT 0,
  reservations INTEGER DEFAULT 0,
  total_covers INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(channel_id, date)
);

-- Table: reservations
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  reservation_date DATE NOT NULL,
  reservation_time TEXT NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 2,
  notes TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: channels
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read channels" ON public.channels FOR SELECT USING (true);
CREATE POLICY "Public insert channels" ON public.channels FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update channels" ON public.channels FOR UPDATE USING (true);

-- RLS: channel_stats
ALTER TABLE public.channel_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read channel_stats" ON public.channel_stats FOR SELECT USING (true);
CREATE POLICY "Public insert channel_stats" ON public.channel_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update channel_stats" ON public.channel_stats FOR UPDATE USING (true);

-- RLS: reservations
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reservations" ON public.reservations FOR SELECT USING (true);
CREATE POLICY "Public insert reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update reservations" ON public.reservations FOR UPDATE USING (true);

-- RPC: increment_channel_clicks
CREATE OR REPLACE FUNCTION public.increment_channel_clicks(channel_slug TEXT)
RETURNS void AS $$
DECLARE
  v_channel_id UUID;
BEGIN
  SELECT id INTO v_channel_id FROM public.channels WHERE slug = channel_slug AND is_active = true;
  IF v_channel_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.channel_stats (channel_id, date, clicks)
  VALUES (v_channel_id, CURRENT_DATE, 1)
  ON CONFLICT (channel_id, date)
  DO UPDATE SET clicks = channel_stats.clicks + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- RPC: increment_channel_reservation
CREATE OR REPLACE FUNCTION public.increment_channel_reservation(channel_slug TEXT, covers_count INTEGER)
RETURNS void AS $$
DECLARE
  v_channel_id UUID;
BEGIN
  SELECT id INTO v_channel_id FROM public.channels WHERE slug = channel_slug AND is_active = true;
  IF v_channel_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.channel_stats (channel_id, date, reservations, total_covers)
  VALUES (v_channel_id, CURRENT_DATE, 1, covers_count)
  ON CONFLICT (channel_id, date)
  DO UPDATE SET reservations = channel_stats.reservations + 1, total_covers = channel_stats.total_covers + covers_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.channels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.channel_stats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
