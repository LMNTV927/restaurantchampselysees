ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS reminder_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_duplicate boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS duplicate_of uuid NULL REFERENCES public.reservations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_reservations_phone_date ON public.reservations (customer_phone, reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_is_duplicate ON public.reservations (is_duplicate);