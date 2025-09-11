-- Add INSERT and UPDATE policies for channels table to allow creating new channels
CREATE POLICY "Anyone can create channels" 
ON public.channels 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update channels" 
ON public.channels 
FOR UPDATE 
USING (true);