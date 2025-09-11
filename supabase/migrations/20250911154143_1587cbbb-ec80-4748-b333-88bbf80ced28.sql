-- Create channels table for booking links
CREATE TABLE public.channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES public.channels(id),
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests_count INTEGER NOT NULL CHECK (guests_count > 0),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'show', 'no_show', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create channel_stats table for tracking
CREATE TABLE public.channel_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES public.channels(id),
  clicks INTEGER NOT NULL DEFAULT 0,
  reservations INTEGER NOT NULL DEFAULT 0,
  total_covers INTEGER NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(channel_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public booking system)
CREATE POLICY "Channels are publicly accessible" 
ON public.channels 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can create reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Reservations are publicly readable" 
ON public.reservations 
FOR SELECT 
USING (true);

CREATE POLICY "Channel stats are publicly readable" 
ON public.channel_stats 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update channel stats" 
ON public.channel_stats 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can increment channel stats" 
ON public.channel_stats 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_channels_updated_at
BEFORE UPDATE ON public.channels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_channel_stats_updated_at
BEFORE UPDATE ON public.channel_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample channels
INSERT INTO public.channels (name, slug, description) VALUES
('Google Ads', 'google-ads', 'Réservations via Google Ads'),
('Facebook', 'facebook', 'Réservations via Facebook'),
('Instagram', 'instagram', 'Réservations via Instagram'),
('Site Web', 'website', 'Réservations via le site web'),
('Email Marketing', 'email', 'Réservations via email marketing');

-- Function to increment channel clicks
CREATE OR REPLACE FUNCTION public.increment_channel_clicks(channel_slug TEXT)
RETURNS void
LANGUAGE plpgsql
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