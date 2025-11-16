
import { useEffect, useRef } from "react";
import { T } from "@/components/translation/T";

const ProblemsSection = () => {
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

  const problems = [
    {
      id: 1,
      problem: "מבזבזים זמן על לקוחות שרק רוצים לבדוק מחירים?",
      solution: "הלקוחות רואים הצעות מחיר בזמן אמת, כך שתשקיעו רק בלידים איכותיים!"
    },
    {
      id: 2,
      problem: "עמוסים בעבודה ואין לכם זמן ללידים חדשים?",
      solution: "שתפו את הלידים עם בעלי מקצוע אחרים קבלו אחוזים ותעשו כסף גם מלידים שאתם לא מספיקים להגיע אליהם."
    },
    {
      id: 3,
      problem: "רודפים אחרי הצעות מחיר?",
      solution: "הפלטפורמה מאפשרת ללקוחות לקבל הצעות מחיר ישירות, בלי טלפונים מיותרים."
    },
    {
      id: 4,
      problem: "לא שוכחים את העבר",
      solution: "צרכנים גם יוכלו לקבל את הפרטים שלכם ישירות, כי מי שרוצה להתקע בעבר מי אנחנו שנגיד לו לא?"
    }
  ];

  return (
    <section id="problems" className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary scroll-fade"><T>מה הבעיות שאנחנו פותרים עבורך?</T></h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((item, index) => (
            <div
              key={item.id}
              className="scroll-fade"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="glass-card h-full">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                    {item.id}
                  </div>
                  <div className="space-y-2 text-right">
                    <h3 className="text-xl md:text-2xl font-bold text-primary leading-snug">
                      <T>{item.problem}</T>
                    </h3>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      <T>{item.solution}</T>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
