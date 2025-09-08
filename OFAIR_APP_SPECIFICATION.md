# 🏗️ אפיון מלא - אפליקציית OFAIR 

## 📋 תיאור כללי
**OFAIR** הוא פלטפורמה דיגיטלית המחברת בין מקצוענים לקהל הרחב, מאפשרת חלוקת לידים, קבלת הצעות מחיר, וניהול פרויקטים מקצועיים.

---

## 🌐 **דפי האפליקציה (Frontend Pages)**

### 1. **דף הבית (Index Page) - `/`**
- **מטרה**: דף נחיתה ראשי לגיוס מקצוענים חדשים
- **רכיבים עיקריים**:
  - HeroSection - סקשן פתיחה עם וידיאו רקע
  - WhatIsSection - הסבר מה זה OFAIR
  - ProblemsSection - בעיות שהפלטפורמה פותרת
  - BenefitsSection - יתרונות השימוש
  - HowItWorksSection - איך זה עובד (3 שלבים)
  - BusinessModelSection - מודל העסקי
  - AppShowcaseSection - תצוגת האפליקציה
  - ContactSection - טופס יצירת קשר
  - CtaSection - טופס הרשמה מקצוענים
  - Footer - כותרת תחתונה

### 2. **דף תנאי שימוש - `/terms`**
- **מטרה**: הצגת תנאי השימוש של הפלטפורמה
- **תוכן**: תנאים משפטיים מפורטים

### 3. **דף 404 - `/*` (fallback)**
- **מטרה**: טיפול בכתובות לא קיימות
- **תוכן**: הודעת שגיאה ולינק לחזרה לדף הבית

---

## 🗄️ **מסד הנתונים - טבלאות Supabase**

### **👥 ניהול משתמשים ומקצוענים**

#### `professionals` - מקצוענים רשומים
```sql
- id (uuid, PK)
- user_id (uuid) - קישור למשתמש AUTH
- name (text) - שם מלא
- profession (text) - מקצוע
- location (text) - מיקום
- phone_number (text) - טלפון
- email (text) - אימייל
- specialties (text[]) - התמחויות
- rating (numeric) - דירוג ממוצע
- review_count (integer) - מספר ביקורות
- is_verified (boolean) - אימות
- status (text) - סטטוס (pending/approved/active)
- experience_range (text) - ותק
- company_name (text) - שם חברה
- about (text) - תיאור
- image (text) - תמונת פרופיל
- marketing_consent (boolean) - הסכמה לשיווק
- created_at, updated_at - תאריכים
```

#### `user_profiles` - פרופילי לקוחות
```sql
- id (uuid, PK)
- name (text) - שם
- phone (text) - טלפון
- email (text) - אימייל
- address (text) - כתובת
- created_at, updated_at
```

#### `admin_users` - מנהלי מערכת
```sql
- id (uuid, PK)
- user_id (uuid) - קישור למשתמש AUTH
- is_super_admin (boolean) - הרשאות סופר אדמין
- created_at, updated_at
```

#### `internal_crm` - צוות פנימי
```sql
- id (uuid, PK)
- user_id (uuid) - משתמש
- email (text) - אימייל
- name (text) - שם
- is_super_admin (boolean) - הרשאות
- created_at, updated_at
```

---

### **💼 ניהול לידים ופרויקטים**

#### `leads` - לידים למכירה/שיתוף
```sql
- id (uuid, PK)
- professional_id (uuid) - מקצוען שיצר הליד
- title (text) - כותרת
- description (text) - תיאור
- location (text) - מיקום
- profession (text) - מקצוע נדרש
- budget (numeric) - תקציב
- share_percentage (integer) - אחוז שיתוף
- status (text) - סטטוס (active/closed)
- work_date (date) - תאריך עבודה
- work_time (text) - שעת עבודה
- client_name (text) - שם לקוח
- client_phone (text) - טלפון לקוח
- client_address (text) - כתובת לקוח
- image_url (text) - תמונה
- image_urls (text[]) - תמונות נוספות
- latitude, longitude - קואורדינטות GPS
- notes (text) - הערות
- constraints (text) - אילוצים
- created_at
```

