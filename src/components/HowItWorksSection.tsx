
import { useEffect, useRef } from "react";
import { T } from "@/components/translation/T";

const HowItWorksSection = () => {
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

  const steps = [
    {
      number: "1",
      title: "נרשמים בקלות",
      description: "יצירת פרופיל מקצועי תוך דקות."
    },
    {
      number: "2",
      title: "ישלח אליכם מייל",
      description: "אליו תשלחו 5 חשבוניות אחרונות לבדיקת איכות ואנחנו נעדכן את הדירוג שלכם"
    },
    {
      number: "3",
      title: "ניצור איתך קשר",
      description: "לאחר בדיקת הדירוג, נחזור אליכם להסבר על הפלטפורמה ותשלום מוזל אם נרשמים עכשיו !"
    }
  ];

  return (
    <section id="how-it-works" className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-32 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary scroll-fade"><T>איך זה עובד?</T></h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-20">
          {steps.map((step, index) => (
            <div key={index} className="scroll-fade" style={{ transitionDelay: `${index * 150}ms` }}>
              <div className="glass-card flex items-center gap-8 flex-row">
                <div className="shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-3xl font-bold shadow-xl">
                    {step.number}
                  </div>
                </div>
                <div className="space-y-4 text-right">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary"><T>{step.title}</T></h3>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed"><T>{step.description}</T></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
