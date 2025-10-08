-- Add terms_accepted column to professionals table
ALTER TABLE public.professionals 
ADD COLUMN terms_accepted boolean NOT NULL DEFAULT false;

-- Update the anonymous registration policy to include terms_accepted check
DROP POLICY IF EXISTS "Anonymous users can register as professionals with restrictions" ON public.professionals;

CREATE POLICY "Anonymous users can register as professionals with restrictions" 
ON public.professionals 
FOR INSERT 
TO anon
WITH CHECK (
  -- Ensure security defaults for anonymous registrations
  user_id IS NULL AND
  status = 'pending' AND
  is_verified = false AND
  rating = 0 AND
  review_count = 0 AND
  terms_accepted = true AND  -- Must accept terms to register
  -- Ensure required fields are provided
  name IS NOT NULL AND
  profession IS NOT NULL AND
  location IS NOT NULL AND
  email IS NOT NULL AND
  phone_number IS NOT NULL
);