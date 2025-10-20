import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

const AppShowcaseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-fade');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
      dir="rtl"
    >
      {/* Blue Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-600" />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="scroll-fade opacity-0 translate-y-10 transition-all duration-700">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-6 leading-tight">
              אפליקציה אמיתית. נוחה. שמכניסה לך כסף.
            </h2>
            
            {/* Subtext */}
            <p className="text-lg md:text-xl text-blue-800/90 leading-relaxed mb-8">
              האפליקציה של OFAIR לא רק מציגה לכם את הלידים הנכנסים - היא מאפשרת לכם להפוך לידים לא מנוצלים להכנסה נוספת, להרחיב את הקהילה המקצועית שלכם, ולבנות זרם הכנסה נוסף מהידע והניסיון שלכם. בנוסף, תקבלו התראות WhatsApp אוטומטיות על לידים רלוונטיים לכם – עם כל הפרטים המלאים וקישור ישיר למודעה באפליקציה, כך שלא תפספסו אף הזדמנות. כל זה בממשק פשוט ואינטואיטיבי שעובד בדיוק כמו שאתם צריכים.
            </p>
            
            {/* CTA Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-blue-700 text-white hover:bg-blue-800 font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                onClick={() => {
                  const ctaSection = document.getElementById('cta');
                  if (ctaSection) {
                    ctaSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                התחל להרוויח מהלידים שלך
              </Button>
            </div>
          </div>
        </div>

        {/* App Image */}
        <div className="scroll-fade opacity-0 translate-x-10 transition-all duration-700 delay-300">
          <div className="relative">
            <img 
              src="/lovable-uploads/06084aa6-83ff-48e5-9242-1481a8169865.png"
              alt="אפליקציית OFAIR"
              className="w-full max-w-md mx-auto rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
            />
            {/* Floating decoration */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full blur-sm animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-blue-300/30 rounded-full blur-md animate-pulse delay-1000" />
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-300/10 rounded-full blur-lg animate-pulse delay-1000" />
    </section>
  );
};

export default AppShowcaseSection;