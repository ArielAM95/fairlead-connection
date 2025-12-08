-- ============================================================
-- AFFILIATE SYSTEM - מערכת חבר מביא חבר
-- ============================================================

-- 1. הוספת עמודת affiliate_code לטבלת professionals
ALTER TABLE public.professionals 
ADD COLUMN IF NOT EXISTS affiliate_code TEXT UNIQUE;

-- 2. יצירת טבלת affiliate_registrations
CREATE TABLE IF NOT EXISTS public.affiliate_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  affiliate_code_used TEXT NOT NULL,
  registration_amount NUMERIC(10,2) NOT NULL DEFAULT 413,
  discount_given NUMERIC(10,2) NOT NULL DEFAULT 41.3,
  referrer_bonus NUMERIC(10,2) NOT NULL DEFAULT 41.3,
  bonus_commission_id UUID REFERENCES public.commissions(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'credited')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  credited_at TIMESTAMPTZ,
  UNIQUE(referred_id) -- כל משתמש יכול להיות מופנה רק פעם אחת
);

-- 3. אינדקסים לשיפור ביצועים
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_referrer_id ON public.affiliate_registrations(referrer_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_status ON public.affiliate_registrations(status);
CREATE INDEX IF NOT EXISTS idx_professionals_affiliate_code ON public.professionals(affiliate_code) WHERE affiliate_code IS NOT NULL;

-- 4. Enable RLS
ALTER TABLE public.affiliate_registrations ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies - מקצוענים יכולים לראות רק את ההפניות שלהם
CREATE POLICY "Professionals can view their own referrals" 
ON public.affiliate_registrations 
FOR SELECT 
USING (
  referrer_id IN (
    SELECT id FROM public.professionals WHERE id = referrer_id
  )
);

-- Allow service role full access for edge functions
CREATE POLICY "Service role can manage affiliate registrations" 
ON public.affiliate_registrations 
FOR ALL 
USING (true)
WITH CHECK (true);

-- 6. פונקציה ליצירת קוד affiliate ייחודי
CREATE OR REPLACE FUNCTION public.generate_affiliate_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- יצירת קוד אקראי בפורמט OFAIR-XXXXXX
    new_code := 'OFAIR-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    
    -- בדיקה שהקוד לא קיים
    SELECT EXISTS(SELECT 1 FROM public.professionals WHERE affiliate_code = new_code) INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$;

-- 7. Trigger ליצירת קוד affiliate אוטומטית כשמקצוען משלים תשלום
CREATE OR REPLACE FUNCTION public.auto_generate_affiliate_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- אם סטטוס התשלום השתנה ל-completed ואין עדיין קוד affiliate
  IF NEW.registration_payment_status = 'completed' 
     AND OLD.registration_payment_status IS DISTINCT FROM 'completed'
     AND NEW.affiliate_code IS NULL THEN
    NEW.affiliate_code := public.generate_affiliate_code();
  END IF;
  
  RETURN NEW;
END;
$$;

-- יצירת הטריגר
DROP TRIGGER IF EXISTS trigger_auto_generate_affiliate_code ON public.professionals;
CREATE TRIGGER trigger_auto_generate_affiliate_code
BEFORE UPDATE ON public.professionals
FOR EACH ROW
EXECUTE FUNCTION public.auto_generate_affiliate_code();

-- 8. יצירת קודים למקצוענים קיימים שכבר שילמו
UPDATE public.professionals
SET affiliate_code = public.generate_affiliate_code()
WHERE registration_payment_status = 'completed'
  AND affiliate_code IS NULL;