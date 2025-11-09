-- Add commission columns to professions table
ALTER TABLE professions 
ADD COLUMN IF NOT EXISTS commission_category TEXT CHECK (commission_category IN ('A', 'B', 'C', 'D_contractor', 'D_hvac')),
ADD COLUMN IF NOT EXISTS client_retention_days INTEGER DEFAULT 30 CHECK (client_retention_days IN (30, 60, 180)),
ADD COLUMN IF NOT EXISTS commission_explanation TEXT;

-- Category A (10% fixed) - 180 days for long-term projects
UPDATE professions SET commission_category = 'A', client_retention_days = 180, commission_explanation = 'עמלה קבועה של 10% על כל עסקה. הלקוח נשמר למשך 180 יום.' WHERE profession_id IN ('lawyer', 'accountant', 'tax-consultant', 'architect', 'landscape-architect', 'building-engineer', 'house-inspection', 'licensed-surveyor', 'constructor', 'real-estate-appraiser', 'property-appraiser', 'mediator', 'insurance-agent', 'notary', 'real-estate-agent', 'property-management', 'radiation-environment-testing', 'event-production');

-- Category A (10% fixed) - 60 days for personal services
UPDATE professions SET commission_category = 'A', client_retention_days = 60, commission_explanation = 'עמלה קבועה של 10% על כל עסקה. הלקוח נשמר למשך 60 יום.' WHERE profession_id IN ('psychologist', 'emotional-therapist', 'physiotherapy', 'reflexology', 'naturopathy', 'acupuncture', 'dietitian-nutritionist', 'doula', 'lactation-consultant', 'parenting-guidance', 'personal-trainer', 'private-tutor', 'psychometric-instructor', 'arts-teacher', 'private-kindergarten', 'photographer', 'video-editor', 'graphic-designer', 'ui-ux-designer', 'content-writer', 'programmer', 'freelancer', 'website-builder', 'seo-specialist', 'paid-campaign-manager', 'social-media-manager', 'dj', 'host', 'piano-tuning', 'digitization', 'veterinarian', 'dog-training', 'children-entertainment');

-- Category B (10% up to 5,000 | 5% above) - 30 days
UPDATE professions SET commission_category = 'B', client_retention_days = 30, commission_explanation = 'עמלה של 10% על עסקאות עד 5,000 ₪, ו-5% על הסכום מעל 5,001 ₪. הלקוח נשמר למשך 30 יום.' WHERE profession_id IN ('plumber', 'leak-detection', 'electrician', 'height-work', 'subfloor-drying', 'concrete-cutting', 'gardening', 'cleaning', 'tree-trimming', 'moving-company', 'event-attractions');

-- Category C (10% up to 1,000 | 5% above) - 30 days
UPDATE professions SET commission_category = 'C', client_retention_days = 30, commission_explanation = 'עמלה של 10% על עסקאות עד 1,000 ₪, ו-5% על הסכום מעל 1,001 ₪. הלקוח נשמר למשך 30 יום.' WHERE profession_id IN ('locksmith', 'solar-heater-tech', 'waterproofing', 'doors', 'shower-enclosures', 'parquet', 'marble-stone', 'appliance-tech', 'dog-grooming', 'exterminator', 'print-shop', 'aquariums-ponds', 'gas-technician', 'security-cameras', 'intercom-keypad', 'bar-stone', 'catering', 'dog-boarding', 'car-wash', 'towing', 'computer-tech', 'network-tech', 'mobile-tech', 'garage', 'heating-systems', 'solar-systems', 'electric-gates', 'magnet-photography', 'balloon-design', 'active');

-- Category D_contractor (5% up to 100,000 | 2% above) - 180 days
UPDATE professions SET commission_category = 'D_contractor', client_retention_days = 180, commission_explanation = 'עמלה של 5% על עסקאות עד 100,000 ₪, ו-2% על הסכום מעל 100,001 ₪. הלקוח נשמר למשך 180 יום.' WHERE profession_id IN ('handyman', 'contractor', 'swimming-pools');

-- Category D_hvac (8% up to 2,000 | 2% above) - 30 days
UPDATE professions SET commission_category = 'D_hvac', client_retention_days = 30, commission_explanation = 'עמלה של 8% על עסקאות עד 2,000 ₪, ו-2% על הסכום מעל 2,001 ₪. הלקוח נשמר למשך 30 יום.' WHERE profession_id = 'hvac-installer';