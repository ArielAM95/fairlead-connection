
import { useEffect, useRef } from "react";

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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary scroll-fade">מה הבעיות שאנחנו פותרים עבורך?</h2>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          {problems.map((item, index) => (
            <div 
              key={item.id}
              className={`relative scroll-fade ${index % 2 === 0 ? 'text-right' : 'text-left'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`max-w-4xl ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                <div className={`flex items-start gap-6 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                      {item.id}
                    </div>
                  </div>
                  <div className="space-y-4 pt-2">
                    <h3 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
                      {item.problem}
                    </h3>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      {item.solution}
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