#### `proposals` - הצעות על לידים
```sql
- id (uuid, PK)
- professional_id (uuid) - מקצוען שהציע
- lead_id (uuid) - ליד שהוצע עליו
- price (numeric) - מחיר הצעה
- description (text) - תיאור הצעה
- estimated_completion (text) - זמן ביצוע משוער
- status (text) - סטטוס (pending/accepted/rejected)
- sample_image_url (text) - תמונת דוגמה
- lower_price_willing (boolean) - נכונות להוזלה
- lower_price_value (numeric) - מחיר מוזל
- scheduled_date (date) - תאריך מתוכנן
- scheduled_time (text) - שעה מתוכננת
- media_urls (text[]) - קבצי מדיה
- final_amount (numeric) - סכום סופי
- created_at
```

---

### **💰 מערכת תשלומים וחיובים**

#### `lead_payments` - תשלומים על לידים
```sql
- id (uuid, PK)
- lead_id (uuid) - ליד ששולם עליו
- proposal_id (uuid) - הצעה שהתקבלה
- professional_id (uuid) - מקצוען שמשלם
- final_amount (numeric) - סכום סופי
- commission_amount (numeric) - עמלת OFAIR
- share_percentage (numeric) - אחוז השיתוף
- payment_method (text) - אמצעי תשלום
- invoice_url (text) - קישור לחשבונית
- notes (text) - הערות
- created_at
```

#### `icount_transactions` - טרנזקציות עם iCount
```sql
- id (uuid, PK)
- professional_id (uuid) - מקצוען
- amount (numeric) - סכום
- transaction_type (text) - סוג (commission_payment)
- status (text) - סטטוס (pending/completed/failed)
- confirmation_code (text) - קוד אישור
- currency (text) - מטבע (ILS)
- icount_transaction_id (text) - מזהה ב-iCount
- request_payload (jsonb) - בקשה נשלחה
- response_payload (jsonb) - תגובה התקבלה
- created_at, updated_at
```

#### `professional_billing_details` - פרטי חיוב מקצוענים
```sql
- id (uuid, PK)
- professional_id (uuid) - מקצוען
- business_name (text) - שם עסק
- vat_id (text) - מספר עוסק מורשה
- contact_name (text) - שם איש קשר
- email (text) - אימייל לחשבוניות  
- phone (text) - טלפון
- address (text) - כתובת
- city (text) - עיר
- postal_code (text) - מיקוד
- created_at, updated_at
```

---

### **📞 מערכת הצעות מחיר ובקשות**

#### `requests` - בקשות עבודה מלקוחות
```sql
- id (uuid, PK)
- user_id (uuid) - לקוח שביקש
- title (text) - כותרת בקשה
- description (text) - תיאור
- date (date) - תאריך רצוי
- timing (text) - זמן רצוי
- status (text) - סטטוס
- created_at, updated_at
```

#### `quotes` - הצעות מחיר למקצוענים
```sql
- id (uuid, PK)
- professional_id (uuid) - מקצוען שהציע
- request_id (uuid) - בקשה שהוצע עליה
- price (text) - מחיר
- description (text) - תיאור הצעה
- estimated_time (text) - זמן ביצוע
- status (text) - סטטוס (pending/accepted/rejected)
- request_status (text) - סטטוס הבקשה
- created_at
```

#### `quote_payments` - תשלומים על הצעות מחיר
```sql
- id (uuid, PK)
- request_id (uuid) - בקשה
- professional_id (uuid) - מקצוען
- final_amount (numeric) - סכום סופי
- payment_method (text) - אמצעי תשלום
- created_at
```

#### `accepted_quotes` - הצעות מחיר מאושרות
```sql
- id (uuid, PK)
- user_id (uuid) - לקוח
- professional_id (text) - מקצוען
- quote_id (text) - הצעה
- request_id (text) - בקשה
- professional_name (text) - שם מקצוען
- price (text) - מחיר
- description (text) - תיאור
- date (timestamp) - תאריך
- status (text) - סטטוס
- payment_method (text) - תשלום
- created_at
```

---

### **🔔 מערכת התראות וניהול**

#### `notifications` - התראות למקצוענים
```sql
- id (uuid, PK)
- professional_id (uuid) - מקצוען המקבל
- title (text) - כותרת התראה
- description (text) - תיאור
- type (varchar) - סוג התראה
- related_id (uuid) - מזהה קשור
- related_type (varchar) - סוג הפריט הקשור
- client_details (jsonb) - פרטי לקוח
- is_read (boolean) - נקרא
- created_at
```

#### `professional_notification_areas` - אזורי התראה
```sql
- id (uuid, PK)
- professional_id (uuid) - מקצוען
- area_name (text) - שם אזור
- latitude, longitude - מיקום מרכז
- radius_km (integer) - רדיוס בק"מ
- is_active (boolean) - פעיל
- created_at, updated_at
```

