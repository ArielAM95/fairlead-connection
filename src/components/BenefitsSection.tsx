
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
    <section id="benefits" className="section-padding bg-gradient-to-br from-accent/10 via-background to-primary/5 relative overflow-hidden" ref={sectionRef}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6 scroll-fade">
            יתרונות oFair
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary scroll-fade">למה להצטרף ל-oFair?</h2>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`scroll-fade transform hover:scale-105 transition-all duration-300 ${
                index % 2 === 0 ? 'text-right' : 'text-left'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`flex items-start gap-6 max-w-4xl ${
                index % 2 === 0 ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}>
                <div className="shrink-0 mt-2">
                  <div className={`w-8 h-8 rounded-full ${
                    index === 0 ? 'bg-primary' : 'bg-accent'
                  } flex items-center justify-center shadow-lg`}>
                    <Check className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className={`text-lg md:text-xl leading-relaxed ${
                    index === 0 ? 'font-bold text-primary' : 'text-foreground'
                  }`}>
                    {benefit}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
