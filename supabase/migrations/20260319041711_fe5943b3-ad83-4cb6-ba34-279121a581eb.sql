
ALTER TABLE public.reservations 
ADD COLUMN modification_token uuid UNIQUE DEFAULT gen_random_uuid();

UPDATE public.reservations SET modification_token = gen_random_uuid() WHERE modification_token IS NULL;

ALTER TABLE public.reservations ALTER COLUMN modification_token SET NOT NULL;
