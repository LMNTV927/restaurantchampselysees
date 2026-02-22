
-- Add source and external_id columns to reservations
ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS source text DEFAULT null,
  ADD COLUMN IF NOT EXISTS external_id text UNIQUE DEFAULT null;
