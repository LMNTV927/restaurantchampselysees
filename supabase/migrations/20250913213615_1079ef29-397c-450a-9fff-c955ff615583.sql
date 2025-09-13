-- Modify RLS policies for reservations to allow public read access
-- This is needed for the dashboard and reservations sections to work

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Only authenticated admin users can view reservations" ON public.reservations;

-- Create new policy allowing public read access to reservations
CREATE POLICY "Public can view reservations" 
ON public.reservations 
FOR SELECT 
USING (true);

-- Keep the other policies restrictive for security
-- (Insert is already public, update/delete remain admin-only)