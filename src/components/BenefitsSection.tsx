
import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

const BenefitsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".scroll-fade");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const benefits = [
    "משלמים רק כשסוגרים עסקה ! ללא תשלום על פניות שלא מבשילות לכדי עסקה.",
    "קבלו יותר עבודות – גישה ישירה ללקוחות שמחפשים את השירות שלכם.",
    "שתפו לידים שלא מתאימים לכם – במקום לבזבז זמן על לקוחות לא רלוונטיים, תנו אותם למישהו שצריך והרוויחו עמלה בקלות !",
    "פחות בזבוז זמן – יותר עסקאות – לא מתעסקים עם לקוחות שמחפשים רק הצעות מחיר בלי כוונה אמיתית.",
    "השבחת לידים חכמה – הלקוחות בפלטפורמה מקבלים הצעות מחיר ישירות, מה שמבטיח לידים איכותיים ורלוונטיים יותר.",
    "הצטרפות מוקדמת בהטבה מיוחדת – הרשמה עכשיו עם הטבה ייחודית בדמי ההקמה!",
  ];

  return (
    <section id="benefits" className="section-padding relative overflow-hidden" ref={sectionRef}>
      {/* Dynamic background */}
      <div className="absolute inset-0 morphing-background"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-80 h-80 bg-primary/15 rounded-full blur-3xl floating-element"></div>
        <div className="absolute bottom-32 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl floating-element" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="text-blob bg-accent-gradient text-white mb-8 scroll-fade">
            <span className="text-lg font-medium">יתרונות</span>
          </div>
          <div className="text-blob scroll-fade">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              למה להצטרף ל-oFair?
            </h2>
          </div>
        </div>

        <div className="space-y-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`floating-element scroll-fade ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'} max-w-4xl`}
              style={{ transitionDelay: `${index * 150}ms`, animationDelay: `${index * 0.5}s` }}
            >
              <div className={`fluid-card ${index === 0 ? 'gradient-border bg-primary-gradient text-white' : ''}`}>
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="shrink-0 mt-2">
                    <div className={`w-8 h-8 rounded-full ${index === 0 ? 'bg-white/20' : 'bg-primary/20'} flex items-center justify-center pulsing-glow`}>
                      <Check className={`h-5 w-5 ${index === 0 ? 'text-white' : 'text-primary'} font-bold`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className={`text-lg leading-relaxed ${index === 0 ? 'text-white font-semibold' : 'text-foreground'}`}>
                      {benefit}
                    </p>
                  </div>
                </div>
                
                {/* Decorative elements for first item */}
                {index === 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
