
import { useEffect, useRef } from "react";

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
      number: "1️⃣",
      title: "נרשמים בקלות",
      description: "יצירת פרופיל מקצועי תוך דקות."
    },
    {
      number: "2️⃣",
      title: "ישלח אליכם מייל",
      description: "אליו תשלחו 5 חשבוניות אחרונות לבדיקת איכות ואנחנו נעדכן את הדירוג שלכם"
    },
    {
      number: "3️⃣",
      title: "ניצור איתך קשר",
      description: "לאחר בדיקת הדירוג, נחזור אליכם להסבר על הפלטפורמה ותשלום מוזל אם נרשמים עכשיו !"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-ofair-50/30 to-white" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-ofair-900 scroll-fade">איך זה עובד?</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line connecting steps */}
            <div className="absolute top-0 bottom-0 right-[29px] w-1 bg-ofair-100 hidden md:block"></div>
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col md:flex-row items-start scroll-fade" style={{ transitionDelay: `${index * 150}ms` }}>
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-ofair-100 text-ofair-900 text-xl shrink-0 z-10 mb-4 md:mb-0">
                    <span>{step.number}</span>
                  </div>
                  <div className="md:mr-8 md:pt-3">
                    <h3 className="text-xl font-bold mb-2 text-ofair-900">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
