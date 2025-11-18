-- ============================================================================
-- NEW MIGRATIONS FROM TRANZILA BRANCH
-- ============================================================================
-- Run this SQL in Supabase Dashboard > SQL Editor
-- These migrations include:
-- 1. Fix notification_preferences RLS (registration error fix)
-- 2. Add professions and specializations database tables
-- ============================================================================

-- ============================================================================
-- MIGRATION 1: Fix notification_preferences RLS
-- File: 20251104152916_618d3509-2c50-4535-bcd8-cd641c3aa278.sql
-- ============================================================================

-- Fix notification_preferences RLS issue
-- The trigger function needs SECURITY DEFINER to bypass RLS when creating default preferences

CREATE OR REPLACE FUNCTION public.initialize_notification_preferences()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Create default preferences for all notification types
  INSERT INTO public.notification_preferences (professional_id, notification_type, push_enabled, email_enabled, sms_enabled)
  VALUES
    (NEW.id, 'new_direct_inquiry', true, false, false),
    (NEW.id, 'new_proposal', true, false, false),
    (NEW.id, 'new_lead_in_area', true, false, false),
    (NEW.id, 'proposal_accepted', true, false, false),
    (NEW.id, 'work_completion_reminder', true, false, false),
    (NEW.id, 'reminder', true, false, false),
    (NEW.id, 'commission', true, false, false),
    (NEW.id, 'payment', true, false, false),
    (NEW.id, 'lead_status', true, false, false)
  ON CONFLICT (professional_id, notification_type) DO NOTHING;

  RETURN NEW;
END;
$function$;

-- ============================================================================
-- MIGRATION 2: Add professions and specializations tables
-- File: 20251105223210_f9d906de-0367-49cb-9554-29b5271146a6.sql
-- Note: This is a 844-line migration that creates professions/specializations
-- Copy the FULL contents of this file from:
-- supabase/migrations/20251105223210_f9d906de-0367-49cb-9554-29b5271146a6.sql
-- ============================================================================

-- See the actual file for the full migration (too large to include here)
-- Location: supabase/migrations/20251105223210_f9d906de-0367-49cb-9554-29b5271146a6.sql

-- ============================================================================
-- DONE! Registration should now work without RLS errors.
-- The professions form will now use database-driven data.
-- ============================================================================
