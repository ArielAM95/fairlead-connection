-- Create contact_inquiries table to store Contact Us submissions
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  message TEXT,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Policies
-- Allow anyone to submit a contact inquiry (public-facing form)
DROP POLICY IF EXISTS "Anyone can insert contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Anyone can insert contact inquiries"
ON public.contact_inquiries
FOR INSERT
WITH CHECK (true);

-- Allow internal CRM users to view inquiries
DROP POLICY IF EXISTS "Internal users can view contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Internal users can view contact inquiries"
ON public.contact_inquiries
FOR SELECT
USING (public.is_internal_user_check());

-- Allow super admins to update/delete if needed
DROP POLICY IF EXISTS "Super admins can modify contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Super admins can modify contact inquiries"
ON public.contact_inquiries
FOR UPDATE
USING (public.is_internal_super_admin_check());

DROP POLICY IF EXISTS "Super admins can delete contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Super admins can delete contact inquiries"
ON public.contact_inquiries
FOR DELETE
USING (public.is_internal_super_admin_check());

-- Helpful index for sorting/filtering
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at
  ON public.contact_inquiries (created_at DESC);