---

### **⭐ מערכת דירוגים וביקורות**

#### `professional_ratings` - דירוגי מקצוענים
```sql
- id (uuid, PK)
- professional_phone (text) - טלפון מקצוען
- professional_name (text) - שם מקצוען
- company_name (text) - שם חברה
- customer_name (text) - שם לקוח
- customer_phone (text) - טלפון לקוח
- rating_overall (numeric) - דירוג כללי
- rating_quality (numeric) - איכות עבודה
- rating_timing (numeric) - עמידה בזמנים
- rating_communication (numeric) - תקשורת
- rating_value (numeric) - יחס מחיר-איכות
- rating_cleanliness (numeric) - ניקיון
- rating_recommendation (numeric) - המלצה
- weighted_average (numeric) - ממוצע משוקלל
- recommendation (text) - המלצה בטקסט
- created_at
```

---

### **🔐 מערכת אימות וביטחון**

#### `auth_tokens` - טוקני אימות מותאמים
```sql
- id (uuid, PK)
- professional_id (uuid) - מקצוען
- token (text) - טוקן אימות
- expires_at (timestamp) - תפוגה
- is_active (boolean) - פעיל
- device_info (text) - מידע מכשיר
- last_used_at (timestamp) - שימוש אחרון
- created_at
```

#### `auth_rate_limits` - הגבלת קצב בקשות
```sql
- id (uuid, PK)
- identifier (text) - מזהה (IP/User)
- attempt_count (integer) - מספר ניסיונות
- last_attempt_at (timestamp) - ניסיון אחרון
- blocked_until (timestamp) - חסום עד
- created_at
```

#### `phone_revelations` - חשיפות מספרי טלפון
```sql
- id (uuid, PK)
- user_id (uuid) - משתמש שחשף
- professional_id (uuid) - מקצוען שנחשף
- professional_name (text) - שם מקצוען
- professional_phone (text) - טלפון מקצוען
- user_name (text) - שם משתמש
- user_ip (inet) - IP כתובת
- user_agent (text) - דפדפן
- revealed_at (timestamp) - זמן חשיפה
- created_at
```

---

### **📈 מעקב ובקרה**

#### `contact_access_logs` - לוגי גישה לאנשי קשר
```sql
- id (uuid, PK)
- accessor_professional_id (uuid) - מקצוען מבקש
- accessed_professional_id (uuid) - מקצוען נפגש
- access_type (text) - סוג גישה
- access_granted (boolean) - הוענק
- ip_address (inet) - כתובת IP
- user_agent (text) - דפדפן
- accessed_at (timestamp) - זמן גישה
```

#### `customer_contact_access_logs` - גישה לפרטי לקוחות
```sql
- id (uuid, PK)
- accessor_professional_id (uuid) - מקצוען מבקש
- lead_id (uuid) - ליד
- access_type (text) - סוג גישה
- access_granted (boolean) - הוענק
- ip_address (inet) - כתובת IP
- user_agent (text) - דפדפן
- accessed_at (timestamp) - זמן גישה
```

#### `proposal_reminders` - תזכורות הצעות
```sql
- id (uuid, PK)
- proposal_id (uuid) - הצעה
- proposal_type (text) - סוג הצעה
- reminder_count (integer) - מספר תזכורות
- last_reminder (timestamp) - תזכורת אחרונה
- is_scheduled (boolean) - מתוזמן
- created_at
```

---

### **📊 ניהול ותמיכה**

#### `projects` - פרויקטים מנוהלים
```sql
- id (uuid, PK)
- professional_id (uuid) - מקצוען אחראי
- title (text) - כותרת פרויקט
- client (text) - לקוח
- price (numeric) - מחיר
- start_date (text) - תחילה
- end_date (text) - סיום
- status (text) - סטטוס
- progress (integer) - התקדמות באחוזים
- created_at, updated_at
```

#### `issue_reports` - דיווחי תקלות
```sql
- id (uuid, PK)
- professional_id (uuid) - מדווח
- issue_type (text) - סוג תקלה
- description (text) - תיאור
- status (text) - סטטוס (open/closed)
- admin_response (text) - תגובת מנהל
- resolved_at (timestamp) - נפתר ב
- created_at, updated_at
```

