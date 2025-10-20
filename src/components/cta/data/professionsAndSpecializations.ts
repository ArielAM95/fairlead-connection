export interface ProfessionWithSpecializations {
  id: string;
  label: string;
  specializations: {
    id: string;
    label: string;
  }[];
}

export const professionsWithSpecializations: ProfessionWithSpecializations[] = [
  {
    id: "plumber",
    label: "אינסטלטור",
    specializations: [
      { id: "leak-detection", label: "איתור נזילות" },
      { id: "unclogging", label: "פתיחת סתימות" },
      { id: "fixture-replacement", label: "החלפת כלים סניטריים" },
      { id: "pipe-installation", label: "התקנת צנרת" },
      { id: "greywater-systems", label: "התקנת מערכות מים אפורים" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "electrician",
    label: "חשמלאי",
    specializations: [
      { id: "licensed-electrician", label: "חשמלאי מוסמך" },
      { id: "master-electrician", label: "חשמלאי ראשי" },
      { id: "lighting-installation", label: "התקנת גופי תאורה" },
      { id: "safety-checks", label: "בדיקות תקינות" },
      { id: "panel-installation", label: "התקנת לוחות חשמל" },
      { id: "smart-electricity", label: "חשמל חכם" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "handyman",
    label: "שיפוצניק",
    specializations: [
      { id: "general-renovation", label: "שיפוץ כללי" },
      { id: "painting", label: "צבע" },
      { id: "drywall", label: "גבס" },
      { id: "flooring", label: "ריצוף" },
      { id: "tiling", label: "חיפוי" },
      { id: "wall-breaking", label: "שבירת קירות" },
      { id: "finish-repairs", label: "תיקוני גמר" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "hvac-installer",
    label: "מתקין מערכות מיזוג",
    specializations: [
      { id: "regular-ac", label: "התקנת מזגן רגיל" },
      { id: "mini-central", label: "מיני מרכזי" },
      { id: "vrf", label: "VRF" },
      { id: "ac-repair", label: "תיקוני מזגנים" },
      { id: "internal-cleaning", label: "ניקוי פנימי" },
      { id: "ventilation-systems", label: "מערכות אוורור" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "locksmith",
    label: "מנעולן",
    specializations: [
      { id: "door-opening", label: "פריצת דלתות" },
      { id: "cylinder-replacement", label: "החלפת צילינדר" },
      { id: "car-lockout", label: "פריצת רכבים" },
      { id: "smart-lock-installation", label: "התקנת מנעולים חכמים" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "solar-water-heater-tech",
    label: "טכנאי דודי שמש",
    specializations: [
      { id: "heater-repair", label: "תיקון דודים" },
      { id: "heater-installation", label: "התקנה" },
      { id: "heater-maintenance", label: "תחזוקה" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "appliance-tech",
    label: "טכנאי מכשירי חשמל",
    specializations: [
      { id: "washing-machines", label: "מכונות כביסה" },
      { id: "dishwashers", label: "מדיחי כלים" },
      { id: "ovens", label: "תנורים" },
      { id: "dryers", label: "מייבשים" },
      { id: "refrigerators", label: "מקררים" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "contractor",
    label: "קבלן בנייה",
    specializations: [
      { id: "frame", label: "שלד" },
      { id: "finish", label: "גמר" },
      { id: "turnkey", label: "מפתח" },
      { id: "earthwork", label: "עבודות עפר" },
      { id: "construction", label: "קונסטרוקציה" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "building-engineer",
    label: "מהנדס בניין",
    specializations: [
      { id: "home-inspection", label: "בדק בית" },
      { id: "engineering-opinion", label: "חוות דעת הנדסית" },
      { id: "planning-permits", label: "תכנונים ואישורים" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "surveyor",
    label: "מודד מוסמך",
    specializations: [
      { id: "area-surveyor", label: "מודד שטחים" },
      { id: "construction-surveying", label: "מדידות לבנייה" },
      { id: "surveying-files", label: "תיקי מדידה" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "architect",
    label: "אדריכל",
    specializations: [
      { id: "house-planning", label: "תכנון בתים" },
      { id: "building-additions", label: "תוספות בניה" },
      { id: "municipal-submissions", label: "הגשות לעירייה" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "landscape-architect",
    label: "אדריכל נוף",
    specializations: [
      { id: "gardens", label: "גינות" },
      { id: "environmental-development", label: "פיתוח סביבתי" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "gardener",
    label: "גנן",
    specializations: [
      { id: "garden-establishment", label: "הקמת גינות" },
      { id: "garden-maintenance", label: "תחזוקה" },
      { id: "synthetic-grass", label: "דשא סינטטי" },
      { id: "automatic-irrigation", label: "השקיה אוטומטית" },
      { id: "decks-pergolas", label: "דקים ופרגולות" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "pest-control",
    label: "מדביר",
    specializations: [
      { id: "green-pest-control", label: "הדברה ירוקה" },
      { id: "termites", label: "טרמיטים" },
      { id: "rodents", label: "מכרסמים" },
      { id: "cockroaches", label: "תיקנים" },
      { id: "mosquitoes", label: "יתושים" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "cleaner",
    label: "מנקה",
    specializations: [
      { id: "cleaning-apartments", label: "דירות" },
      { id: "post-renovation", label: "לאחר שיפוץ" },
      { id: "cleaning-offices", label: "משרדים" },
      { id: "upholstery-cleaning", label: "ניקוי ספות" },
      { id: "polish-wax", label: "פוליש ווקס" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "accountant",
    label: "רואה חשבון",
    specializations: [
      { id: "annual-reports", label: "דוחות שנתיים" },
      { id: "bookkeeping", label: "הנהלת חשבונות" },
      { id: "business-registration", label: "פתיחת עוסק" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "tax-consultant",
    label: "יועץ מס",
    specializations: [
      { id: "tax-returns", label: "החזרי מס" },
      { id: "tax-planning", label: "תכנון מס" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "lawyer",
    label: "עורך דין",
    specializations: [
      { id: "real-estate", label: "נדל\"ן" },
      { id: "family-law", label: "דיני משפחה" },
      { id: "criminal", label: "פלילי" },
      { id: "execution", label: "הוצאה לפועל" },
      { id: "contracts", label: "חוזים" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "real-estate-appraiser",
    label: "שמאי מקרקעין",
    specializations: [
      { id: "apartment-appraisals", label: "שומות לדירות" },
      { id: "property-value-opinion", label: "חוות דעת שווי נכס" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "mediator",
    label: "מגשר",
    specializations: [
      { id: "divorce", label: "גירושין" },
      { id: "business-disputes", label: "סכסוכים עסקיים" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "insurance-agent",
    label: "סוכן ביטוח",
    specializations: [
      { id: "life-insurance", label: "ביטוח חיים" },
      { id: "health-insurance", label: "ביטוח בריאות" },
      { id: "home-insurance", label: "ביטוח דירה" },
      { id: "car-insurance", label: "ביטוח רכב" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "psychologist",
    label: "פסיכולוג",
    specializations: [
      { id: "clinical", label: "קליני" },
      { id: "children", label: "ילדים" },
      { id: "youth", label: "נוער" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "emotional-therapist",
    label: "מטפל רגשי",
    specializations: [
      { id: "cbt", label: "CBT" },
      { id: "nlp", label: "NLP" },
      { id: "couples-therapy", label: "טיפול זוגי" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "personal-coach",
    label: "מאמן אישי",
    specializations: [
      { id: "career", label: "קריירה" },
      { id: "relationships", label: "זוגיות" },
      { id: "personal-development", label: "התפתחות אישית" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "private-tutor",
    label: "מורה פרטי",
    specializations: [
      { id: "math", label: "מתמטיקה" },
      { id: "english", label: "אנגלית" },
      { id: "bagrut-prep", label: "הכנה לבגרויות" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "psychometric-instructor",
    label: "מדריך פסיכומטרי",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "arts-teacher",
    label: "מורה לאומנויות",
    specializations: [
      { id: "drawing", label: "ציור" },
      { id: "sculpture", label: "פיסול" },
      { id: "drama", label: "דרמה" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "private-nanny",
    label: "גננת פרטית / מטפלת",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "cosmetician",
    label: "קוסמטיקאית",
    specializations: [
      { id: "facial-treatments", label: "טיפולי פנים" },
      { id: "hair-removal", label: "הסרת שיער" },
      { id: "peeling", label: "פילינג" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "hairdresser",
    label: "ספר / מעצב שיער",
    specializations: [
      { id: "women", label: "נשים" },
      { id: "men", label: "גברים" },
      { id: "bridal-hair", label: "תסרוקות כלה" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "makeup-artist",
    label: "מאפרת",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "nail-tech",
    label: "בניית ציפורניים",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "brow-designer",
    label: "עיצוב גבות",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "photographer",
    label: "צלם",
    specializations: [
      { id: "events", label: "אירועים" },
      { id: "studio", label: "סטודיו" },
      { id: "branding", label: "תדמית" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "video-editor",
    label: "עורך וידאו",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "graphic-designer",
    label: "גרפיקאי",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "web-developer",
    label: "בונה אתרים",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "seo-specialist",
    label: "מקדם אתרים (SEO)",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "ppc-manager",
    label: "מנהל קמפיינים ממומנים",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "social-media-manager",
    label: "ניהול סושיאל",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "content-writer",
    label: "כתיבת תוכן",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "ux-ui-designer",
    label: "מעצב UX/UI",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "freelance-developer",
    label: "מתכנת פרילנסר",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "moving-company",
    label: "חברת הובלות",
    specializations: [
      { id: "moving-apartment", label: "דירה" },
      { id: "moving-offices", label: "משרדים" },
      { id: "small-moves", label: "הובלות קטנות" },
      { id: "storage", label: "אחסון" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "garage",
    label: "מוסך",
    specializations: [
      { id: "mobile-garage", label: "מוסך נייד" },
      { id: "repairs", label: "תיקונים" },
      { id: "routine-treatments", label: "טיפולים שוטפים" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "towing-service",
    label: "שירותי גרירה",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "car-wash",
    label: "שטיפת רכבים",
    specializations: [
      { id: "home-service", label: "עד הבית" },
      { id: "exterior-interior", label: "חוץ ופנים" },
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "dj",
    label: "DJ",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "catering",
    label: "שירותי קייטרינג",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "active-bar",
    label: "בר אקטיבי",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "kids-entertainment",
    label: "הפעלות לילדים",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "inflatables",
    label: "מתנפחים",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "balloon-decor",
    label: "עיצוב בלונים",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "magnet-photography",
    label: "צילום מגנטים",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "event-production",
    label: "הפקת אירועים",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  },
  {
    id: "event-host",
    label: "מנחה אירועים",
    specializations: [
      { id: "other", label: "אחר" }
    ]
  }
];

// Helper functions
export const getSpecializationsByProfession = (professionId: string) => {
  const profession = professionsWithSpecializations.find(p => p.id === professionId);
  return profession ? profession.specializations : [];
};

export const getProfessionLabel = (professionId: string) => {
  const profession = professionsWithSpecializations.find(p => p.id === professionId);
  return profession ? profession.label : professionId;
};

export const getSpecializationLabel = (professionId: string, specializationId: string) => {
  const profession = professionsWithSpecializations.find(p => p.id === professionId);
  if (!profession) return specializationId;
  const spec = profession.specializations.find(s => s.id === specializationId);
  return spec ? spec.label : specializationId;
};
