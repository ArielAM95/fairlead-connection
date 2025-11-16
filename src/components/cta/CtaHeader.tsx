import React from 'react';
import { T } from "@/components/translation/T";

const CtaHeader = () => {
  return <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white scroll-fade">
        <T>הטבה ייחודית בדמי ההקמה למצטרפים כעת!</T> 🚀
      </h2>
      <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto scroll-fade"><T>הפלטפורמה תעלה לאוויר בעוד מספר שבועות, וכל מי שנרשם עכשיו מקבל הטבה ייחודית בדמי ההקמה! 350 ש"ח עבור שלושה חודשים גישה לשיתוף לידים + גישה לבקשות מצרכנים לכל החיים !</T></p>
      <div className="bg-white/10 p-4 rounded-lg inline-block mb-6 scroll-fade">
        <p className="text-white font-bold text-lg">👉 <T>משלמים רק כשסוגרים עסקה !</T></p>
        <p className="text-white/90"><T>ללא תשלום על פניות שלא מבשילות לכדי עסקה</T></p>
      </div>
      <p className="text-white/80 scroll-fade">📲 <T>השאירו פרטים וקחו את העסק שלכם לשלב הבא!</T></p>
    </div>;
};
export default CtaHeader;