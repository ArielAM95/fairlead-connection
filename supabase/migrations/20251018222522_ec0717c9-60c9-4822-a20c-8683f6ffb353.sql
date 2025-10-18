-- Add new columns for profession hierarchy
ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS main_profession TEXT,
ADD COLUMN IF NOT EXISTS sub_specializations TEXT[];

-- Add comments for documentation
COMMENT ON COLUMN public.professionals.main_profession 
IS 'המקצוע הראשי - בחירה יחידה מתוך 56 מקצועות';

COMMENT ON COLUMN public.professionals.sub_specializations 
IS 'תתי התמחות במסגרת המקצוע הראשי - בחירה מרובה';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_professionals_main_profession 
ON public.professionals(main_profession);

CREATE INDEX IF NOT EXISTS idx_professionals_sub_specializations 
ON public.professionals USING GIN(sub_specializations);