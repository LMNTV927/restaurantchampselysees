CREATE UNIQUE INDEX IF NOT EXISTS reservations_source_external_id_key
  ON public.reservations (source, external_id)
  WHERE external_id IS NOT NULL;