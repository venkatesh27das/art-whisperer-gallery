-- Create admin roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user has a role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.is_admin());

-- Update paintings RLS policies: public can view, only admins can modify
DROP POLICY IF EXISTS "Anyone can insert paintings" ON public.paintings;
DROP POLICY IF EXISTS "Anyone can update paintings" ON public.paintings;
DROP POLICY IF EXISTS "Anyone can delete paintings" ON public.paintings;

-- Only admins can insert paintings
CREATE POLICY "Admins can insert paintings"
ON public.paintings
FOR INSERT
WITH CHECK (public.is_admin());

-- Only admins can update paintings
CREATE POLICY "Admins can update paintings"
ON public.paintings
FOR UPDATE
USING (public.is_admin());

-- Only admins can delete paintings
CREATE POLICY "Admins can delete paintings"
ON public.paintings
FOR DELETE
USING (public.is_admin());