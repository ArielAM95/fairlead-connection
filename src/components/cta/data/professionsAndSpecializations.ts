export interface ProfessionWithSpecializations {
  id: string;
  label: string;
  number: string;
  specializations: {
    id: string;
    label: string;
    number: string;
  }[];
}

export const professionsWithSpecializations: ProfessionWithSpecializations[] = [
  {
    id: "plumber",
    label: "אינסטלטור",
    number: "1",
    specializations: [
      { id: "leak-detection", label: "איתור נזילות", number: "1.1" },
      { id: "unclogging", label: "פתיחת סתימות", number: "1.2" },
      { id: "fixture-replacement", label: "החלפת כלים סניטריים", number: "1.3" },
      { id: "pipe-installation", label: "התקנת צנרת", number: "1.4" },
      { id: "greywater-systems", label: "התקנת מערכות מים אפורים", number: "1.5" }
    ]
  },
  {
    id: "electrician",
    label: "חשמלאי",
    number: "2",
    specializations: [
      { id: "licensed-electrician", label: "חשמלאי מוסמך", number: "2.1" },
      { id: "master-electrician", label: "חשמלאי ראשי", number: "2.2" },
      { id: "lighting-installation", label: "התקנת גופי תאורה", number: "2.3" },
      { id: "safety-checks", label: "בדיקות תקינות", number: "2.4" },
      { id: "panel-installation", label: "התקנת לוחות חשמל", number: "2.5" },
      { id: "smart-electricity", label: "חשמל חכם", number: "2.6" }
    ]
  },
  {
    id: "handyman",
    label: "שיפוצניק",
    number: "3",
    specializations: [
      { id: "general-renovation", label: "שיפוץ כללי", number: "3.1" },
      { id: "painting", label: "צבע", number: "3.2" },
      { id: "drywall", label: "גבס", number: "3.3" },
      { id: "flooring", label: "ריצוף", number: "3.4" },
      { id: "tiling", label: "חיפוי", number: "3.5" },
      { id: "wall-breaking", label: "שבירת קירות", number: "3.6" },
      { id: "finish-repairs", label: "תיקוני גמר", number: "3.7" }
    ]
  },
  {
    id: "hvac-installer",
    label: "מתקין מערכות מיזוג",
    number: "4",
    specializations: [
      { id: "regular-ac", label: "התקנת מזגן רגיל", number: "4.1" },
      { id: "mini-central", label: "מיני מרכזי", number: "4.2" },
      { id: "vrf", label: "VRF", number: "4.3" },
      { id: "ac-repair", label: "תיקוני מזגנים", number: "4.4" },
      { id: "internal-cleaning", label: "ניקוי פנימי", number: "4.5" },
      { id: "ventilation-systems", label: "מערכות אוורור", number: "4.6" }
    ]
  },
  {
    id: "locksmith",
    label: "מנעולן",
    number: "5",
    specializations: [
      { id: "door-opening", label: "פריצת דלתות", number: "5.1" },
      { id: "cylinder-replacement", label: "החלפת צילינדר", number: "5.2" },
      { id: "car-lockout", label: "פריצת רכבים", number: "5.3" },
      { id: "smart-lock-installation", label: "התקנת מנעולים חכמים", number: "5.4" }
    ]
  },
  {
    id: "solar-water-heater-tech",
    label: "טכנאי דודי שמש",
    number: "6",
    specializations: [
      { id: "heater-repair", label: "תיקון דודים", number: "6.1" },
      { id: "heater-installation", label: "התקנה", number: "6.2" },
      { id: "heater-maintenance", label: "תחזוקה", number: "6.3" }
    ]
  },
  {
    id: "appliance-tech",
    label: "טכנאי מכשירי חשמל",
    number: "7",
    specializations: [
      { id: "washing-machines", label: "מכונות כביסה", number: "7.1" },
      { id: "dishwashers", label: "מדיחי כלים", number: "7.2" },
      { id: "ovens", label: "תנורים", number: "7.3" },
      { id: "dryers", label: "מייבשים", number: "7.4" },
      { id: "refrigerators", label: "מקררים", number: "7.5" }
    ]
  },
  {
    id: "contractor",
    label: "קבלן בנייה",
    number: "8",
    specializations: [
      { id: "frame", label: "שלד", number: "8.1" },
      { id: "finish", label: "גמר", number: "8.2" },
      { id: "turnkey", label: "מפתח", number: "8.3" },
      { id: "earthwork", label: "עבודות עפר", number: "8.4" },
      { id: "construction", label: "קונסטרוקציה", number: "8.5" }
    ]
  },
  {
    id: "building-engineer",
    label: "מהנדס בניין",
    number: "9",
    specializations: [
      { id: "home-inspection", label: "בדק בית", number: "9.1" },
      { id: "engineering-opinion", label: "חוות דעת הנדסית", number: "9.2" },
      { id: "planning-permits", label: "תכנונים ואישורים", number: "9.3" }
    ]
  },
  {
    id: "surveyor",
    label: "מודד מוסמך",
    number: "10",
    specializations: [
      { id: "area-surveyor", label: "מודד שטחים", number: "10.1" },
      { id: "construction-surveying", label: "מדידות לבנייה", number: "10.2" },
      { id: "surveying-files", label: "תיקי מדידה", number: "10.3" }
    ]
  },
  {
    id: "architect",
    label: "אדריכל",
    number: "11",
    specializations: [
      { id: "house-planning", label: "תכנון בתים", number: "11.1" },
      { id: "building-additions", label: "תוספות בניה", number: "11.2" },
      { id: "municipal-submissions", label: "הגשות לעירייה", number: "11.3" }
    ]
  },
  {
    id: "landscape-architect",
    label: "אדריכל נוף",
    number: "12",
    specializations: [
      { id: "gardens", label: "גינות", number: "12.1" },
      { id: "environmental-development", label: "פיתוח סביבתי", number: "12.2" }
    ]
  },
  {
    id: "gardener",
    label: "גנן",
    number: "13",
    specializations: [
      { id: "garden-establishment", label: "הקמת גינות", number: "13.1" },
      { id: "garden-maintenance", label: "תחזוקה", number: "13.2" },
      { id: "synthetic-grass", label: "דשא סינטטי", number: "13.3" },
      { id: "automatic-irrigation", label: "השקיה אוטומטית", number: "13.4" },
      { id: "decks-pergolas", label: "דקים ופרגולות", number: "13.5" }
    ]
  },
  {
    id: "pest-control",
    label: "מדביר",
    number: "14",
    specializations: [
      { id: "green-pest-control", label: "הדברה ירוקה", number: "14.1" },
      { id: "termites", label: "טרמיטים", number: "14.2" },
      { id: "rodents", label: "מכרסמים", number: "14.3" },
      { id: "cockroaches", label: "תיקנים", number: "14.4" },
      { id: "mosquitoes", label: "יתושים", number: "14.5" }
    ]
  },
  {
    id: "cleaner",
    label: "מנקה",
    number: "15",
    specializations: [
      { id: "cleaning-apartments", label: "דירות", number: "15.1" },
      { id: "post-renovation", label: "לאחר שיפוץ", number: "15.2" },
      { id: "cleaning-offices", label: "משרדים", number: "15.3" },
      { id: "upholstery-cleaning", label: "ניקוי ספות", number: "15.4" },
      { id: "polish-wax", label: "פוליש ווקס", number: "15.5" }
    ]
  },
  {
    id: "accountant",
    label: "רואה חשבון",
    number: "16",
    specializations: [
      { id: "annual-reports", label: "דוחות שנתיים", number: "16.1" },
      { id: "bookkeeping", label: "הנהלת חשבונות", number: "16.2" },
      { id: "business-registration", label: "פתיחת עוסק", number: "16.3" }
    ]
  },
  {
    id: "tax-consultant",
    label: "יועץ מס",
    number: "17",
    specializations: [
      { id: "tax-returns", label: "החזרי מס", number: "17.1" },
      { id: "tax-planning", label: "תכנון מס", number: "17.2" }
    ]
  },
  {
    id: "lawyer",
    label: "עורך דין",
    number: "18",
    specializations: [
      { id: "real-estate", label: "נדל\"ן", number: "18.1" },
      { id: "family-law", label: "דיני משפחה", number: "18.2" },
      { id: "criminal", label: "פלילי", number: "18.3" },
      { id: "execution", label: "הוצאה לפועל", number: "18.4" },
      { id: "contracts", label: "חוזים", number: "18.5" }
    ]
  },
  {
    id: "real-estate-appraiser",
    label: "שמאי מקרקעין",
    number: "19",
    specializations: [
      { id: "apartment-appraisals", label: "שומות לדירות", number: "19.1" },
      { id: "property-value-opinion", label: "חוות דעת שווי נכס", number: "19.2" }
    ]
  },
  {
    id: "mediator",
    label: "מגשר",
    number: "20",
    specializations: [
      { id: "divorce", label: "גירושין", number: "20.1" },
      { id: "business-disputes", label: "סכסוכים עסקיים", number: "20.2" }
    ]
  },
  {
    id: "insurance-agent",
    label: "סוכן ביטוח",
    number: "21",
    specializations: [
      { id: "life-insurance", label: "ביטוח חיים", number: "21.1" },
      { id: "health-insurance", label: "ביטוח בריאות", number: "21.2" },
      { id: "home-insurance", label: "ביטוח דירה", number: "21.3" },
      { id: "car-insurance", label: "ביטוח רכב", number: "21.4" }
    ]
  },
  {
    id: "psychologist",
    label: "פסיכולוג",
    number: "22",
    specializations: [
      { id: "clinical", label: "קליני", number: "22.1" },
      { id: "children", label: "ילדים", number: "22.2" },
      { id: "youth", label: "נוער", number: "22.3" }
    ]
  },
  {
    id: "emotional-therapist",
    label: "מטפל רגשי",
    number: "23",
    specializations: [
      { id: "cbt", label: "CBT", number: "23.1" },
      { id: "nlp", label: "NLP", number: "23.2" },
      { id: "couples-therapy", label: "טיפול זוגי", number: "23.3" }
    ]
  },
  {
    id: "personal-coach",
    label: "מאמן אישי",
    number: "24",
    specializations: [
      { id: "career", label: "קריירה", number: "24.1" },
      { id: "relationships", label: "זוגיות", number: "24.2" },
      { id: "personal-development", label: "התפתחות אישית", number: "24.3" }
    ]
  },
  {
    id: "private-tutor",
    label: "מורה פרטי",
    number: "25",
    specializations: [
      { id: "math", label: "מתמטיקה", number: "25.1" },
      { id: "english", label: "אנגלית", number: "25.2" },
      { id: "bagrut-prep", label: "הכנה לבגרויות", number: "25.3" }
    ]
  },
  {
    id: "psychometric-instructor",
    label: "מדריך פסיכומטרי",
    number: "26",
    specializations: []
  },
  {
    id: "arts-teacher",
    label: "מורה לאומנויות",
    number: "27",
    specializations: [
      { id: "drawing", label: "ציור", number: "27.1" },
      { id: "sculpture", label: "פיסול", number: "27.2" },
      { id: "drama", label: "דרמה", number: "27.3" }
    ]
  },
  {
    id: "private-nanny",
    label: "גננת פרטית / מטפלת",
    number: "28",
    specializations: []
  },
  {
    id: "cosmetician",
    label: "קוסמטיקאית",
    number: "29",
    specializations: [
      { id: "facial-treatments", label: "טיפולי פנים", number: "29.1" },
      { id: "hair-removal", label: "הסרת שיער", number: "29.2" },
      { id: "peeling", label: "פילינג", number: "29.3" }
    ]
  },
  {
    id: "hairdresser",
    label: "ספר / מעצב שיער",
    number: "30",
    specializations: [
      { id: "women", label: "נשים", number: "30.1" },
      { id: "men", label: "גברים", number: "30.2" },
      { id: "bridal-hair", label: "תסרוקות כלה", number: "30.3" }
    ]
  },
  {
    id: "makeup-artist",
    label: "מאפרת",
    number: "31",
    specializations: []
  },
  {
    id: "nail-tech",
    label: "בניית ציפורניים",
    number: "32",
    specializations: []
  },
  {
    id: "brow-designer",
    label: "עיצוב גבות",
    number: "33",
    specializations: []
  },
  {
    id: "photographer",
    label: "צלם",
    number: "34",
    specializations: [
      { id: "events", label: "אירועים", number: "34.1" },
      { id: "studio", label: "סטודיו", number: "34.2" },
      { id: "branding", label: "תדמית", number: "34.3" }
    ]
  },
  {
    id: "video-editor",
    label: "עורך וידאו",
    number: "35",
    specializations: []
  },
  {
    id: "graphic-designer",
    label: "גרפיקאי",
    number: "36",
    specializations: []
  },
  {
    id: "web-developer",
    label: "בונה אתרים",
    number: "37",
    specializations: []
  },
  {
    id: "seo-specialist",
    label: "מקדם אתרים (SEO)",
    number: "38",
    specializations: []
  },
  {
    id: "ppc-manager",
    label: "מנהל קמפיינים ממומנים",
    number: "39",
    specializations: []
  },
  {
    id: "social-media-manager",
    label: "ניהול סושיאל",
    number: "40",
    specializations: []
  },
  {
    id: "content-writer",
    label: "כתיבת תוכן",
    number: "41",
    specializations: []
  },
  {
    id: "ux-ui-designer",
    label: "מעצב UX/UI",
    number: "42",
    specializations: []
  },
  {
    id: "freelance-developer",
    label: "מתכנת פרילנסר",
    number: "43",
    specializations: []
  },
  {
    id: "moving-company",
    label: "חברת הובלות",
    number: "44",
    specializations: [
      { id: "moving-apartment", label: "דירה", number: "44.1" },
      { id: "moving-offices", label: "משרדים", number: "44.2" },
      { id: "small-moves", label: "הובלות קטנות", number: "44.3" },
      { id: "storage", label: "אחסון", number: "44.4" }
    ]
  },
  {
    id: "garage",
    label: "מוסך",
    number: "45",
    specializations: [
      { id: "mobile-garage", label: "מוסך נייד", number: "45.1" },
      { id: "repairs", label: "תיקונים", number: "45.2" },
      { id: "routine-treatments", label: "טיפולים שוטפים", number: "45.3" }
    ]
  },
  {
    id: "towing-service",
    label: "שירותי גרירה",
    number: "46",
    specializations: []
  },
  {
    id: "car-wash",
    label: "שטיפת רכבים",
    number: "47",
    specializations: [
      { id: "home-service", label: "עד הבית", number: "47.1" },
      { id: "exterior-interior", label: "חוץ ופנים", number: "47.2" }
    ]
  },
  {
    id: "dj",
    label: "DJ",
    number: "48",
    specializations: []
  },
  {
    id: "catering",
    label: "שירותי קייטרינג",
    number: "49",
    specializations: []
  },
  {
    id: "active-bar",
    label: "בר אקטיבי",
    number: "50",
    specializations: []
  },
  {
    id: "kids-entertainment",
    label: "הפעלות לילדים",
    number: "51",
    specializations: []
  },
  {
    id: "inflatables",
    label: "מתנפחים",
    number: "52",
    specializations: []
  },
  {
    id: "balloon-decor",
    label: "עיצוב בלונים",
    number: "53",
    specializations: []
  },
  {
    id: "magnet-photography",
    label: "צילום מגנטים",
    number: "54",
    specializations: []
  },
  {
    id: "event-production",
    label: "הפקת אירועים",
    number: "55",
    specializations: []
  },
  {
    id: "event-host",
    label: "מנחה אירועים",
    number: "56",
    specializations: []
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
