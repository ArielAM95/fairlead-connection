-- ============================================================================
-- FIX: notification_preferences RLS Policy Issue
-- ============================================================================
-- Run this SQL in Supabase Dashboard > SQL Editor
-- This fixes the "new row violates row-level security policy" error during registration
-- ============================================================================

-- Step 1: Create table if it doesn't exist
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

-- Step 2: Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies (cleanup)
DROP POLICY IF EXISTS "Allow service role to insert notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Allow public inserts during registration" ON public.notification_preferences;
DROP POLICY IF EXISTS "Professionals can read their own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Professionals can update their own notification preferences" ON public.notification_preferences;

-- Step 4: Create RLS policies

-- Policy 1: Allow service role (used by triggers) to insert
CREATE POLICY "Allow service role to insert notification preferences"
ON public.notification_preferences
FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy 2: Allow public inserts during registration (fallback)
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

-- Step 5: Create trigger function with SECURITY DEFINER
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

-- Step 6: Drop existing trigger if exists
DROP TRIGGER IF EXISTS create_notification_preferences_trigger ON public.professionals;

-- Step 7: Create trigger on professionals table
CREATE TRIGGER create_notification_preferences_trigger
AFTER INSERT ON public.professionals
FOR EACH ROW
EXECUTE FUNCTION public.create_notification_preferences_for_professional();

-- Step 8: Add comments for documentation
COMMENT ON TABLE public.notification_preferences IS 'Stores notification preferences for professionals. Auto-created via trigger when professional registers.';
COMMENT ON FUNCTION public.create_notification_preferences_for_professional() IS 'Trigger function that creates notification preferences with defaults when a new professional is inserted. Uses SECURITY DEFINER to bypass RLS.';

-- ============================================================================
-- DONE! Registration form should now work without RLS errors.
-- ============================================================================
