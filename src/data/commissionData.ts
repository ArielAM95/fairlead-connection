import { CommissionInfo, CommissionCalculation } from '@/types/commission';

// Helper functions for calculations
const calculateFixed10 = (amount: number): CommissionCalculation => ({
  percentage: '10%',
  commission: amount * 0.1,
  netAmount: amount * 0.9
});

const calculateTiered5000 = (amount: number): CommissionCalculation => {
  if (amount <= 5000) {
    return {
      percentage: '10%',
      commission: amount * 0.1,
      netAmount: amount * 0.9
    };
  }
  
  const firstTier = 5000 * 0.1;
  const secondTier = (amount - 5000) * 0.05;
  const totalCommission = firstTier + secondTier;
  
  return {
    percentage: `${((totalCommission / amount) * 100).toFixed(1)}%`,
    commission: totalCommission,
    netAmount: amount - totalCommission,
    breakdown: `• על ה-5,000 ₪ הראשונים: 10% = ₪${firstTier.toLocaleString('he-IL')}\n• על ה-${(amount - 5000).toLocaleString('he-IL')} ₪ הנותרים: 5% = ₪${secondTier.toLocaleString('he-IL')}\n• סה"כ עמלה: ₪${totalCommission.toLocaleString('he-IL')}`
  };
};

const calculateTiered1000 = (amount: number): CommissionCalculation => {
  if (amount <= 1000) {
    return {
      percentage: '10%',
      commission: amount * 0.1,
      netAmount: amount * 0.9
    };
  }
  
  const firstTier = 1000 * 0.1;
  const secondTier = (amount - 1000) * 0.05;
  const totalCommission = firstTier + secondTier;
  
  return {
    percentage: `${((totalCommission / amount) * 100).toFixed(1)}%`,
    commission: totalCommission,
    netAmount: amount - totalCommission,
    breakdown: `• על ה-1,000 ₪ הראשונים: 10% = ₪${firstTier.toLocaleString('he-IL')}\n• על ה-${(amount - 1000).toLocaleString('he-IL')} ₪ הנותרים: 5% = ₪${secondTier.toLocaleString('he-IL')}\n• סה"כ עמלה: ₪${totalCommission.toLocaleString('he-IL')}`
  };
};

const calculateContractor = (amount: number): CommissionCalculation => {
  if (amount <= 100000) {
    return {
      percentage: '5%',
      commission: amount * 0.05,
      netAmount: amount * 0.95
    };
  }
  
  const firstTier = 100000 * 0.05;
  const secondTier = (amount - 100000) * 0.02;
  const totalCommission = firstTier + secondTier;
  
  return {
    percentage: `${((totalCommission / amount) * 100).toFixed(1)}%`,
    commission: totalCommission,
    netAmount: amount - totalCommission,
    breakdown: `• על ה-100,000 ₪ הראשונים: 5% = ₪${firstTier.toLocaleString('he-IL')}\n• על ה-${(amount - 100000).toLocaleString('he-IL')} ₪ הנותרים: 2% = ₪${secondTier.toLocaleString('he-IL')}\n• סה"כ עמלה: ₪${totalCommission.toLocaleString('he-IL')}`
  };
};

const calculateHVAC = (amount: number): CommissionCalculation => {
  if (amount <= 2000) {
    return {
      percentage: '8%',
      commission: amount * 0.08,
      netAmount: amount * 0.92
    };
  }
  
  const firstTier = 2000 * 0.08;
  const secondTier = (amount - 2000) * 0.02;
  const totalCommission = firstTier + secondTier;
  
  return {
    percentage: `${((totalCommission / amount) * 100).toFixed(1)}%`,
    commission: totalCommission,
    netAmount: amount - totalCommission,
    breakdown: `• על ה-2,000 ₪ הראשונים: 8% = ₪${firstTier.toLocaleString('he-IL')}\n• על ה-${(amount - 2000).toLocaleString('he-IL')} ₪ הנותרים: 2% = ₪${secondTier.toLocaleString('he-IL')}\n• סה"כ עמלה: ₪${totalCommission.toLocaleString('he-IL')}`
  };
};

