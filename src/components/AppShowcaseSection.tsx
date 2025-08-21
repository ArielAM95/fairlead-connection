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
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/06084aa6-83ff-48e5-9242-1481a8169865.png')`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Blue Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700/80 via-blue-600/70 to-blue-500/60" />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        {/* Glass Card */}
        <div className="scroll-fade opacity-0 translate-y-10 transition-all duration-700">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-center leading-tight">
              אפליקציה אמיתית. נוחה. שמכניסה לך כסף.
            </h2>
            
            {/* Subtext */}
            <p className="text-lg md:text-xl text-white/90 leading-relaxed text-center mb-8 max-w-3xl mx-auto">
              האפליקציה של OFAIR לא רק מציגה לכם את הלידים הנכנסים - היא מאפשרת לכם להפוך לידים לא מנוצלים להכנסה נוספת, להרחיב את הקהילה המקצועית שלכם, ולבנות זרם הכנסה נוסף מהידע והניסיון שלכם. כל זה בממשק פשוט ואינטואיטיבי שעובד בדיוק כמו שאתם צריכים.
            </p>
            
            {/* CTA Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-white/90 font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/25 border border-white/30"
              >
                התחל להרוויח מהלידים שלך
              </Button>
            </div>
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