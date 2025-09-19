-- Allow anonymous users to register as professionals with strict security constraints
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
  -- Ensure required fields are provided
  name IS NOT NULL AND
  profession IS NOT NULL AND
  location IS NOT NULL AND
  email IS NOT NULL AND
  phone_number IS NOT NULL
);