#### `articles` - מאמרים ותוכן
```sql
- id (uuid, PK)
- title (text) - כותרת
- content (text) - תוכן
- summary (text) - תקציר
- category (text) - קטגוריה
- author (text) - כותב
- image (text) - תמונה
- published (boolean) - פורסם
- created_at, updated_at
```

#### `professional_certificates` - תעודות מקצוענים
```sql
- id (uuid, PK)
- professional_id (uuid) - מקצוען
- certificate_name (text) - שם תעודה
- certificate_url (text) - קישור לקובץ
- file_name (text) - שם קובץ
- file_size (integer) - גודל קובץ
- upload_date (timestamp) - תאריך העלאה
- created_at, updated_at
```

---

## ⚡ **Edge Functions - פונקציות שרת**

### **🔐 אימות ובטיחות**
- `cleanup_expired_tokens()` - ניקוי טוקנים פגי תוקף
- `check_auth_token_for_professional()` - בדיקת טוקן מקצוען
- `get_current_professional_id_secure()` - זיהוי מקצוען מאומת

### **👥 ניהול מקצוענים**
- `get_professional_by_identifier()` - חיפוש מקצוען לפי אימייל/טלפון
- `check_professional_exists_by_phone()` - בדיקת קיום מקצוען
- `get_public_professional_data()` - נתוני מקצוענים ציבוריים
- `get_professionals_for_business()` - רשימת מקצוענים לעסקאות

### **📋 ניהול לידים והצעות**
- `get_public_leads_secure()` - לידים ציבוריים (ללא פרטי לקוח)
- `get_lead_customer_info_secure()` - פרטי לקוח (רק לבעלי ליד)
- `submit_proposal_secure()` - הגשת הצעה על ליד
- `get_proposals_secure()` - הצעות של מקצוען
- `get_quotes_secure()` - הצעות מחיר של מקצוען

### **💰 תשלומים וחיובים**
- `get_my_payments_secure()` - תשלומי מקצוען
- `get_icount_transactions_secure()` - טרנזקציות iCount
- `get_clients_history_secure()` - היסטוריית לקוחות

### **⭐ דירוגים וביקורות**
- `get_my_professional_ratings()` - דירוגי מקצוען (מוסתר פרטי לקוח)
- `get_professional_ratings_public()` - דירוגים ציבוריים
- `get_professional_rating_stats()` - סטטיסטיקות דירוגים
- `update_professional_rating_secure()` - עדכון דירוג

### **📞 חשיפת פרטי קשר**
- `get_professional_phone_secure()` - חשיפת טלפון (בחיוב)
- `get_client_details_for_proposal()` - פרטי לקוח להצעה

### **🔔 התראות ותזכורות**
- `notify_professionals_for_new_lead()` - התראה על ליד חדש
- `notify_professional_new_referral()` - התראה על פנייה ישירה
- `notify_on_phone_revelation()` - התראה על חשיפת טלפון

### **🛡️ בקרה ומנהלים**
- `is_admin_safe()` / `is_super_admin_safe()` - בדיקת הרשאות
- `add_internal_user()` - הוספת משתמש פנימי
- `create_first_super_admin()` - יצירת מנהל ראשון

### **🔧 כלי עזר**
- `validate_input_length()` - אימות אורך קלט
- `sanitize_phone_number()` - נירמול מספרי טלפון
- `check_price_and_share_percentage()` - בדיקת מחיר ואחוזים
- `sync_quote_status_with_request()` - סנכרון סטטוסי הצעות

---

## 🎯 **תהליכים עסקיים מרכזיים**

### **1. רישום מקצוען חדש**
1. מילוי טופס בדף הבית (CtaSection)
2. שמירה בטבלת `professionals` עם סטטוס "pending"
3. שליחה לוובהוק חיצוני לעיבוד
4. אישור מנהל → סטטוס "approved"

### **2. יצירת ליד חדש**
1. מקצוען יוצר ליד חדש
2. שמירה בטבלת `leads`
3. התראות למקצוענים באזור (לפי `professional_notification_areas`)
4. מקצוענים יכולים להגיש הצעות

### **3. הגשת הצעה על ליד**
1. מקצוען רואה ליד פעיל
2. הגשת הצעה דרך `submit_proposal_secure()`
3. שמירה בטבלת `proposals`
4. בעל הליד יכול לראות את ההצעות

### **4. סגירת עסקה**
1. בעל ליד מאשר הצעה
2. יצירת רשומה בטבלת `lead_payments`
3. שליחת תשלום לחברת iCount
4. עדכון סטטוסים

