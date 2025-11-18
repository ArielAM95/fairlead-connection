-- Create professions table
CREATE TABLE IF NOT EXISTS professions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profession_id TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profession_specializations table
CREATE TABLE IF NOT EXISTS profession_specializations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profession_id UUID NOT NULL REFERENCES professions(id) ON DELETE CASCADE,
  specialization_id TEXT NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_professions_display_order ON professions(display_order);
CREATE INDEX IF NOT EXISTS idx_professions_is_active ON professions(is_active);
CREATE INDEX IF NOT EXISTS idx_specializations_profession_id ON profession_specializations(profession_id);
CREATE INDEX IF NOT EXISTS idx_specializations_display_order ON profession_specializations(display_order);

-- Enable RLS
ALTER TABLE professions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profession_specializations ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Everyone can read
CREATE POLICY "Anyone can view active professions"
  ON professions FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active specializations"
  ON profession_specializations FOR SELECT
  USING (is_active = true);

-- Only super admins can manage
CREATE POLICY "Super admins can manage professions"
  ON professions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() AND is_super_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() AND is_super_admin = true
  ));

CREATE POLICY "Super admins can manage specializations"
  ON profession_specializations FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() AND is_super_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() AND is_super_admin = true
  ));

-- Insert all 96 professions with their specializations
DO $$
DECLARE
  prof_id UUID;
