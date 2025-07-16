
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
    <section id="problems" className="section-padding morphing-background" ref={sectionRef}>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-tertiary/10 rounded-full blur-3xl floating-element"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-quaternary/10 rounded-full blur-3xl floating-element" style={{animationDelay: '3s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="text-blob scroll-fade">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              מה הבעיות שאנחנו פותרים עבורך?
            </h2>
          </div>
        </div>

        <div className="space-y-16 max-w-6xl mx-auto">
          {problems.map((item, index) => (
            <div key={item.id} className="relative">
              {/* Problem card with organic shape */}
              <div 
                className={`feature-blob scroll-fade ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'} max-w-4xl`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Floating number */}
                <div className={`absolute -top-4 ${index % 2 === 0 ? '-right-4' : '-left-4'} w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center text-white text-xl font-bold shadow-glow pulsing-glow`}>
                  {item.id}
                </div>
                
                {/* Problem text */}
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                    {item.problem}
                  </h3>
                </div>
                
                {/* Solution blob */}
                <div className="text-blob bg-secondary-gradient text-white">
                  <p className="text-lg leading-relaxed">
                    {item.solution}
                  </p>
                </div>
              </div>
              
              {/* Connecting line */}
              {index < problems.length - 1 && (
                <div className={`absolute bottom-0 ${index % 2 === 0 ? 'left-1/2' : 'right-1/2'} w-px h-16 bg-gradient-to-b from-primary to-transparent transform translate-y-full`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
