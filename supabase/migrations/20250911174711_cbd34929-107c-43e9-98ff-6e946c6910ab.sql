-- Add UPDATE and DELETE policies for reservations table to allow status changes
CREATE POLICY "Anyone can update reservations" 
ON public.reservations 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete reservations" 
ON public.reservations 
FOR DELETE 
USING (true);

-- Add DELETE policy for channels table
CREATE POLICY "Anyone can delete channels" 
ON public.channels 
FOR DELETE 
USING (true);