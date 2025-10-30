# 📘 תיעוד מערכת oFair - מסמך טכני מלא

> **גרסה:** 1.0  
> **תאריך עדכון אחרון:** 26/10/2025  
> **מטרה:** פלטפורמה דיגיטלית לחיבור מקצוענים עם לקוחות פוטנציאליים

---

## 📑 תוכן עניינים

1. [מבנה כללי של המערכת](#1-מבנה-כללי-של-המערכת)
2. [דפים ופלואים](#2-דפים-ופלואים)
3. [פונקציות לוגיות](#3-פונקציות-לוגיות)
4. [Edge Functions](#4-edge-functions)
5. [בסיס נתונים](#5-בסיס-נתונים)
6. [פיצ'רים עיקריים](#6-פיצרים-עיקריים)
7. [אינטגרציות חיצוניות](#7-אינטגרציות-חיצוניות)
8. [הגדרות פיתוח](#8-הגדרות-פיתוח)
9. [אבטחה ותחזוקה](#9-אבטחה-ותחזוקה)
10. [אינדקס מהיר](#10-אינדקס-מהיר)

---

## 1. מבנה כללי של המערכת

### 1.1 ארכיטקטורה

המערכת בנויה על ארכיטקטורה של **Single Page Application (SPA)** עם Backend as a Service:

```
┌─────────────────┐
│   User Browser  │
│   (React SPA)   │
└────────┬────────┘
         │
         ├──────────────────────────┐
         │                          │
         ▼                          ▼
┌────────────────┐        ┌─────────────────┐
│  Supabase      │        │  Make.com       │
│  (Backend)     │        │  Webhook        │
│  - PostgreSQL  │        │  Integration    │
│  - Auth        │        └─────────────────┘
│  - Edge Funcs  │
│  - Storage     │
└────────────────┘
```

### 1.2 זרימת נתונים

```
User → Form Submission → Client Validation → Edge Function → Webhook (Make.com)
                                           ↓
                                    Supabase Database
                                           ↓
                                    Success Response → Notification UI
```

### 1.3 סטאק טכנולוגי

#### Frontend
- **React 18.3.1** - ספריית UI
- **TypeScript** - שפת תכנות מוקלדת
- **Vite** - כלי build מהיר
- **Tailwind CSS 2.5.2** - CSS framework
- **Radix UI** - רכיבי UI נגישים ללא סגנון
- **React Router v6.26.2** - ניהול ניווט
- **React Hook Form 7.53.0** - ניהול טפסים
- **Zod 3.23.8** - ולידציית schemas
- **TanStack Query 5.56.2** - ניהול state אסינכרוני
- **Sonner** - מערכת toast notifications

#### Backend
- **Supabase** - Platform לניהול Backend
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Edge Functions (Deno)
  - Authentication
  - Real-time subscriptions
  - Storage

#### DevOps & Deployment
- **Netlify** - פלטפורמת deployment
- **GitHub Actions** - CI/CD pipeline
- **Bun** - Package manager

#### External Services
- **Make.com** - Webhook automation
- **GreenAPI** - WhatsApp integration (future)
- **Tranzila** - Payment gateway (future)

---

## 2. דפים ופלואים

### 2.1 דף הבית (`/`)

**קובץ:** `src/pages/Index.tsx`

#### מטרה
Landing page מרכזי לגיוס מקצוענים למערכת oFair. הדף מציג את היתרונות, מודל העסקי, ומכיל טופס הרשמה מפורט.

#### רכיבי UI עיקריים (לפי סדר הופעה)
1. **Navbar** - ניווט עליון עם לוגו וקישורים
2. **HeroSection** - סקשן פתיחה עם וידאו רקע ו-CTA
3. **ProblemsSection** - הצגת בעיות שהפלטפורמה פותרת
4. **BenefitsSection** - יתרונות ההצטרפות למערכת
5. **EarningsCalculatorSection** - מחשבון רווחים פוטנציאליים
6. **AppShowcaseSection** - תצוגת האפליקציה
7. **WhatIsSection** - הסבר מה זה oFair
8. **BusinessModelSection** - הסבר מודל העסקי
9. **HowItWorksSection** - תהליך העבודה במערכת
10. **CtaSection** - **טופס ההרשמה המרכזי**
11. **ContactSection** - טופס יצירת קשר
12. **Footer** - תחתית דף
13. **FloatingCTAButton** - כפתור צף לגלילה לטופס
14. **ScrollToTop** - כפתור חזרה לראש הדף
15. **SignupModal** - מודל הרשמה (אם נפתח דרך כפתור)

#### Hooks בשימוש
- `useNotification()` - הצגת התראות מותאמות אישית

#### פלואו משתמש
```
1. כניסה לדף ← → צפייה בתוכן
2. גלילה למטה → כפתור צף מופיע
3. לחיצה על "הצטרף עכשיו" → גלילה לטופס
4. מילוי טופס הרשמה
5. שליחה ← → ולידציה
6. ✅ הצלחה → Popup אישור
7. ❌ שגיאה → הודעת שגיאה
```

#### קריאות API
- `submitSignupForm()` - שליחת טופס הרשמה
- `submitContactForm()` - שליחת טופס יצירת קשר

---

### 2.2 דף תנאי שימוש (`/terms`)

**קובץ:** `src/pages/Terms.tsx`

#### מטרה
הצגת תנאי שימוש, מדיניות פרטיות והסכמים משפטיים.

#### רכיבים
- Navbar
- תוכן סטטי בעברית
- Footer
- ScrollToTop

#### פלואו
- קריאה בלבד, ללא אינטראקציות

---

### 2.3 דף 404 (`/404`)

**קובץ:** `src/pages/NotFound.tsx`

#### מטרה
טיפול בנתיבים לא קיימים והפניה חזרה לדף הבית.

#### Netlify Configuration
```
# public/_redirects
/*    /index.html   200
```

זה מבטיח שכל הנתיבים יועברו ל-`index.html` ו-React Router יטפל בניתוב.

---

## 3. פונקציות לוגיות

### 3.1 Custom Hooks

#### `useSignupForm`
**מיקום:** `src/hooks/useSignupForm.ts`

**מטרה:** ניהול מקיף של טופס ההרשמה למקצוענים.

**פרמטרים:**
- `onSubmit: (formData: SignupFormData) => Promise<void>` - callback לשליחת הטופס

**מחזיר:**
```typescript
{
  formData: SignupFormData,           // נתוני הטופס
  errors: SignupFormErrors,           // שגיאות ולידציה
  isSubmitting: boolean,              // סטטוס שליחה
  handleChange,                       // טיפול בשינויי input
  handleWorkFieldToggle,              // בחירת תחומי עבודה
  handleWorkRegionToggle,             // בחירת אזורי עבודה
  handleExperienceChange,             // עדכון ניסיון
  handleProfessionToggle,             // בחירת מקצוע
  handleSubSpecializationToggle,      // בחירת התמחות משנה
  handleOtherProfessionChange,        // עדכון "מקצוע אחר"
  handleSubmit,                       // שליחת הטופס
  setFormData                         // עדכון ידני של נתונים
}
```

**תלויות פנימיות:**
- `useFormState()` - ניהול state
- `useFormValidation()` - לוגיקת ולידציה
- `useFieldHandlers()` - handlers לשדות

**דוגמת שימוש:**
```typescript
const {
  formData,
  errors,
  handleSubmit,
  handleProfessionToggle
} = useSignupForm(async (data) => {
  await submitSignupForm(data, workFields, workRegions, utmParams);
});
```

---

#### `useFormState`
**מיקום:** `src/hooks/form/useFormState.ts`

**מטרה:** ניהול state של טופס ההרשמה.

**שדות בטופס:**
```typescript
interface SignupFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  businessLicenseNumber: string;
  professions: ProfessionSelection[];     // מקצועות שנבחרו
  workFields: string[];                   // תחומי עבודה
  otherWorkField: string;
  showOtherWorkField: boolean;
  experience: string;                     // טווח ניסיון
  email: string;                          // אופציונלי
  phone: string;                          // חובה
  city: string;
  workRegions: string[];                  // אזורי עבודה
  acceptTerms: boolean;
  acceptMarketing: boolean;
  otherProfession?: string;
  otherSpecializations?: Record<string, string>;
}
```

**מחזיר:**
- `formData` - המידע הנוכחי
- `errors` - אובייקט שגיאות
- `isSubmitting` - האם הטופס בתהליך שליחה
- `setFormData` - פונקציה לעדכון
- `setErrors` - עדכון שגיאות
- `setIsSubmitting` - עדכון סטטוס שליחה
- `handleChange` - טיפול אוטומטי ב-inputs
- `resetForm` - איפוס הטופס

---

#### `useFormValidation`
**מיקום:** `src/hooks/form/useFormValidation.ts`

**מטרה:** ולידציה מקיפה של טופס ההרשמה.

**פונקציה עיקרית:**
```typescript
validateForm(formData: SignupFormData): {
  isValid: boolean;
  errors: SignupFormErrors;
}
```

**כללי ולידציה:**
1. **אימייל** (אופציונלי):
   - Regex: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
   - ניקוי תווים לא-לטיניים

2. **טלפון** (חובה):
   - Regex: `/^0[2-9]\d{7,8}$/`
   - פורמט ישראלי בלבד

3. **ניסיון** (חובה):
   - חייב לבחור טווח

4. **תנאי שימוש** (חובה):
   - חייב לאשר

5. **ח.פ/ע.מ** (אופציונלי):
   - אם מולא: בדיוק 9 ספרות
   - Regex: `/^\d{9}$/`

6. **מקצוע** (חובה):
   - לפחות מקצוע אחד נבחר
   - אם נבחר "אחר" - חובה למלא טקסט

**דוגמת שימוש:**
```typescript
const { validateForm } = useFormValidation();

const { isValid, errors } = validateForm(formData);
if (!isValid) {
  setErrors(errors);
  return;
}
```

---

#### `useFieldHandlers`
**מיקום:** `src/hooks/form/useFieldHandlers.ts`

**מטרה:** ניהול אינטראקציות מורכבות עם שדות הטופס.

**Handlers:**

1. **`handleWorkFieldToggle(id: string)`**
   - מוסיף/מסיר תחום עבודה
   - מנהל שדה "אחר"

2. **`handleWorkRegionToggle(id: string)`**
   - מוסיף/מסיר אזור עבודה

3. **`handleExperienceChange(value: string)`**
   - מעדכן טווח ניסיון
   - מנקה שגיאות

4. **`handleProfessionToggle(professionId: string)`**
   - מוסיף/מסיר מקצוע
   - מטפל במקצוע "אחר"
   - מנקה התמחויות אם המקצוע מוסר

5. **`handleSubSpecializationToggle(professionId: string, specId: string)`**
   - מוסיף/מסיר התמחות משנה למקצוע ספציפי

6. **`handleOtherProfessionChange(value: string)`**
   - מעדכן טקסט "מקצוע אחר"

---

### 3.2 Services (שירותים)

#### `submitSignupForm`
**מיקום:** `src/services/formSubmission.ts`

**חתימה:**
```typescript
async function submitSignupForm(
  formData: SignupFormData,
  workFields: { id: string; label: string }[],
  workRegions: { id: string; label: string }[],
  utmParams: Record<string, string>
): Promise<void>
```

**תהליך:**

1. **עיבוד נתונים:**
   - המרת `experience` לשנים (מטקסט למספר)
   - המרת IDs לתוויות בעברית
   - עיבוד מקצועות והתמחויות לפורמט מובנה

2. **שליחה ל-Webhook (Make.com):**
   ```typescript
   const webhookData = {
     ...formData,
     professions: formattedProfessions,
     workFields: hebrewWorkFields,
     workRegions: hebrewWorkRegions,
     utm_source: utmParams.utm_source,
     utm_medium: utmParams.utm_medium,
     // ... כל פרמטרי UTM
   };
   
   await fetch(WEBHOOK_URL, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(webhookData)
   });
   ```

3. **שמירה ב-Supabase:**
   - בדיקת משתמש קיים (לפי email או phone)
   - INSERT לטבלת `professionals`:
   ```typescript
   {
     name: `${firstName} ${lastName}`,
     phone_number: phone,
     email: email || null,
     profession: mainProfession,
     main_profession: mainProfession,
     sub_specializations: allSpecializations,
     location: city,
     areas: workRegions,
     experience_years: experienceYears,
     company_name: companyName || null,
     business_license_number: businessLicenseNumber || null,
     terms_accepted: acceptTerms,
     marketing_consent: acceptMarketing,
     status: 'pending'
   }
   ```

4. **טיפול בשגיאות:**
   - משתמש כבר קיים: "נראה שכבר נרשמת למערכת. צוות oFair יצור עמך קשר בקרוב!"
   - שגיאת Webhook: "נתקלנו בבעיה בשליחת הטופס"
   - שגיאת DB: "אירעה שגיאה בשמירת הנתונים"

**פורמט מקצועות לדוגמה:**
```typescript
[
  {
    profession: "אינסטלטור",
    specializations: ["אינסטלציה סניטרית", "גז"]
  },
  {
    profession: "אחר",
    customText: "טכנאי מזגנים"
  }
]
```

---

#### `submitContactForm`
**מיקום:** `src/services/formSubmission.ts`

**חתימה:**
```typescript
async function submitContactForm(
  formData: ContactFormData
): Promise<void>
```

**תהליך:**
- שליחה ישירה ל-Webhook בלבד (ללא שמירה ב-DB)
- פורמט פשוט יותר

---

### 3.3 Utilities (עזרים)

#### `validateEmail(email: string): boolean`
**מיקום:** `src/utils/formValidation.ts`

בדיקת תקינות אימייל עם Regex.

#### `validatePhone(phone: string): boolean`
בדיקת פורמט טלפון ישראלי (`0X-XXXXXXXX`).

#### `validateBusinessLicense(license: string): boolean`
בדיקה ש-ח.פ מכיל בדיוק 9 ספרות.

#### `sanitizeEmail(email: string): string`
ניקוי תווים שאינם ASCII מאימייל.

#### `getUtmParams(): Record<string, string>`
**מיקום:** `src/utils/utmUtils.ts`

חילוץ כל פרמטרי UTM מה-URL:
```typescript
// URL: https://ofair.co.il/?utm_source=google&utm_medium=cpc
// Returns: { utm_source: "google", utm_medium: "cpc" }
```

#### `appendUtmParams<T>(data: T): T & Record<string, string>`
הוספת UTM למבנה נתונים קיים.

---

## 4. Edge Functions

### 4.1 `send-registration-webhook`

**מיקום:** `supabase/functions/send-registration-webhook/index.ts`

**Endpoint:** `POST /functions/v1/send-registration-webhook`

**מטרה:** קבלת טופס הרשמה ושליחה ל-Make.com Webhook.

**Input (Request Body):**
```typescript
{
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  professions: Array<{
    profession: string;
    specializations?: string[];
  }>;
  workFields: string[];
  workRegions: string[];
  experience: string;
  city: string;
  companyName?: string;
  businessLicenseNumber?: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
  utm_source?: string;
  utm_medium?: string;
  // ... שאר פרמטרי UTM
}
```

**Output (Response):**
```typescript
// Success:
{ success: true }

// Error:
{ error: "error message" }
```

**Logic:**
```typescript
1. קבלת נתונים מה-request
2. הוספת שדה `post_type: "main_signup_form_initial"`
3. שליחה ל-Webhook:
   fetch("https://hook.eu2.make.com/...", {
     method: "POST",
     body: JSON.stringify(dataToSubmit)
   })
4. החזרת תשובה
```

**CORS Handling:**
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// OPTIONS request
if (req.method === 'OPTIONS') {
  return new Response(null, { headers: corsHeaders });
}
```

**שגיאות אפשריות:**
- `400 Bad Request` - נתונים חסרים או לא תקינים
- Webhook failure - שגיאה בשליחה ל-Make.com

---

## 5. בסיס נתונים

### 5.1 טבלאות עיקריות

#### `professionals` - מקצוענים רשומים

**עמודות:**
```typescript
{
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES auth.users,  // אם נרשם דרך auth
  name: text NOT NULL,
  phone_number: text,
  email: text,
  profession: text NOT NULL,            // מקצוע ראשי
  main_profession: text,                // מקצוע עיקרי (מוגדר)
  sub_specializations: text[],          // התמחויות משנה
  company_name: text,
  business_license_number: text,
  experience_years: text,               // "0-2", "3-5", etc.
  experience_range: text,               // טווח ניסיון
  city: text,
  location: text NOT NULL,              // עיר/אזור
  areas: text,                          // אזורי עבודה (JSON)
  specialties: text[],                  // התמחויות
  rating: numeric DEFAULT 0,
  review_count: integer DEFAULT 0,
  is_verified: boolean DEFAULT false,
  status: text DEFAULT 'pending',       // pending/approved/rejected
  terms_accepted: boolean DEFAULT false,
  marketing_consent: boolean DEFAULT false,
  image: text,                          // URL לתמונת פרופיל
  about: text,                          // תיאור עצמי
  languages: text[] DEFAULT '{}',
  profile_completion_percentage: integer DEFAULT 0,
  tutorial_completed: boolean DEFAULT false,
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now()
}
```

**Indexes:**
- `phone_number` (unique)
- `email` (unique)
- `profession`
- `status`

**RLS Policies:**
```sql
-- משתמשים לא מחוברים יכולים להירשם
INSERT: (user_id IS NULL) AND (status = 'pending') AND (terms_accepted = true)

-- מקצוענים רואים את הפרופיל המלא שלהם
SELECT: (auth.uid() = user_id) OR (id IN (SELECT professional_id FROM auth_tokens WHERE token = current_token))

-- UPDATE: רק על פרופיל עצמי
UPDATE: (auth.uid() = user_id)

-- ציבור רואה רק approved
SELECT: (status = 'approved')
```

**Triggers:**
- `create_professional_lead_entry()` - יוצר רשומה ב-CRM אחרי הרשמה
- `update_updated_at_column()` - מעדכן אוטומטית `updated_at`

---

#### `leads` - לידים לשיתוף

**עמודות:**
```typescript
{
  id: uuid PRIMARY KEY,
  professional_id: uuid REFERENCES professionals(id),
  title: text NOT NULL,
  description: text NOT NULL,
  profession: text,
  location: text NOT NULL,
  budget: numeric,
  share_percentage: integer DEFAULT 0,   // % עמלה
  status: text DEFAULT 'active',         // active/closed/cancelled
  work_date: date,
  work_time: text,
  client_name: text,                     // 🔒 רגיש
  client_phone: text,                    // 🔒 רגיש
  client_address: text,                  // 🔒 רגיש
  latitude: double precision,
  longitude: double precision,
  image_url: text,
  image_urls: text[],
  notes: text,
  constraints: text,
  includes_vat: boolean DEFAULT false,
  created_at: timestamptz DEFAULT now()
}
```

**RLS Policies:**
```sql
-- רק בעלי ליד רואים פרטי לקוח
SELECT (client data): professional_id = current_professional_id

-- כולם רואים מידע בסיסי של לידים פעילים
SELECT (basic): status = 'active'

-- יצירה: רק מקצוענים מחוברים
INSERT: professional_id IN (SELECT id FROM professionals WHERE user_id = auth.uid())
```

**Triggers:**
- `notify_professionals_for_new_lead()` - שולח התראות למקצוענים באזור
- `check_price_and_share_percentage()` - מגביל % עמלה לפי תקציב

---

#### `proposals` - הצעות מחיר על לידים

**עמודות:**
```typescript
{
  id: uuid PRIMARY KEY,
  professional_id: uuid REFERENCES professionals(id),
  lead_id: uuid REFERENCES leads(id),
  price: numeric NOT NULL,
  description: text NOT NULL,
  estimated_completion: text,
  status: text DEFAULT 'pending',        // pending/accepted/rejected
  sample_image_url: text,
  lower_price_willing: boolean DEFAULT false,
  lower_price_value: numeric,
  scheduled_date: timestamp,
  scheduled_time: text,
  media_urls: text[],
  final_amount: numeric,
  created_at: timestamptz DEFAULT now()
}
```

**RLS Policies:**
```sql
-- מקצוען רואה את ההצעות שלו + הצעות על הלידים שלו
SELECT: (professional_id = current_id) OR (lead_id IN user_leads)

-- יצירה: רק מקצוענים
INSERT: professional_id = current_professional_id
```

---

#### `lead_payments` - תשלומים על לידים

**עמודות:**
```typescript
{
  id: uuid PRIMARY KEY,
  lead_id: uuid REFERENCES leads(id),
  proposal_id: uuid REFERENCES proposals(id),
  professional_id: uuid REFERENCES professionals(id),
  final_amount: numeric NOT NULL,
  commission_amount: numeric DEFAULT 0,   // עמלה לבעל הליד
  share_percentage: numeric DEFAULT 0,
  payment_method: text NOT NULL,          // credit_card/bank_transfer
  invoice_url: text,
  notes: text,
  includes_vat: boolean DEFAULT false,
  created_at: timestamptz DEFAULT now()
}
```

**RLS:**
```sql
-- רק המקצוען המשלם ובעל הליד רואים
SELECT: (professional_id = current_id) OR (lead_id IN user_leads)
```

---

#### `professional_ratings` - דירוגים

**עמודות:**
```typescript
{
  id: uuid PRIMARY KEY,
  professional_phone: text NOT NULL,
  professional_name: text NOT NULL,
  company_name: text,
  customer_name: text NOT NULL,          // 🔒 לא נחשף לציבור
  customer_phone: text NOT NULL,         // 🔒 לא נחשף לציבור
  rating_overall: numeric NOT NULL,      // 1-5
  rating_quality: numeric NOT NULL,
  rating_timing: numeric NOT NULL,
  rating_communication: numeric NOT NULL,
  rating_value: numeric NOT NULL,
  rating_cleanliness: numeric NOT NULL,
  rating_recommendation: numeric NOT NULL,
  weighted_average: numeric NOT NULL,
  recommendation: text,
  created_at: timestamptz DEFAULT now()
}
```

**RLS:**
```sql
-- אסור לקרוא ישירות מהטבלה
SELECT: false

-- רק ניתן להוסיף
INSERT: authenticated

-- יש פונקציות ייעודיות לקריאה:
-- get_professional_ratings_public(phone) - ללא פרטי לקוח
-- get_my_professional_ratings(token) - למקצוען עצמו
```

---

### 5.2 טבלאות נוספות

#### `admin_users` - מנהלי מערכת
```typescript
{
  id: uuid,
  user_id: uuid REFERENCES auth.users,
  is_super_admin: boolean DEFAULT false,
  created_at, updated_at
}
```

#### `internal_crm` - צוות פנימי
```typescript
{
  id: uuid,
  user_id: uuid,
  email: text UNIQUE,
  name: text,
  is_super_admin: boolean DEFAULT false,
  password_hash: text,
  created_at, updated_at
}
```

#### `professional_leads_crm` - ניהול לידים של מקצוענים
```typescript
{
  id: uuid,
  professional_id: uuid REFERENCES professionals,
  status: text DEFAULT 'open',
  priority: text DEFAULT 'normal',
  assigned_to: uuid REFERENCES internal_crm,
  contacted: boolean DEFAULT false,
  contacted_at: timestamptz,
  contacted_by: uuid,
  notes: text,
  internal_notes: text,
  tags: text[],
  payment_amount: numeric,
  paid: boolean DEFAULT false,
  paid_at: timestamptz,
  closed_reason: text,
  closed_at: timestamptz,
  created_at, updated_at
}
```

**Trigger:** נוצר אוטומטית כשמקצוען נרשם.

#### `auth_tokens` - אימות מותאם (OTP)
```typescript
{
  id: uuid,
  professional_id: uuid REFERENCES professionals,
  token: text UNIQUE NOT NULL,
  expires_at: timestamptz NOT NULL,
  is_active: boolean DEFAULT true,
  device_info: text,
  last_used_at: timestamptz,
  created_at
}
```

#### `notifications` - התראות למקצוענים
```typescript
{
  id: uuid,
  professional_id: uuid REFERENCES professionals,
  title: text NOT NULL,
  description: text NOT NULL,
  type: varchar NOT NULL,
  related_id: uuid,
  related_type: varchar,
  client_details: jsonb,
  is_read: boolean DEFAULT false,
  created_at
}
```

**סוגי התראות:**
- `new_lead_in_area` - ליד חדש באזור
- `new_direct_inquiry` - פנייה ישירה
- `phone_revealed` - מישהו חשף את המספר
- `proposal_accepted` - הצעה התקבלה

#### `phone_revelations` - מעקב חשיפת טלפונים
```typescript
{
  id: uuid,
  user_id: uuid NOT NULL,
  professional_id: uuid REFERENCES professionals,
  professional_name: text,
  professional_phone: text,
  user_name: text,
  user_ip: inet,
  user_agent: text,
  revealed_at: timestamptz DEFAULT now(),
  created_at
}
```

**Trigger:** `notify_on_phone_revelation()` - שולח התראה למקצוען

#### טבלאות נוספות (רשימה חלקית)
- `requests` - בקשות מלקוחות
- `quotes` - הצעות מחיר
- `accepted_quotes` - הצעות מחיר שהתקבלו
- `quote_payments` - תשלומים על הצעות
- `projects` - ניהול פרויקטים
- `professional_certificates` - תעודות מקצועיות
- `professional_notification_areas` - הגדרות התראות לפי מיקום
- `payment_methods` - אמצעי תשלום שמורים
- `credit_card_tokens` - טוקנים של כרטיסי אשראי
- `commissions` - עמלות
- `issue_reports` - דיווחי תקלות
- `articles` - תוכן ומאמרים
- `contact_access_logs` - לוגים של גישה לפרטי קשר
- `customer_contact_access_logs` - לוגים של גישה לפרטי לקוחות
- `auth_rate_limits` - הגבלת קצב לפעולות אימות

---

### 5.3 תרשים ER (טקסטואלי)

```
┌──────────────────┐
│  professionals   │ ──┐
└──────────────────┘   │
         │             │
         │ 1:M         │ 1:M
         ▼             ▼
  ┌───────────┐   ┌──────────────┐
  │   leads   │   │  proposals   │
  └───────────┘   └──────────────┘
         │                 │
         │ 1:M             │ 1:1
         ▼                 ▼
  ┌──────────────┐  ┌────────────────┐
  │  proposals   │  │ lead_payments  │
  └──────────────┘  └────────────────┘

┌──────────────────┐
│  professionals   │ ──┐
└──────────────────┘   │
                       │ 1:M
                       ▼
              ┌─────────────────────┐
              │ professional_ratings│
              └─────────────────────┘

┌──────────────────┐
│  professionals   │ ──┐
└──────────────────┘   │
                       │ 1:M
                       ▼
              ┌─────────────────┐
              │ notifications   │
              └─────────────────┘

┌──────────────────┐
│  professionals   │ ──┐
└──────────────────┘   │
                       │ 1:1
                       ▼
              ┌───────────────────────┐
              │professional_leads_crm │
              └───────────────────────┘
                       │
                       │ M:1
                       ▼
              ┌─────────────────┐
              │  internal_crm   │
              └─────────────────┘
```

---

### 5.4 Database Functions (דוגמאות)

#### `get_current_professional_id_secure(token_param text)`
מחזיר את ה-ID של המקצוען המחובר לפי Token.

#### `get_proposals_secure(token_param text)`
מחזיר את כל ההצעות הרלוונטיות למקצוען (ההצעות שלו + הצעות על הלידים שלו).

#### `submit_proposal_secure(...)`
שליחת הצעה על ליד.

#### `get_client_details_for_proposal(proposal_id, proposal_type, token)`
מחזיר פרטי לקוח (שם, טלפון, כתובת) רק אם המקצוען הוא בעל ההצעה.

#### `get_professional_ratings_public(professional_phone)`
מחזיר דירוגים ציבוריים **ללא** פרטי לקוח.

#### `get_my_professional_ratings(token)`
מחזיר דירוגים למקצוען עצמו עם מידע מוסתר חלקית על הלקוח.

#### `calculate_profile_completion(prof_id)`
מחשב אחוז השלמת פרופיל (0-100).

---

## 6. פיצ'רים עיקריים

### 6.1 רישום מקצוענים

**תיאור:**  
מערכת רישום מקיפה למקצוענים הכוללת בחירת מקצועות, התמחויות, אזורי עבודה ופרטים אישיים ועסקיים.

#### Frontend Flow

1. **טופס מבוסס סקשנים:**
   - `PersonalInfoSection` - שם פרטי + משפחה
   - `BusinessDetailsSection` - שם חברה + ח.פ (אופציונלי)
   - `OccupationDetailsSection`:
     - בחירת מקצוע/ות מתוך 56 אפשרויות
     - בחירת התמחויות משנה (~200 אפשרויות)
     - אופציה ל"מקצוע אחר"
   - `WorkFieldsSection` - תחומי עבודה (14 קטגוריות)
   - `WorkRegionsSection` - אזורי עבודה (ערים ואזורים)
   - `ExperienceSection` - טווח ניסיון (0-2, 3-5, 6-10, 11+)
   - שדה אימייל אופציונלי
   - טלפון (חובה)
   - עיר
   - אישור תנאים + שיווק

2. **ולידציה:**
   - Real-time validation
   - הצגת שגיאות מתחת לשדות
   - כפתור "שלח" נעול עד שהכל תקין

3. **שליחה:**
   ```typescript
   submitSignupForm(formData, workFields, workRegions, utmParams)
     → Edge Function
     → Webhook (Make.com)
     → Supabase Insert
     → Success Popup
   ```

#### Backend Flow

1. **Edge Function:**
   - קבלת הנתונים
   - הוספת `post_type: "main_signup_form_initial"`
   - שליחה ל-Make.com

2. **Supabase Insert:**
   - בדיקת משתמש קיים (email/phone)
   - אם קיים: זריקת שגיאה ידידותית
   - אם לא: INSERT חדש עם `status='pending'`

3. **Trigger אוטומטי:**
   - נוצרת רשומה ב-`professional_leads_crm`
   - צוות המכירות יכול לראות את הרשומה ולעקוב

#### נתונים שנשמרים

**ב-Webhook (Make.com):**
```json
{
  "post_type": "main_signup_form_initial",
  "firstName": "יוסי",
  "lastName": "כהן",
  "phone": "0501234567",
  "email": "yossi@example.com",
  "professions": [
    {
      "profession": "אינסטלטור",
      "specializations": ["אינסטלציה סניטרית", "גז"]
    }
  ],
  "workFields": ["בנייה חדשה", "שיפוצים"],
  "workRegions": ["תל אביב", "רמת גן"],
  "experience": "3-5 שנים",
  "city": "תל אביב",
  "companyName": "כהן אינסטלציה",
  "businessLicenseNumber": "123456789",
  "acceptTerms": true,
  "acceptMarketing": true,
  "utm_source": "google",
  "utm_medium": "cpc"
}
```

**ב-Supabase (`professionals`):**
```typescript
{
  name: "יוסי כהן",
  phone_number: "0501234567",
  email: "yossi@example.com",
  profession: "אינסטלטור",
  main_profession: "אינסטלטור",
  sub_specializations: ["אינסטלציה סניטרית", "גז"],
  location: "תל אביב",
  areas: '["תל אביב","רמת גן"]',  // JSON string
  experience_years: "3-5",
  company_name: "כהן אינסטלציה",
  business_license_number: "123456789",
  terms_accepted: true,
  marketing_consent: true,
  status: "pending",
  is_verified: false,
  rating: 0,
  review_count: 0
}
```

#### רשימת מקצועות (56)

<details>
<summary>לחץ לפתיחה (56 מקצועות + ~200 התמחויות)</summary>

**בנייה ושיפוצים:**
1. אינסטלטור
2. חשמלאי
3. שרברב
4. צבע
5. ריצוף
6. גבס
7. נגר
8. אלומיניום/זכוכית
9. איטום גגות
10. בנאי

**גינון וסביבה:**
11. גנן
12. מעצב גינות
13. ניקיון/הדברה

**שירותי כלכלה ומקצוע:**
14. רואה חשבון
15. עורך דין
16. מתווך נדל"ן
17. מעריך שמאי
18. יועץ משכנתאות

**בריאות ורווחה:**
19. פיזיותרפיסט
20. דיאטן
21. מטפל רפואי

**חינוך:**
22. מורה פרטי
23. מדריך כושר

**יופי וטיפוח:**
24. מעצב שיער
25. קוסמטיקאית

**שיווק דיגיטלי ותקשורת:**
26. צלם
27. מעצב גרפי
28. מנהל רשתות חברתיות
29. יועץ שיווק דיגיטלי

**רכב ותחבורה:**
30. מוסכניק
31. חשמלאי רכב
32. פחחות צבע
33. מוביל

**אירועים:**
34. DJ
35. צלם אירועים
36. קייטרינג

**+ אחר** - שדה חופשי

</details>

---

### 6.2 UTM Tracking

**מטרה:** מעקב אחרי מקורות תנועה ואפקטיביות ערוצי שיווק.

**Flow:**
1. משתמש נכנס עם UTM:  
   `https://ofair.co.il/?utm_source=facebook&utm_medium=paid&utm_campaign=summer2025`

2. `useUtmParams()` hook מזהה ושומר:
   ```typescript
   {
     utm_source: "facebook",
     utm_medium: "paid",
     utm_campaign: "summer2025",
     utm_term: "...",
     utm_content: "..."
   }
   ```

3. בשליחת טופס, הנתונים מצורפים:
   ```typescript
   const utmParams = getUtmParams();
   await submitSignupForm(formData, workFields, workRegions, utmParams);
   ```

4. ה-UTM נשמר:
   - ב-Webhook (Make.com) - לניתוח חיצוני
   - (אופציה עתידית: שמירה גם ב-DB)

**שימושים:**
- זיהוי ערוצי שיווק יעילים
- חישוב ROI
- A/B testing

---

### 6.3 Floating CTA Button

**רכיב:** `FloatingCTAButton.tsx`

**התנהגות:**
1. כפתור צף בצד ימין תחתון המסך
2. מופיע בזמן גלילה
3. **נעלם אוטומטית** כשהמשתמש מגיע לסקשן ההרשמה (`CtaSection`)
4. לחיצה → גלילה חלקה לטופס

**Implementation:**
```typescript
// Scroll Observer שעוקב אחרי הופעת הטופס
const isCtaSectionVisible = useScrollObserver("cta-section");

return (
  <button
    className={cn(
      "fixed bottom-6 right-6 z-50",
      isCtaSectionVisible && "hidden"  // מסתיר כשהטופס בתצוגה
    )}
    onClick={() => {
      document.getElementById("cta-section")?.scrollIntoView({
        behavior: "smooth"
      });
    }}
  >
    הצטרף עכשיו
  </button>
);
```

---

### 6.4 Notification System

**רכיב:** `NotificationPopup.tsx`

**מטרה:** הצגת אישור הרשמה מותאם אישית.

**Flow:**
1. משתמש שולח טופס
2. שליחה מצליחה
3. `showNotification()` נקרא עם:
   ```typescript
   showNotification({
     name: "יוסי כהן",
     phone: "050-1234567"
   });
   ```
4. Popup מוצג למשך 5 שניות:
   ```
   ┌─────────────────────────────────────┐
   │  ברוך הבא למשפחת oFair! 🎉         │
   │  שלום יוסי כהן                      │
   │  נרשמת בהצלחה למערכת oFair          │
   │  נציג יצור עמך קשר ב-050-1234567   │
   │  בקרוב                              │
   └─────────────────────────────────────┘
   ```

**Implementation:**
```typescript
<NotificationPopup
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  name={userData.name}
  phone={userData.phone}
/>
```

---

### 6.5 Contact Form

**רכיב:** `ContactSection.tsx`

**מטרה:** טופס יצירת קשר מהיר (ללא רישום).

**שדות:**
- שם מלא
- טלפון
- הודעה

**Flow:**
```typescript
submitContactForm(formData)
  → Webhook (Make.com)
  → Success Message
```

**ללא שמירה ב-DB** - רק Webhook לטיפול צוות.

---

## 7. אינטגרציות חיצוניות

### 7.1 Supabase

**URL:** `https://erlfsougrkzbgonumhoa.supabase.co`

**Publishable Key:** (מוגדר ב-`.env`)

**שירותים בשימוש:**

1. **Database (PostgreSQL)**
   - כל הטבלאות של המערכת
   - Row Level Security
   - Triggers & Functions

2. **Authentication**
   - (עתידי) - כרגע רישום ללא auth
   - Auth Tokens מותאמים למקצוענים

3. **Edge Functions**
   - `send-registration-webhook`
   - (עתידי) פונקציות נוספות

4. **Storage**
   - (עתידי) תמונות פרופיל
   - תמונות לידים/פרויקטים

**SDK:** `@supabase/supabase-js` v2.49.1

**Client Setup:**
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
```

**דוגמת שימוש:**
```typescript
const { data, error } = await supabase
  .from('professionals')
  .insert({
    name: 'John Doe',
    phone_number: '0501234567'
  });
```

---

### 7.2 Make.com Webhook

**URL:** `https://hook.eu2.make.com/4flq1xywuqf165vnw7v61hjn8ap6airq`

**Purpose:** קבלת טפסים והפעלת תהליכי אוטומציה.

**Integration Points:**

1. **טופס הרשמה:**
   ```typescript
   POST /4flq1xywuqf165vnw7v61hjn8ap6airq
   
   Body: {
     post_type: "main_signup_form_initial",
     firstName: "...",
     // ... כל שדות הטופס
     utm_source: "..."
   }
   ```

2. **טופס יצירת קשר:**
   ```typescript
   POST /4flq1xywuqf165vnw7v61hjn8ap6airq
   
   Body: {
     post_type: "contact_form",
     name: "...",
     phone: "...",
     message: "..."
   }
   ```

**שגיאות:**
- Timeout (30s)
- Network error
- Webhook validation failure

**תהליכים ב-Make (אפשריים):**
- שליחת אימייל לצוות
- הוספה ל-CRM חיצוני
- שליחת SMS לנרשם
- עדכון Google Sheets
- הפעלת WhatsApp API

---

### 7.3 Netlify

**Platform:** Deployment & Hosting

**Configuration:**

1. **Build Settings:**
   ```yaml
   # netlify.toml (אם יש)
   [build]
     command = "npm run build"
     publish = "dist"
   ```

2. **Redirects (SPA Support):**
   ```
   # public/_redirects
   /*    /index.html   200
   ```
   
   מבטיח ש-React Router יטפל בכל הנתיבים.

3. **Environment Variables:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

**Deploy Trigger:**
- Auto-deploy על push ל-`main` branch
- CI/CD דרך GitHub Actions

---

### 7.4 אינטגרציות עתידיות

#### GreenAPI (WhatsApp)
- שליחת הודעות WhatsApp אוטומטיות
- אישורי הגעה
- התראות על לידים חדשים

#### Tranzila (תשלומים)
- עיבוד כרטיסי אשראי
- חיוב חודשי/שנתי
- טוקניזציה של כרטיסים

#### Google Maps API
- אוטומציה של geocoding (lat/lng)
- חישוב מרחקים
- הצגת לידים על מפה

---

## 8. הגדרות פיתוח

### 8.1 דרישות מערכת

- **Node.js:** 18.x או גבוה יותר
- **Package Manager:** npm, yarn, או bun
- **Supabase CLI:** (אופציונלי) לפיתוח מקומי של Edge Functions

---

### 8.2 התקנה

```bash
# Clone the repository
git clone <repository-url>
cd ofair-app

# Install dependencies
npm install
# או
bun install
```

---

### 8.3 הרצה מקומית

```bash
# Development server
npm run dev

# או
bun run dev

# Server יעלה על: http://localhost:8080
```

**Hot Reload:** שינויים בקוד יתרעננו אוטומטית.

---

### 8.4 Build לפרודקשן

```bash
# Production build
npm run build

# Development build (עם source maps)
npm run build:dev

# Output directory: dist/
```

---

### 8.5 משתני סביבה

צור קובץ `.env` בשורש הפרויקט:

```env
# Supabase
VITE_SUPABASE_URL=https://erlfsougrkzbgonumhoa.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
VITE_SUPABASE_PROJECT_ID=erlfsougrkzbgonumhoa

# (אופציונלי) Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

**שים לב:** כל משתנה חייב להתחיל ב-`VITE_` כדי להיות זמין ב-Frontend.

---

### 8.6 מבנה תיקיות

```
ofair-app/
├── public/                    # קבצים סטטיים
│   ├── _redirects            # Netlify redirects
│   ├── hero-video.mp4        # וידאו רקע
│   └── lovable-uploads/      # תמונות שהועלו
├── src/
│   ├── components/           # רכיבי React
│   │   ├── ui/              # רכיבי shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── cta/             # רכיבי טופס הרשמה
│   │   │   ├── SignupForm.tsx
│   │   │   ├── form-sections/
│   │   │   │   ├── PersonalInfoSection.tsx
│   │   │   │   ├── BusinessDetailsSection.tsx
│   │   │   │   ├── OccupationDetailsSection.tsx
│   │   │   │   ├── WorkFieldsSection.tsx
│   │   │   │   ├── WorkRegionsSection.tsx
│   │   │   │   └── ExperienceSection.tsx
│   │   │   └── data/
│   │   │       ├── professionsAndSpecializations.ts
│   │   │       └── workFields.ts
│   │   ├── contact/         # רכיבי יצירת קשר
│   │   ├── HeroSection.tsx
│   │   ├── ProblemsSection.tsx
│   │   ├── BenefitsSection.tsx
│   │   └── ...
│   ├── hooks/               # Custom React Hooks
│   │   ├── useSignupForm.ts
│   │   ├── form/
│   │   │   ├── useFormState.ts
│   │   │   ├── useFormValidation.ts
│   │   │   └── useFieldHandlers.ts
│   │   └── useUtmParams.ts
│   ├── pages/               # דפי האפליקציה
│   │   ├── Index.tsx       # דף הבית
│   │   ├── Terms.tsx       # תנאי שימוש
│   │   └── NotFound.tsx    # 404
│   ├── services/            # שירותי API
│   │   └── formSubmission.ts
│   ├── types/               # TypeScript Types
│   │   └── signupForm.ts
│   ├── utils/               # פונקציות עזר
│   │   ├── formValidation.ts
│   │   ├── utmUtils.ts
│   │   ├── notification.tsx
│   │   └── ScrollObserver.tsx
│   ├── integrations/        # אינטגרציות חיצוניות
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   ├── index.css            # Tailwind CSS + Global Styles
│   ├── main.tsx             # Entry Point
│   └── App.tsx              # Root Component
├── supabase/
│   ├── functions/           # Edge Functions
│   │   └── send-registration-webhook/
│   │       └── index.ts
│   └── migrations/          # Database Migrations
├── docs/                    # דוקומנטציה
│   └── system_overview.md  # 👈 מסמך זה
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD
├── .env                     # משתני סביבה (לא ב-Git)
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

### 8.7 Scripts זמינים

```json
{
  "scripts": {
    "dev": "vite",                    // הרצה מקומית
    "build": "tsc && vite build",     // build לפרודקשן
    "build:dev": "tsc && vite build --mode development",
    "preview": "vite preview",        // תצוגה מקדימה של build
    "lint": "eslint ."               // lint קוד
  }
}
```

---

### 8.8 טיפים לפיתוח

1. **React DevTools:** התקן את התוסף לדפדפן
2. **Vite DevTools:** מובנה ב-Vite
3. **Supabase Studio:** `https://app.supabase.com/project/erlfsougrkzbgonumhoa`
4. **Network Tab:** עקוב אחרי קריאות API
5. **Console Logs:** הוסף `console.log` למעקב

---

## 9. אבטחה ותחזוקה

### 9.1 מנגנוני הרשאות

#### Row Level Security (RLS)
כל טבלה מוגנת עם Policies ברמת השורה:

**דוגמה (`professionals`):**
```sql
-- רק המקצוען רואה את הפרופיל המלא שלו
CREATE POLICY "Professionals can view own complete data"
ON public.professionals
FOR SELECT
USING (
  auth.uid() = user_id OR
  id IN (
    SELECT professional_id FROM auth_tokens
    WHERE token = current_token
    AND expires_at > now()
    AND is_active = true
  )
);
```

#### Function-Level Security
פונקציות מוגדרות כ-`SECURITY DEFINER` ובודקות הרשאות פנימית:

```sql
CREATE FUNCTION get_proposals_secure(token_param text)
RETURNS TABLE(...)
SECURITY DEFINER
AS $$
DECLARE
  current_professional_id uuid;
BEGIN
  -- בדיקת Token
  SELECT get_current_professional_id_secure(token_param)
  INTO current_professional_id;
  
  IF current_professional_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- החזרת נתונים מסוננים
  RETURN QUERY ...
END;
$$;
```

---

### 9.2 שמירת סודות

1. **משתני סביבה:**
   - `.env` לא נכלל ב-Git (`.gitignore`)
   - Netlify: הגדרת Environment Variables בממשק

2. **Supabase Secrets:**
   - מנוהלים בפלטפורמה
   - גישה רק דרך Edge Functions

3. **API Keys:**
   - Webhook URL לא רגיש (ציבורי)
   - Supabase Anon Key בטוח (RLS מגן)

---

### 9.3 ולידציות

#### Frontend
- **React Hook Form + Zod:**
  ```typescript
  const schema = z.object({
    email: z.string().email().optional(),
    phone: z.string().regex(/^0[2-9]\d{7,8}$/)
  });
  ```

#### Backend
- **Database Constraints:**
  ```sql
  ALTER TABLE professionals
  ADD CONSTRAINT phone_format
  CHECK (phone_number ~ '^0[2-9][0-9]{7,8}$');
  ```

- **RLS Policies:** מונעות גישה לא מורשית

---

### 9.4 לוגים ומעקב

1. **Console Logs (Development):**
   ```typescript
   console.log('Submitting form:', formData);
   ```

2. **Supabase Logs:**
   - Edge Function logs
   - Database query logs
   - Auth logs

3. **UTM Tracking:**
   - מעקב אחרי מקורות תנועה
   - ניתוח המרות

4. **Phone Revelations Tracking:**
   - כל חשיפת מספר טלפון נרשמת
   - IP, User Agent, Timestamp

---

### 9.5 שיפורים עתידיים מומלצים

#### תשתית
1. ✅ **Sentry** - ניטור שגיאות בזמן אמת
2. ✅ **Google Analytics 4** - ניתוח התנהגות משתמשים
3. ✅ **Mixpanel** - מעקב אירועים מתקדם
4. ✅ **LogRocket** - session replay

#### ביצועים
5. ✅ **Redis** - cache לשאילתות כבדות
6. ✅ **CDN** - הגשת assets מהירה יותר
7. ✅ **Image Optimization** - WebP, lazy loading
8. ✅ **Code Splitting** - טעינה מהירה יותר

#### אבטחה
9. ✅ **Rate Limiting** - הגנה מפני Brute Force
10. ✅ **CAPTCHA** - הגנה מפני בוטים
11. ✅ **2FA** - אימות דו-שלבי למקצוענים
12. ✅ **Encryption at Rest** - הצפנת נתונים רגישים

#### UX/UI
13. ✅ **PWA** - התקנה כאפליקציה
14. ✅ **Offline Support** - עבודה ללא אינטרנט
15. ✅ **Push Notifications** - התראות בזמן אמת
16. ✅ **Dark Mode** - מצב חשוך

#### פיתוח
17. ✅ **Storybook** - תיעוד רכיבים
18. ✅ **E2E Tests** - Playwright/Cypress
19. ✅ **Unit Tests** - Vitest/Jest
20. ✅ **CI/CD Improvements** - Automated testing

#### עסקי
21. ✅ **A/B Testing** - אופטימיזציית המרות
22. ✅ **Multi-language** - תמיכה בשפות נוספות
23. ✅ **SEO Optimization** - שיפור דירוג בגוגל
24. ✅ **Email Marketing** - אינטגרציה עם Mailchimp/SendGrid

---

## 10. אינדקס מהיר

### לפי נושא

**ארכיטקטורה:**
- [מבנה כללי](#1-מבנה-כללי-של-המערכת)
- [סטאק טכנולוגי](#13-סטאק-טכנולוגי)
- [זרימת נתונים](#12-זרימת-נתונים)

**Frontend:**
- [דף הבית](#21-דף-הבית-)
- [Hooks](#31-custom-hooks)
- [Utilities](#33-utilities-עזרים)
- [רכיבי UI](#21-דף-הבית-)

**Backend:**
- [Edge Functions](#4-edge-functions)
- [טבלאות מרכזיות](#51-טבלאות-עיקריות)
- [Database Functions](#54-database-functions-דוגמאות)

**פיצ'רים:**
- [רישום מקצוענים](#61-רישום-מקצוענים)
- [UTM Tracking](#62-utm-tracking)
- [Floating CTA](#63-floating-cta-button)
- [Notifications](#64-notification-system)

**אינטגרציות:**
- [Supabase](#71-supabase)
- [Make.com Webhook](#72-makecom-webhook)
- [Netlify](#73-netlify)

**פיתוח:**
- [התקנה](#82-התקנה)
- [הרצה מקומית](#83-הרצה-מקומית)
- [משתני סביבה](#85-משתני-סביבה)
- [מבנה תיקיות](#86-מבנה-תיקיות)

**אבטחה:**
- [RLS Policies](#91-מנגנוני-הרשאות)
- [ולידציות](#93-ולידציות)
- [שיפורים מומלצים](#95-שיפורים-עתידיים-מומלצים)

---

### קיצורי דרך למפתחים

```bash
# התקנה ראשונית
npm install

# הרצה מקומית
npm run dev

# Build לפרודקשן
npm run build

# בדיקת lint
npm run lint
```

**נתיבים חשובים:**
- Homepage: `/`
- Terms: `/terms`
- Supabase Studio: `https://app.supabase.com/project/erlfsougrkzbgonumhoa`

**קבצים חשובים:**
- טופס הרשמה: `src/components/cta/SignupForm.tsx`
- שליחת טופס: `src/services/formSubmission.ts`
- Edge Function: `supabase/functions/send-registration-webhook/index.ts`

---

## סיכום

מערכת **oFair** היא פלטפורמה מתקדמת לחיבור מקצוענים עם לקוחות, הבנויה על טכנולוגיות מודרניות ומאובטחות. המערכת כוללת:

✅ **56 מקצועות** + ~200 התמחויות משנה  
✅ **טופס הרשמה מקיף** עם ולידציות חכמות  
✅ **UTM Tracking** למעקב שיווקי  
✅ **Webhook Integration** לאוטומציה  
✅ **Supabase Backend** עם RLS מלא  
✅ **Edge Functions** לפעולות מאובטחות  
✅ **UI/UX מתקדם** עם Tailwind + Radix  

המערכת מוכנה להרחבה עם פיצ'רים נוספים כמו תשלומים, דירוגים, ניהול פרויקטים ועוד.

---

**גרסה:** 1.0  
**תאריך:** 26/10/2025  
**צוות:** oFair Development Team  

💙 **נבנה באהבה למקצוענים בישראל**
