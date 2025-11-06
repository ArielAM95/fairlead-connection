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