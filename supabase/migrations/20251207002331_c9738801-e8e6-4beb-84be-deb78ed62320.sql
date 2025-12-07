-- Add missing specializations from static file to database
INSERT INTO profession_specializations (profession_id, specialization_id, label, display_order, is_active)
VALUES 
  -- חשמלאי - 3 specializations
  ('a21f3cde-b218-40ac-a3b3-25baf42c71bf', 'licensed-electrician', 'חשמלאי מוסמך', 1, true),
  ('a21f3cde-b218-40ac-a3b3-25baf42c71bf', 'master-electrician', 'חשמלאי ראשי', 2, true),
  ('a21f3cde-b218-40ac-a3b3-25baf42c71bf', 'lighting-installation', 'התקנת גופי תאורה', 3, true),
  -- גינון - 1 specialization
  ('d088dd0a-45c9-4929-b644-cd1a460fcbaf', 'decks-pergolas', 'דקים ופרגולות', 9, true),
  -- מדביר - 1 specialization
  ('912d9f2d-12c8-47c4-9417-b44081e965fc', 'mosquitoes', 'יתושים', 6, true),
  -- ניקיון - 1 specialization
  ('7599f316-b7ad-47dc-933a-0b0d760c9766', 'post-renovation', 'לאחר שיפוץ', 7, true);