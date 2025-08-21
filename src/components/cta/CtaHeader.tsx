import React from 'react';
const CtaHeader = () => {
  return <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white scroll-fade">
        הטבה ייחודית בדמי ההקמה למצטרפים כעת! 🚀
      </h2>
      <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto scroll-fade">הפלטפורמה תעלה לאוויר בעוד מספר שבועות, וכל מי שנרשם עכשיו מקבל הטבה ייחודית בדמי ההקמה! 350 ש"ח עבור שלושה חודשים גישה לשיתוף לידים + גישה לבקשות מצרכנים לכל החיים !</p>
      <div className="bg-white/10 p-4 rounded-lg inline-block mb-6 scroll-fade">
        <p className="text-white font-bold text-lg">👉 משלמים רק כשסוגרים עסקה !</p>
        <p className="text-white/90">ללא תשלום על פניות שלא מבשילות לכדי עסקה</p>
      </div>
      <p className="text-white/80 scroll-fade">📲 השאירו פרטים וקחו את העסק שלכם לשלב הבא!</p>
    </div>;
};
export default CtaHeader;