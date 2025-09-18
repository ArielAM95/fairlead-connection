-- Fix infinite recursion in professionals table RLS policy
-- Drop the problematic policy that checks for existing users
DROP POLICY IF EXISTS "Authenticated users can create their own professional profile" ON public.professionals;

-- Create a new, simpler policy that doesn't cause recursion
CREATE POLICY "Authenticated users can create their own professional profile" 
ON public.professionals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add unique constraint on user_id if it doesn't exist to prevent duplicates
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'professionals_user_id_key' 
        AND conrelid = 'public.professionals'::regclass
    ) THEN
        ALTER TABLE public.professionals ADD CONSTRAINT professionals_user_id_key UNIQUE (user_id);
    END IF;
END $$;