### **5. חשיפת פרטי קשר**
1. לקוח רוצה לפנות למקצוען
2. קריאה ל-`get_professional_phone_secure()`
3. רישום בטבלת `phone_revelations`
4. חיוב/תשלום על החשיפה

---

## 🔒 **אבטחה ובקרת גישה (RLS Policies)**

### **עקרונות אבטחה מרכזיים:**
1. **פרטיות מקצוענים** - רק מקצוען יכול לראות את הנתונים המלאים שלו
2. **הגנה על לקוחות** - פרטי לקוחות רק לבעלי הליד המקוריים
3. **בקרת גישה לתשלומים** - רק המקצוען יכול לראות תשלומיו
4. **מנהלים מוגבלים** - רק מנהלי מערכת יכולים לנהל משתמשים
5. **אימות דו-שלבי** - טוקנים מותאמים + אימות Supabase

### **מדיניות RLS מרכזיות:**
- משתמשים רואים רק את הנתונים שלהם
- מקצוענים רואים רק הצעות ולידים שלהם
- לקוחות רואים רק בקשות והצעות שלהם
- מנהלים רואים הכל (עם בדיקת הרשאות)

---

## 📱 **רכיבי UI מרכזיים**

### **טפסים**
- `SignupForm` - הרשמת מקצוענים
- `ContactForm` - יצירת קשר
- `DynamicWorkFieldsSelector` - בחירת תחומי עבודה
- `ExperienceSection` - בחירת ותק

### **רכיבי תצוגה**
- `NotificationPopup` - התראות למשתמש
- `WhatsAppButton` - כפתור וואטסאפ צף
- `ScrollToTop` - חזרה לראש הדף

### **ניווט**
- `Navbar` - תפריט עליון
- `Footer` - כותרת תחתונה

---

## 🎨 **עיצוב ונושא**

### **צבעים מרכזיים**
- כחול ראשי - מותג OFAIR
- לבן/אפור - רקעים
- ירוק - הצלחה/אישור
- אדום - שגיאות/התראות

### **טיפוגרפיה**
- כיוון RTL (עברית)
- פונטים ברורים וקריאים
- גדלים מגיבים (responsive)

---

## 🔧 **טכנולוגיות וכלים**

### **Frontend**
- ⚛️ React 18 + TypeScript
- 🎨 Tailwind CSS
- 🧭 React Router
- 📡 Supabase Client

### **Backend**
- 🗄️ Supabase Database (PostgreSQL)
- ⚡ Edge Functions (Deno)
- 🔐 Row Level Security (RLS)
- 🔑 Custom Auth Tokens

### **חיצוני**
- 📧 Webhooks לעיבוד טפסים
- 💳 iCount לתשלומים וחשבוניות
- 📱 WhatsApp Business API

---

## ✅ **דגשים חשובים לפיתוח**

### **🚨 קריטי - חובה לעמוד בדרישות אלה:**

1. **אבטחת מידע** - אסור לחשוף פרטי לקוחות לא מורשים
2. **ביצועים** - החזרת נתונים מהירה (פחות מ-2 שניות)
3. **תגובתיות** - עובד על כל המכשירים
4. **גיבויים** - כל הנתונים מגובים אוטומטית
5. **לוגים** - כל פעילות מתועדת לביקורת

### **🎯 יעדי חוויית משתמש:**
- הרשמה פשוטה (פחות מ-3 דקות)
- חיפוש מהיר של לידים
- הגשת הצעות קלה
- התראות מיידיות
- תשלומים מאובטחים

### **📊 מטריקות מדידה:**
- זמן רישום מקצוען חדש
- מספר הצעות לליד
- שיעור הצלחת עסקאות
- זמן תגובה של API
- שביעות רצון משתמשים

---

## 🚀 **הרחבות עתידיות**

### **שלב הבא:**
- אפליקציה ניידת (React Native)
- מערכת צ'אט בזמן אמת
- אינטגרציה עם Waze למיקום
- בינה מלאכותית להתאמת הצעות
- מערכת המלצות חכמה

### **אופציונלי:**
- תשלומי קריפטו
- מערכת נקודות נאמנות
- ביקורות וידיאו
- שיתופים ברשתות חברתיות
- דוחות אנליטיקה מתקדמים

---

**🏁 סיכום: אפליקציית OFAIR היא מערכת CRM מתקדמת למקצוענים, עם דגש על אבטחה, ביצועים וחוויית משתמש מעולה.**