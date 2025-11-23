export interface SubArea {
  id: string; // תואם ל-sub_area בטבלה
  label: string;
  examples: string; // דוגמאות ערים
}

export interface MainRegion {
  id: string;
  label: string;
  icon: string;
  subAreas: SubArea[];
}

export const workRegionsHierarchy: MainRegion[] = [
  {
    id: "center",
    label: "אזור המרכז",
    icon: "📍",
    subAreas: [
      {
        id: "גוש דן",
        label: "גוש דן",
        examples: "תל אביב, רמת גן, גבעתיים, בני ברק, חולון, בת ים, קריית אונו, יהוד"
      },
      {
        id: "השרון",
        label: "השרון",
        examples: "נתניה, הרצליה, רעננה, כפר סבא, הוד השרון, חדרה, קיסריה"
      },
      {
        id: "השפלה",
        label: "השפלה",
        examples: "ראשון לציון, רחובות, נס ציונה, יבנה, גדרה, רמלה, לוד, מודיעין"
      },
      {
        id: "פתח תקווה והסביבה",
        label: "פתח תקווה והסביבה",
        examples: "פתח תקווה, ראש העין, אלעד, שוהם"
      }
    ]
  },
  {
    id: "north",
    label: "אזור הצפון",
    icon: "📍",
    subAreas: [
      {
        id: "חיפה והקריות",
        label: "חיפה והקריות",
        examples: "חיפה, נשר, טירת כרמל, הקריות"
      },
      {
        id: "הגליל המערבי",
        label: "הגליל המערבי",
        examples: "נהריה, עכו, כרמיאל, מעלות-תרשיחא"
      },
      {
        id: "הגליל העליון",
        label: "הגליל העליון",
        examples: "צפת, קריית שמונה, ראש פינה, חצור הגלילית"
      },
      {
        id: "העמקים והגליל התחתון",
        label: "העמקים והגליל התחתון",
        examples: "עפולה, נצרת, טבריה, בית שאן, יקנעם"
      },
      {
        id: "רמת הגולן",
        label: "רמת הגולן",
        examples: "קצרין ויישובי הגולן"
      }
    ]
  },
  {
    id: "south",
    label: "אזור הדרום",
    icon: "📍",
    subAreas: [
      {
        id: "באר שבע והנגב",
        label: "באר שבע והנגב",
        examples: "באר שבע, נתיבות, אופקים, דימונה, ירוחם"
      },
      {
        id: "אשדוד-אשקלון והסביבה",
        label: "אשדוד - אשקלון והסביבה",
        examples: "אשדוד, אשקלון, קריית גת, שדרות, קריית מלאכי"
      },
      {
        id: "אילת והערבה",
        label: "אילת והערבה",
        examples: "אילת, מצפה רמון, יישובי הערבה"
      }
    ]
  },
  {
    id: "jerusalem",
    label: "ירושלים והסביבה",
    icon: "📍",
    subAreas: [
      {
        id: "ירושלים",
        label: "ירושלים",
        examples: "העיר עצמה"
      },
      {
        id: "סובב ירושלים",
        label: "סובב ירושלים",
        examples: "בית שמש, מבשרת ציון, אבו גוש, צור הדסה"
      }
    ]
  },
  {
    id: "judea-samaria",
    label: "יהודה ושומרון",
    icon: "📍",
    subAreas: [
      {
        id: "שומרון",
        label: "שומרון",
        examples: "אריאל, קרני שומרון, אלפי מנשה, קדומים"
      },
      {
        id: "בנימין",
        label: "בנימין וגוש עציון",
        examples: "מעלה אדומים, אפרת, ביתר עילית, גבעת זאב, מודיעין עילית"
      },
      {
        id: "יהודה וגוש עציון",
        label: "יהודה וגוש עציון",
        examples: "חברון, קריית ארבע, יישובי הר חברון"
      },
      {
        id: "בקעת הירדן",
        label: "בקעת הירדן",
        examples: "מעלה אפרים ויישובי הבקעה"
      }
    ]
  }
];
