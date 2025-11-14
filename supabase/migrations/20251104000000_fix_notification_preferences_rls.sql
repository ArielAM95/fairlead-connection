-- Fix RLS policy for notification_preferences table
-- This table is created by a trigger when a new professional is inserted
-- Allow inserts from system/service role during registration

-- Check if table exists and create if not (defensive)
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    professional_id uuid REFERENCES public.professionals(id) ON DELETE CASCADE,
    email_notifications boolean DEFAULT true,
    sms_notifications boolean DEFAULT true,
    push_notifications boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(professional_id)
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow service role to insert notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Allow public inserts during registration" ON public.notification_preferences;
DROP POLICY IF EXISTS "Professionals can read their own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Professionals can update their own notification preferences" ON public.notification_preferences;

-- Policy 1: Allow service role (used by triggers) to insert
CREATE POLICY "Allow service role to insert notification preferences"
ON public.notification_preferences
FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy 2: Allow public inserts during registration (fallback if trigger doesn't exist)
-- This allows the frontend to create notification preferences if needed
CREATE POLICY "Allow public inserts during registration"
ON public.notification_preferences
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 3: Professionals can read their own preferences
CREATE POLICY "Professionals can read their own notification preferences"
ON public.notification_preferences
FOR SELECT
TO authenticated
USING (
  professional_id IN (
    SELECT id FROM public.professionals
    WHERE auth.uid() = id
  )
);

-- Policy 4: Professionals can update their own preferences
CREATE POLICY "Professionals can update their own notification preferences"
ON public.notification_preferences
FOR UPDATE
TO authenticated
USING (
  professional_id IN (
    SELECT id FROM public.professionals
    WHERE auth.uid() = id
  )
)
WITH CHECK (
  professional_id IN (
    SELECT id FROM public.professionals
    WHERE auth.uid() = id
  )
);

-- Create or replace trigger function to auto-create notification preferences
CREATE OR REPLACE FUNCTION public.create_notification_preferences_for_professional()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.notification_preferences (professional_id)
  VALUES (NEW.id)
  ON CONFLICT (professional_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS create_notification_preferences_trigger ON public.professionals;

-- Create trigger to auto-create notification preferences when professional is created
CREATE TRIGGER create_notification_preferences_trigger
AFTER INSERT ON public.professionals
FOR EACH ROW
EXECUTE FUNCTION public.create_notification_preferences_for_professional();

-- Add helpful comment
COMMENT ON TABLE public.notification_preferences IS 'Stores notification preferences for professionals. Auto-created via trigger when professional registers.';
COMMENT ON FUNCTION public.create_notification_preferences_for_professional() IS 'Trigger function that creates notification preferences with defaults when a new professional is inserted. Uses SECURITY DEFINER to bypass RLS.';