BEGIN
  -- 1. אינסטלטור
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('plumber', 'אינסטלטור', 1) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'unclog', 'פתיחת סתימות', 1),
    (prof_id, 'replace-fixtures', 'החלפת כלים סניטריים', 2),
    (prof_id, 'greywater', 'התקנת מערכות מים אפורים', 3),
    (prof_id, 'replace-pipes', 'החלפת צנרת', 4),
    (prof_id, 'other', 'אחר', 99);

  -- 2. איתור נזילות
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('leak-detection', 'איתור נזילות', 2) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 3. חשמלאי
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('electrician', 'חשמלאי', 3) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'safety-checks', 'בדיקות תקינות', 1),
    (prof_id, 'panels', 'התקנת לוחות חשמל', 2),
    (prof_id, 'smart-electric', 'חשמל חכם', 3),
    (prof_id, 'fixtures', 'התקנת אביזרי חשמל', 4),
    (prof_id, 'other', 'אחר', 99);

  -- 4. שיפוצניק
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('handyman', 'שיפוצניק', 4) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'general', 'שיפוץ כללי', 1),
    (prof_id, 'paint-interior', 'צבע פנים', 2),
    (prof_id, 'paint-exterior', 'צבע חוץ', 3),
    (prof_id, 'drywall', 'גבס', 4),
    (prof_id, 'flooring', 'ריצוף', 5),
    (prof_id, 'stone-cladding', 'חיפוי אבן', 6),
    (prof_id, 'demolition', 'שבירת קירות', 7),
    (prof_id, 'wallpaper', 'טפטים', 8),
    (prof_id, 'finishing', 'תיקוני גמר', 9),
    (prof_id, 'other', 'אחר', 99);

  -- 5. מתקין מערכות מיזוג
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('hvac-installer', 'מתקין מערכות מיזוג', 5) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'regular-ac', 'התקנת מזגן רגיל', 1),
    (prof_id, 'mini-central', 'מיני מרכזי', 2),
    (prof_id, 'vrf', 'VRF', 3),
    (prof_id, 'ac-repair', 'תיקוני מזגנים', 4),
    (prof_id, 'ac-cleaning', 'ניקוי מזגנים פנימי', 5),
    (prof_id, 'other', 'אחר', 99);

  -- 6. מנעולן
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('locksmith', 'מנעולן', 6) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'door-lockout', 'פריצת דלתות', 1),
    (prof_id, 'cylinder-replace', 'החלפת צילינדר', 2),
    (prof_id, 'car-lockout', 'פריצת רכבים', 3),
    (prof_id, 'smart-locks', 'התקנת מנעולים חכמים', 4),
    (prof_id, 'other', 'אחר', 99);

  -- 7. טכנאי דודי שמש
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('solar-heater-tech', 'טכנאי דודי שמש', 7) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'repair', 'תיקון דודים', 1),
    (prof_id, 'install', 'התקנה', 2),
    (prof_id, 'maintenance', 'תחזוקה', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 8. טכנאי מכשירי חשמל
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('appliance-tech', 'טכנאי מכשירי חשמל', 8) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'washing-machine', 'מכונות כביסה', 1),
    (prof_id, 'dishwasher', 'מדיחי כלים', 2),
    (prof_id, 'oven-microwave', 'תנורים ומיקרוגלים', 3),
    (prof_id, 'dryer', 'מייבשים', 4),
    (prof_id, 'fridge', 'מקררים', 5),
    (prof_id, 'tv', 'טלוויזיות', 6),
    (prof_id, 'other', 'אחר', 99);

  -- 9. קבלן בנייה
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('contractor', 'קבלן בנייה', 9) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'structure', 'שלד', 1),
    (prof_id, 'finishing', 'גמר', 2),
    (prof_id, 'turnkey', 'מפתח', 3),
    (prof_id, 'earthwork', 'עבודות עפר', 4),
    (prof_id, 'other', 'אחר', 99);

  -- 10. קונסטרוקטור
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('constructor', 'קונסטרוקטור', 10) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'concrete', 'מבני בטון', 1),
    (prof_id, 'steel', 'מבני פלדה', 2),
    (prof_id, 'infrastructure', 'תשתיות', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 11. מהנדס בניין
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('building-engineer', 'מהנדס בניין', 11) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'execution', 'מהנדס ביצוע', 1),
    (prof_id, 'project-manager', 'מנהל פרויקט', 2),
    (prof_id, 'inspector', 'מפקח בנייה', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 12. בדק בית
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('home-inspector', 'בדק בית', 12) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'engineering-opinion', 'חוות דעת הנדסית', 1),
    (prof_id, 'other', 'אחר', 99);

  -- 13. מודד מוסמך
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('surveyor', 'מודד מוסמך', 13) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'area-survey', 'מודד שטחים', 1),
    (prof_id, 'construction', 'מדידות לבנייה', 2),
    (prof_id, 'survey-files', 'תיקי מדידה', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 14. אדריכל
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('architect', 'אדריכל', 14) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'house-planning', 'תכנון בתים', 1),
    (prof_id, 'additions', 'תוספות בנייה', 2),
    (prof_id, 'permits', 'הגשות לעירייה', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 15. איטום
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('waterproofing', 'איטום', 15) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'roofs-walls', 'גגות וקירות חוץ', 1),
    (prof_id, 'balconies', 'מרפסות', 2),
    (prof_id, 'bathrooms', 'חדרי רחצה', 3),
    (prof_id, 'basements', 'מרתפים', 4),
    (prof_id, 'inspection', 'בדיקות איתור כשלי איטום', 5),
    (prof_id, 'other', 'אחר', 99);

  -- 16. עבודות בגובה
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('height-work', 'עבודות בגובה', 16) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'window-cleaning', 'שטיפות חלונות', 1),
    (prof_id, 'facade-maintenance', 'תחזוקת מעטפת', 2),
    (prof_id, 'cladding-repair', 'תיקוני חיפוי', 3),
    (prof_id, 'special-install', 'התקנות מיוחדות', 4),
    (prof_id, 'other', 'אחר', 99);

  -- 17. ניסור וקידוח בטון
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('concrete-cutting', 'ניסור וקידוח בטון', 17) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'openings', 'פתחים בדפנות/תקרות', 1),
    (prof_id, 'diamond-sawing', 'ניסור יהלום', 2),
    (prof_id, 'core-drilling', 'קידוחי ליבה', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 18. דלתות
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('doors', 'דלתות', 18) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'install', 'התקנת דלתות', 1),
    (prof_id, 'coating', 'ציפוי דלתות', 2),
    (prof_id, 'repair', 'תיקונים ושדרוגים', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 19. מקלחונים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('shower-enclosures', 'מקלחונים', 19) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'manufacture-install', 'ייצור והתקנה', 1),
    (prof_id, 'repair-seals', 'תיקונים ואטמים', 2),
    (prof_id, 'other', 'אחר', 99);

  -- 20. פרקטים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('parquet', 'פרקטים', 20) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'install', 'התקנה', 1),
    (prof_id, 'refinish', 'חידוש/ליטוש', 2),
    (prof_id, 'repair', 'תיקונים', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 21. שיש ואבן
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('marble-stone', 'שיש ואבן', 21) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'kitchen-counters', 'משטחי מטבח', 1),
    (prof_id, 'wall-floor-cladding', 'חיפויי קיר/רצפה', 2),
    (prof_id, 'repair-polish', 'תיקונים וליטוש', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 22. מערכות חימום לבית
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('heating-systems', 'מערכות חימום לבית', 22) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'underfloor', 'חימום תת־רצפתי', 1),
    (prof_id, 'fireplace-boiler', 'קמינים/דודי קיטור', 2),
    (prof_id, 'radiators', 'רדיאטורים', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 23. מצלמות ואזעקות
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('security-cameras', 'מצלמות ואזעקות', 23) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'cameras', 'מצלמות אבטחה', 1),
    (prof_id, 'alarm-systems', 'מערכות אזעקה', 2),
    (prof_id, 'infrastructure-nvr', 'תשתיות ו־NVR', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 24. אינטרקום וקודנים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('intercom-keypad', 'אינטרקום וקודנים', 24) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'intercom-install', 'התקנה ושדרוג אינטרקום', 1),
    (prof_id, 'video-ip', 'וידאו/IP', 2),
    (prof_id, 'keypads-gates', 'קודנים ושערים', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 25. טכנאי גז
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('gas-technician', 'טכנאי גז', 25) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'leak-tests', 'בדיקות דלף', 1),
    (prof_id, 'install', 'התקנות', 2),
    (prof_id, 'relocate', 'העתקות נקודות', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 26. שערים חשמליים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('electric-gates', 'שערים חשמליים', 26) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'parking-sliding', 'שערי חניה/הזזה', 1),
    (prof_id, 'repair-motors', 'תיקונים ומנועים', 2),
    (prof_id, 'remotes-control', 'שלטים ובקרות', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 27. מערכות סולריות
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('solar-systems', 'מערכות סולריות', 27) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'design-install', 'תכנון והתקנה', 1),
    (prof_id, 'maintenance', 'תחזוקה', 2),
    (prof_id, 'monitoring', 'ניטור תקלות', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 28. בדיקות קרינה וסביבה
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('radiation-environment', 'בדיקות קרינה וסביבה', 28) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'non-ionizing', 'קרינה לא יוננת', 1),
    (prof_id, 'noise-pollution', 'רעש וזיהום אוויר', 2),
    (prof_id, 'reports', 'דוחות והמלצות', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 29. גינון
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('gardening', 'גינון', 29) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'maintenance', 'טיפוח', 1),
    (prof_id, 'synthetic-grass', 'דשא סינתטי', 2),
    (prof_id, 'real-grass', 'דשא אמיתי', 3),
    (prof_id, 'garden-setup', 'הקמת גינות', 4),
    (prof_id, 'upkeep', 'תחזוקה', 5),
    (prof_id, 'irrigation', 'השקיה אוטומטית', 6),
    (prof_id, 'tree-pruning', 'גיזום עצים', 7),
    (prof_id, 'other', 'אחר', 99);

  -- 30. אדריכל נוף
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('landscape-architect', 'אדריכל נוף', 30) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'gardens', 'גינות', 1),
    (prof_id, 'environmental', 'פיתוח סביבתי', 2),
    (prof_id, 'other', 'אחר', 99);

  -- 31. מדביר
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('exterminator', 'מדביר', 31) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'green-pest', 'הדברה ירוקה', 1),
    (prof_id, 'termites', 'טרמיטים', 2),
    (prof_id, 'rodents', 'מכרסמים', 3),
    (prof_id, 'bedbugs', 'תיקנים', 4),
    (prof_id, 'other', 'אחר', 99);

  -- 32. ניקיון
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('cleaning', 'ניקיון', 32) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'residential', 'דירות מגורים', 1),
    (prof_id, 'offices', 'משרדים', 2),
    (prof_id, 'sofa-cleaning', 'ניקוי ספות', 3),
    (prof_id, 'polish', 'פוליש', 4),
    (prof_id, 'wax', 'ווקס', 5),
    (prof_id, 'other', 'אחר', 99);

  -- 33. אקווריומים ובריכות נוי
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('aquariums-ponds', 'אקווריומים ובריכות נוי', 33) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'design-setup', 'תכנון והקמה', 1),
    (prof_id, 'maintenance', 'תחזוקה', 2),
    (prof_id, 'filtration-pumps', 'סינון ומשאבות', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 34. בריכות שחייה
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('swimming-pools', 'בריכות שחייה', 34) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'construction', 'הקמה', 1),
    (prof_id, 'maintenance-operation', 'תחזוקה ותפעול', 2),
    (prof_id, 'other', 'אחר', 99);

  -- 35. רואה חשבון
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('accountant', 'רואה חשבון', 35) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'annual-reports', 'דוחות שנתיים', 1),
    (prof_id, 'bookkeeping', 'הנהלת חשבונות', 2),
    (prof_id, 'business-registration', 'פתיחת עוסק', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 36. יועץ מס
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('tax-consultant', 'יועץ מס', 36) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'tax-refunds', 'החזרי מס', 1),
    (prof_id, 'tax-planning', 'תכנון מס', 2),
    (prof_id, 'annual-reports', 'דוחות שנתיים', 3),
    (prof_id, 'bookkeeping', 'הנהלת חשבונות', 4),
    (prof_id, 'business-registration', 'פתיחת עוסק', 5),
    (prof_id, 'other', 'אחר', 99);

  -- 37. עורך דין
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('lawyer', 'עורך דין', 37) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'real-estate', 'נדל״ן', 1),
    (prof_id, 'family-law', 'דיני משפחה', 2),
    (prof_id, 'criminal', 'פלילי', 3),
    (prof_id, 'execution', 'הוצאה לפועל', 4),
    (prof_id, 'contracts', 'חוזים', 5),
    (prof_id, 'labor-law', 'דיני עבודה', 6),
    (prof_id, 'commercial', 'מסחרי', 7),
    (prof_id, 'land', 'מקרקעין', 8),
    (prof_id, 'torts', 'נזיקין', 9),
    (prof_id, 'traffic', 'תעבורה', 10),
    (prof_id, 'debt-handling', 'טיפול בחובות', 11),
    (prof_id, 'other', 'אחר', 99);

  -- 38. שמאי מקרקעין
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('appraiser', 'שמאי מקרקעין', 38) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'apartment-appraisal', 'שומות לדירות', 1),
    (prof_id, 'value-opinion', 'חוות דעת שווי נכס', 2),
    (prof_id, 'other', 'אחר', 99);

  -- 39. מגשר
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('mediator', 'מגשר', 39) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'divorce', 'גירושין', 1),
    (prof_id, 'business-disputes', 'סכסוכים עסקיים', 2),
    (prof_id, 'other', 'אחר', 99);

  -- 40. סוכן ביטוח
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('insurance-agent', 'סוכן ביטוח', 40) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'life', 'ביטוח חיים', 1),
    (prof_id, 'health', 'ביטוח בריאות', 2),
    (prof_id, 'home', 'ביטוח דירה', 3),
    (prof_id, 'car', 'ביטוח רכב', 4),
    (prof_id, 'other', 'אחר', 99);

  -- 41. נוטריון
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('notary', 'נוטריון', 41) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 42. מתווך נדל״ן
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('realtor', 'מתווך נדל״ן', 42) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 43. שמאי רכוש
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('property-appraiser', 'שמאי רכוש', 43) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 44. פסיכולוג
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('psychologist', 'פסיכולוג', 44) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'clinical', 'קליני', 1),
    (prof_id, 'children', 'ילדים', 2),
    (prof_id, 'adolescents', 'נוער', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 45. מטפל רגשי
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('emotional-therapist', 'מטפל רגשי', 45) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'cbt', 'CBT', 1),
    (prof_id, 'nlp', 'NLP', 2),
    (prof_id, 'couples', 'טיפול זוגי', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 46. מאמן אישי
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('personal-coach', 'מאמן אישי', 46) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 47. פיזיותרפיה
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('physiotherapy', 'פיזיותרפיה', 47) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 48. רפלקסולוגיה
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('reflexology', 'רפלקסולוגיה', 48) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 49. נטורופתיה
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('naturopathy', 'נטורופתיה', 49) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 50. דיקור סיני
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('acupuncture', 'דיקור סיני', 50) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 51. דיאטנית/תזונאית
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('dietitian', 'דיאטנית/תזונאית', 51) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 52. דולה
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('doula', 'דולה', 52) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 53. יועצת הנקה
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('lactation-consultant', 'יועצת הנקה', 53) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 54. הדרכת הורים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('parenting-counselor', 'הדרכת הורים', 54) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 55. מורה פרטי
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('private-tutor', 'מורה פרטי', 55) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'math', 'מתמטיקה', 1),
    (prof_id, 'english', 'אנגלית', 2),
    (prof_id, 'physics', 'פיזיקה', 3),
    (prof_id, 'computers', 'מחשבים', 4),
    (prof_id, 'chemistry', 'כימיה', 5),
    (prof_id, 'bagrut-prep', 'הכנה לבגרויות', 6),
    (prof_id, 'high-school', 'תיכון', 7),
    (prof_id, 'elementary', 'יסודי', 8),
    (prof_id, 'other', 'אחר', 99);

  -- 56. מדריך פסיכומטרי
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('psychometric-tutor', 'מדריך פסיכומטרי', 56) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 57. מורה לאומנויות
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('arts-teacher', 'מורה לאומנויות', 57) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'painting', 'ציור', 1),
    (prof_id, 'sculpture', 'פיסול', 2),
    (prof_id, 'drama', 'דרמה', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 58. גננת פרטית / מטפלת
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('private-kindergarten', 'גננת פרטית / מטפלת', 58) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 59. קוסמטיקאית
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('cosmetician', 'קוסמטיקאית', 59) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'facial', 'טיפולי פנים', 1),
    (prof_id, 'hair-removal', 'הסרת שיער', 2),
    (prof_id, 'peeling', 'פילינג', 3),
    (prof_id, 'eyebrow-design', 'עיצוב גבות', 4),
    (prof_id, 'other', 'אחר', 99);

  -- 60. ספר / מעצב שיער
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('hairstylist', 'ספר / מעצב שיער', 60) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'women', 'נשים', 1),
    (prof_id, 'men', 'גברים', 2),
    (prof_id, 'bride', 'תסרוקות כלה', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 61. מאפרת
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('makeup-artist', 'מאפרת', 61) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 62. בניית ציפורניים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('nail-technician', 'בניית ציפורניים', 62) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 63. צלם
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('photographer', 'צלם', 63) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'events', 'אירועים', 1),
    (prof_id, 'studio', 'סטודיו', 2),
    (prof_id, 'brand', 'תדמית', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 64. עורך וידאו
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('video-editor', 'עורך וידאו', 64) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 65. גרפיקאי
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('graphic-designer', 'גרפיקאי', 65) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 66. בונה אתרים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('website-builder', 'בונה אתרים', 66) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 67. מקדם אתרים (SEO)
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('seo-specialist', 'מקדם אתרים (SEO)', 67) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 68. מנהל קמפיינים ממומנים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('ppc-manager', 'מנהל קמפיינים ממומנים', 68) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 69. ניהול סושיאל
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('social-media-manager', 'ניהול סושיאל', 69) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 70. כתיבת תוכן
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('content-writer', 'כתיבת תוכן', 70) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 71. מעצב UX/UI
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('ux-ui-designer', 'מעצב UX/UI', 71) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 72. מתכנת פרילנסר
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('freelance-developer', 'מתכנת פרילנסר', 72) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 73. בית דפוס
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('printing-house', 'בית דפוס', 73) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 74. דיגיטציה
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('digitization', 'דיגיטציה', 74) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 75. מעבדת סלולר
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('mobile-lab', 'מעבדת סלולר', 75) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 76. טכנאי מחשבים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('computer-technician', 'טכנאי מחשבים', 76) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 77. טכנאי רשתות
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('network-technician', 'טכנאי רשתות', 77) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 78. חברת הובלות
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('moving-company', 'חברת הובלות', 78) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'apartment', 'דירה', 1),
    (prof_id, 'office', 'משרדים', 2),
    (prof_id, 'small-moves', 'הובלות קטנות', 3),
    (prof_id, 'storage', 'אחסון', 4),
    (prof_id, 'other', 'אחר', 99);

  -- 79. מוסך
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('garage', 'מוסך', 79) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'mobile', 'מוסך נייד', 1),
    (prof_id, 'repairs', 'תיקונים', 2),
    (prof_id, 'routine', 'טיפולים שוטפים', 3),
    (prof_id, 'body-work', 'פחחות רכב', 4),
    (prof_id, 'auto-electric', 'חשמל לרכב', 5),
    (prof_id, 'auto-ac', 'מיזוג אוויר לרכב', 6),
    (prof_id, 'transmission', 'מכוני גירים', 7),
    (prof_id, 'windshield', 'זגגות', 8),
    (prof_id, 'motorcycles', 'אופנועים', 9),
    (prof_id, 'other', 'אחר', 99);

  -- 80. שירותי גרירה
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('towing-service', 'שירותי גרירה', 80) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 81. שטיפת רכבים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('car-wash', 'שטיפת רכבים', 81) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'home-service', 'עד הבית', 1),
    (prof_id, 'exterior-interior', 'חוץ ופנים', 2),
    (prof_id, 'detailing', 'דיטיילינג', 3),
    (prof_id, 'protective-coating', 'ציפויי מגן', 4),
    (prof_id, 'other', 'אחר', 99);

  -- 82. DJ
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('dj', 'DJ', 82) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 83. שירותי קייטרינג
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('catering', 'שירותי קייטרינג', 83) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'platters', 'מגשי אירוח', 1),
    (prof_id, 'events', 'אירועים', 2),
    (prof_id, 'corporate', 'אירועי חברה', 3),
    (prof_id, 'other', 'אחר', 99);

  -- 84. בר אקטיבי
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('active-bar', 'בר אקטיבי', 84) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 85. הפעלות לילדים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('kids-entertainment', 'הפעלות לילדים', 85) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'inflatables', 'מתנפחים', 1),
    (prof_id, 'machines', 'מכונות', 2),
    (prof_id, 'clown', 'ליצן', 3),
    (prof_id, 'magician', 'קוסם', 4),
    (prof_id, 'other', 'אחר', 99);

  -- 86. עיצוב בלונים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('balloon-design', 'עיצוב בלונים', 86) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 87. צילום מגנטים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('magnet-photography', 'צילום מגנטים', 87) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 88. הפקת אירועים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('event-production', 'הפקת אירועים', 88) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 89. מנחה אירועים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('event-host', 'מנחה אירועים', 89) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 90. אטרקציות לאירועים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('event-attractions', 'אטרקציות לאירועים', 90) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 91. אילוף כלבים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('dog-training', 'אילוף כלבים', 91) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 92. מספרת כלבים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('dog-grooming', 'מספרת כלבים', 92) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 93. פנסיון לכלבים
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('dog-boarding', 'פנסיון לכלבים', 93) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 94. וטרינר
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('veterinarian', 'וטרינר', 94) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 95. חברת אחזקה
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('maintenance-company', 'חברת אחזקה', 95) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

  -- 96. אחר
  INSERT INTO professions (profession_id, label, display_order) 
  VALUES ('other-profession', 'אחר', 96) RETURNING id INTO prof_id;
  INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order) VALUES
    (prof_id, 'other', 'אחר', 99);

END $$;