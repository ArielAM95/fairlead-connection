
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
    "קבלו יותר עבודות – גישה ישירה ללקוחות שמחפשים את השירות שלכם.",
    "שתפו לידים שלא מתאימים לכם – במקום לבזבז זמן על לקוחות לא רלוונטיים, תנו אותם למישהו שצריך!",
    "פחות בזבוז זמן – יותר עסקאות – לא מתעסקים עם לקוחות שמחפשים רק הצעות מחיר בלי כוונה אמיתית.",
    "השבחת לידים חכמה – הלקוחות בפלטפורמה מקבלים הצעות מחיר ישירות, מה שמבטיח לידים איכותיים ורלוונטיים יותר.",
    "משלמים רק כשסוגרים עסקה - 10% מהעסקה בלבד! ללא תשלום על פניות שלא מבשילות לכדי עסקה.",
    "הצטרפות מוקדמת בהטבה מיוחדת – הרשמה עכשיו עם הטבה ייחודית בדמי ההקמה!",
  ];

  return (
    <section id="benefits" className="section-padding bg-ofair-50/50 section-clip" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="benefit-badge mb-4 scroll-fade">יתרונות</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-ofair-900 scroll-fade">למה להצטרף ל-oFair?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`flex items-start bg-white rounded-xl p-5 shadow-subtle hover:shadow-card transition-all duration-300 scroll-fade ${index === 4 ? 'border-2 border-ofair-900' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="shrink-0 mt-1">
                <div className={`w-6 h-6 rounded-full ${index === 4 ? 'bg-ofair-900' : 'bg-ofair-100'} flex items-center justify-center`}>
                  <Check className={`h-3.5 w-3.5 ${index === 4 ? 'text-white' : 'text-ofair-900'}`} />
                </div>
              </div>
              <div className="mr-4">
                <p className={`${index === 4 ? 'font-bold' : ''} text-foreground`}>{benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
