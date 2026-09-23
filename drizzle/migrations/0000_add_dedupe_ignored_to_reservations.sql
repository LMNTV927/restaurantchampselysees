ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS dedupe_ignored boolean NOT NULL DEFAULT false;