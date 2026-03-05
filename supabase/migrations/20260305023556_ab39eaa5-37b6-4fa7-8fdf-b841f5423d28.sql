
-- Allow admins to delete channels
CREATE POLICY "Admins can delete channels"
ON public.channels
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to delete channel_stats
CREATE POLICY "Admins can delete channel_stats"
ON public.channel_stats
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));