export const commissionsData: CommissionInfo[] = [
  // Category A - 10% קבוע, 180 ימים
  {
    professionId: 'lawyer',
    professionLabel: 'עורך דין',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'עורך דין משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 180
  },
  {
    professionId: 'accountant',
    professionLabel: 'רואה חשבון',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'רואה חשבון משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 180
  },
  {
    professionId: 'tax-consultant',
    professionLabel: 'יועץ מס',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'יועץ מס משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 180
  },
  {
    professionId: 'architect',
    professionLabel: 'אדריכל',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'אדריכל משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 180
  },
  {
    professionId: 'building-engineer',
    professionLabel: 'מהנדס בניין',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מהנדס בניין משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 180
  },
  {
    professionId: 'real-estate-appraiser',
    professionLabel: 'שמאי מקרקעין',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'שמאי מקרקעין משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 180
  },
  {
    professionId: 'insurance-agent',
    professionLabel: 'סוכן ביטוח',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'סוכן ביטוח משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 180
  },
  {
    professionId: 'mediator',
    professionLabel: 'מגשר',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מגשר משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 180
  },
  {
    professionId: 'web-developer',
    professionLabel: 'בונה אתרים',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'בונה אתרים משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 180
  },
  {
    professionId: 'freelance-developer',
    professionLabel: 'מתכנת',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מתכנת משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 180
  },

  // Category A - 10% קבוע, 60 ימים
  {
    professionId: 'psychologist',
    professionLabel: 'פסיכולוג',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'פסיכולוג משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'emotional-therapist',
    professionLabel: 'מטפל רגשי',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מטפל רגשי משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'private-tutor',
    professionLabel: 'מורה פרטי',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מורה פרטי משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'personal-coach',
    professionLabel: 'מאמן כושר',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מאמן כושר משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'photographer',
    professionLabel: 'צלם',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'צלם משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'video-editor',
    professionLabel: 'עורך וידאו',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'עורך וידאו משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'graphic-designer',
    professionLabel: 'גרפיקאי',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'גרפיקאי משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'ux-ui-designer',
    professionLabel: 'מעצב UI/UX',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מעצב UI/UX משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'dj',
    professionLabel: 'DJ',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'DJ משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'gardener',
    professionLabel: 'גנן',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'גנן משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'surveyor',
    professionLabel: 'מודד מוסמך',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מודד מוסמך משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'landscape-architect',
    professionLabel: 'אדריכל נוף',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'אדריכל נוף משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'psychometric-instructor',
    professionLabel: 'מדריך פסיכומטרי',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מדריך פסיכומטרי משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'arts-teacher',
    professionLabel: 'מורה לאומנויות',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מורה לאומנויות משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'private-nanny',
    professionLabel: 'גננת פרטית / מטפלת',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'גננת פרטית / מטפלת משלמת עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'personal-trainer',
    professionLabel: 'מאמן אישי',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מאמן אישי משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'cosmetician',
    professionLabel: 'קוסמטיקאית',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'קוסמטיקאית משלמת עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'hairdresser',
    professionLabel: 'ספר / מעצב שיער',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'ספר / מעצב שיער משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'makeup-artist',
    professionLabel: 'מאפרת',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מאפרת משלמת עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'nail-tech',
    professionLabel: 'בניית ציפורניים',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'בניית ציפורניים משלמת עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'brow-designer',
    professionLabel: 'עיצוב גבות',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'עיצוב גבות משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'seo-specialist',
    professionLabel: 'מקדם אתרים SEO',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מקדם אתרים SEO משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'ppc-manager',
    professionLabel: 'מנהל קמפיינים ממומנים',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מנהל קמפיינים ממומנים משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'social-media-manager',
    professionLabel: 'ניהול סושיאל',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'ניהול סושיאל משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'content-writer',
    professionLabel: 'כתיבת תוכן',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'כתיבת תוכן משלמת עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'magnet-photography',
    professionLabel: 'צילום מגנטים',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'צילום מגנטים משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'event-production',
    professionLabel: 'הפקת אירועים',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'הפקת אירועים משלמת עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'event-host',
    professionLabel: 'מנחה אירועים',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מנחה אירועים משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'catering',
    professionLabel: 'שירותי קייטרינג',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'שירותי קייטרינג משלמים עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'active-bar',
    professionLabel: 'בר אקטיבי',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'בר אקטיבי משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'kids-entertainment',
    professionLabel: 'הפעלות לילדים',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'הפעלות לילדים משלמות עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'inflatables',
    professionLabel: 'מתנפחים',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'מתנפחים משלמים עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },
  {
    professionId: 'balloon-decor',
    professionLabel: 'עיצוב בלונים',
    category: 'A',
    calculateCommission: calculateFixed10,
    explanation: 'עיצוב בלונים משלם עמלה קבועה של 10% על כל עסקה.',
    clientRetentionDays: 60
  },

  // Category B - מדורג 5,000, 30 ימים
  {
    professionId: 'plumber',
    professionLabel: 'אינסטלטור',
    category: 'B',
    calculateCommission: calculateTiered5000,
    explanation: 'אינסטלטור משלם 10% על עסקאות עד 5,000 ₪ ו-5% על עסקאות מעל 5,001 ₪.',
    clientRetentionDays: 30
  },
  {
    professionId: 'electrician',
    professionLabel: 'חשמלאי',
    category: 'B',
    calculateCommission: calculateTiered5000,
    explanation: 'חשמלאי משלם 10% על עסקאות עד 5,000 ₪ ו-5% על עסקאות מעל 5,001 ₪.',
    clientRetentionDays: 30
  },
  {
    professionId: 'cleaner',
    professionLabel: 'מנקה',
    category: 'B',
    calculateCommission: calculateTiered5000,
    explanation: 'מנקה משלם 10% על עסקאות עד 5,000 ₪ ו-5% על עסקאות מעל 5,001 ₪.',
    clientRetentionDays: 30
  },
  {
    professionId: 'moving-company',
    professionLabel: 'חברת הובלות',
    category: 'B',
    calculateCommission: calculateTiered5000,
    explanation: 'חברת הובלות משלמת 10% על עסקאות עד 5,000 ₪ ו-5% על עסקאות מעל 5,001 ₪.',
    clientRetentionDays: 30
  },
  {
    professionId: 'garage',
    professionLabel: 'מוסך',
    category: 'B',
    calculateCommission: calculateTiered5000,
    explanation: 'מוסך משלם 10% על עסקאות עד 5,000 ₪ ו-5% על עסקאות מעל 5,001 ₪.',
    clientRetentionDays: 30
  },
  {
    professionId: 'car-wash',
    professionLabel: 'שטיפת רכבים',
    category: 'B',
    calculateCommission: calculateTiered5000,
    explanation: 'שטיפת רכבים משלמת 10% על עסקאות עד 5,000 ₪ ו-5% על עסקאות מעל 5,001 ₪.',
    clientRetentionDays: 30
  },

  // Category C - מדורג 1,000, 30 ימים
  {
    professionId: 'appliance-tech',
    professionLabel: 'טכנאי מכשירי חשמל',
    category: 'C',
    calculateCommission: calculateTiered1000,
    explanation: 'טכנאי מכשירי חשמל משלם 10% על עסקאות עד 1,000 ₪ ו-5% על עסקאות מעל 1,001 ₪.',
    clientRetentionDays: 30
  },
  {
    professionId: 'locksmith',
    professionLabel: 'מנעולן',
    category: 'C',
    calculateCommission: calculateTiered1000,
    explanation: 'מנעולן משלם 10% על עסקאות עד 1,000 ₪ ו-5% על עסקאות מעל 1,001 ₪.',
    clientRetentionDays: 30
  },
  {
    professionId: 'solar-water-heater-tech',
    professionLabel: 'טכנאי דודי שמש',
    category: 'C',
    calculateCommission: calculateTiered1000,
    explanation: 'טכנאי דודי שמש משלם 10% על עסקאות עד 1,000 ₪ ו-5% על עסקאות מעל 1,001 ₪.',
    clientRetentionDays: 30
  },
  {
    professionId: 'pest-control',
    professionLabel: 'מדביר',
    category: 'C',
    calculateCommission: calculateTiered1000,
    explanation: 'מדביר משלם 10% על עסקאות עד 1,000 ₪ ו-5% על עסקאות מעל 1,001 ₪.',
    clientRetentionDays: 30
  },
  {
    professionId: 'towing-service',
    professionLabel: 'שירותי גרירה',
    category: 'C',
    calculateCommission: calculateTiered1000,
    explanation: 'שירותי גרירה משלמים 10% על עסקאות עד 1,000 ₪ ו-5% על עסקאות מעל 1,001 ₪.',
    clientRetentionDays: 30
  },

  // Category D - עמלות ייחודיות
  {
    professionId: 'handyman',
    professionLabel: 'שיפוצניק',
    category: 'D',
    calculateCommission: calculateContractor,
    explanation: 'שיפוצניק משלם 5% על עסקאות עד 100,000 ₪ ו-2% על עסקאות מעל 100,001 ₪.',
    clientRetentionDays: 180
  },
  {
    professionId: 'contractor',
    professionLabel: 'קבלן בנייה',
    category: 'D',
    calculateCommission: calculateContractor,
    explanation: 'קבלן בנייה משלם 5% על עסקאות עד 100,000 ₪ ו-2% על עסקאות מעל 100,001 ₪.',
    clientRetentionDays: 180
  },
  {
    professionId: 'hvac-installer',
    professionLabel: 'מתקין מערכות מיזוג',
    category: 'D',
    calculateCommission: calculateHVAC,
    explanation: 'מתקין מערכות מיזוג משלם 8% על עסקאות עד 2,000 ₪ ו-2% על עסקאות מעל 2,001 ₪.',
    clientRetentionDays: 180
  }
];

export const getCommissionInfo = (professionId: string): CommissionInfo | undefined => {
  return commissionsData.find(c => c.professionId === professionId);
};
