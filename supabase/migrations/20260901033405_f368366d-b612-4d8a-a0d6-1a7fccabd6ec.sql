UPDATE public.channels SET name = 'IA' WHERE slug = 'google-agenda';
UPDATE public.reservations SET source = 'IA' WHERE source = 'Google Agenda';