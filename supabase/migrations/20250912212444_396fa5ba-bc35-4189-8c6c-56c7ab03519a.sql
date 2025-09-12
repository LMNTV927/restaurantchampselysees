-- CRITICAL SECURITY FIX: Restrict access to customer personal data
-- Remove public read access from reservations table and implement proper RLS

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Reservations are publicly readable" ON public.reservations;
DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservations;
DROP POLICY IF EXISTS "Anyone can update reservations" ON public.reservations;
DROP POLICY IF EXISTS "Anyone can delete reservations" ON public.reservations;

-- Create user profiles table for role-based access
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM public.profiles 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- SECURE RESERVATIONS POLICIES - Only authenticated admin users can access customer data
CREATE POLICY "Only authenticated admin users can view reservations" 
ON public.reservations FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only authenticated admin users can update reservations" 
ON public.reservations FOR UPDATE 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only authenticated admin users can delete reservations" 
ON public.reservations FOR DELETE 
TO authenticated
USING (public.is_admin());

-- Allow public reservation creation (booking form) but restrict data access
CREATE POLICY "Public can create reservations" 
ON public.reservations FOR INSERT 
WITH CHECK (true);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();