-- Rename the Google Agenda channel label to IA for display consistency
UPDATE public.channels
SET name = 'IA'
WHERE slug = 'google-agenda';

-- Update existing synced reservations so they show "Via IA" instead of "Via Google Agenda"
UPDATE public.reservations
SET source = 'IA'
WHERE source = 'Google Agenda';
