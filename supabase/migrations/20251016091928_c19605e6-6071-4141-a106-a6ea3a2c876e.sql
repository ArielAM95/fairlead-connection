-- Update existing professionals' areas field to Hebrew
-- This migration converts the English region IDs to Hebrew region names

-- First, let's handle simple one-to-one mappings
UPDATE public.professionals 
SET areas = 
  CASE 
    -- Replace exact matches
    WHEN areas = 'north' THEN 'צפון'
    WHEN areas = 'south' THEN 'דרום'
    WHEN areas = 'center' THEN 'מרכז'
    WHEN areas = 'jerusalem' THEN 'ירושלים והסביבה'
    
    -- Map removed regions to closest new regions
    WHEN areas = 'samaria' THEN 'מרכז'
    WHEN areas = 'eilat' THEN 'דרום'
    WHEN areas = 'shfela' THEN 'מרכז'
    WHEN areas = 'sharon' THEN 'חיפה והסביבה'
    
    -- Handle comma-separated values (multiple regions)
    ELSE 
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(areas, 
                      'north', 'צפון'),
                      'south', 'דרום'),
                      'center', 'מרכז'),
                      'jerusalem', 'ירושלים והסביבה'),
                      'samaria', 'מרכז'),
                      'eilat', 'דרום'),
                      'shfela', 'מרכז'),
                      'sharon', 'חיפה והסביבה')
  END
WHERE areas IS NOT NULL 
  AND (
    areas LIKE '%north%' OR 
    areas LIKE '%south%' OR 
    areas LIKE '%center%' OR 
    areas LIKE '%jerusalem%' OR
    areas LIKE '%samaria%' OR
    areas LIKE '%eilat%' OR
    areas LIKE '%shfela%' OR
    areas LIKE '%sharon%'
  );

-- Clean up any potential duplicate commas or spaces
UPDATE public.professionals
SET areas = REGEXP_REPLACE(
  REGEXP_REPLACE(areas, '\s*,\s*', ', ', 'g'),  -- Normalize comma spacing
  ',\s*,', ',', 'g'  -- Remove double commas
)
WHERE areas IS NOT NULL;