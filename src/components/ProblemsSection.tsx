import { useEffect, useRef } from "react";
const ProblemsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, {
      threshold: 0.1
    });
    const elements = sectionRef.current?.querySelectorAll(".scroll-fade");
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const problems = [{
    id: 1,
    problem: "מבזבזים זמן על לקוחות שרק רוצים לבדוק מחירים?",
    solution: "הלקוחות רואים הצעות מחיר בזמן אמת, כך שתשקיעו רק בלידים איכותיים!"
  }, {
    id: 2,
    problem: "עמוסים בעבודה ואין לכם זמן ללידים חדשים?",
    solution: "שתפו את הלידים עם בעלי מקצוע אחרים קבלו אחוזים ותעשו כסף גם מלידים שאתם לא מספיקים להגיע אליהם."
  }, {
    id: 3,
    problem: "רודפים אחרי הצעות מחיר?",
    solution: "הפלטפורמה מאפשרת ללקוחות לקבל הצעות מחיר ישירות, בלי טלפונים מיותרים."
  }, {
    id: 4,
    problem: "לא שוכחים את העבר",
    solution: "צרכנים גם יוכלו לקבל את הפרטים שלכם ישירות, כי מי שרוצה להתקע בעבר מי אנחנו שנגיד לו לא?"
  }];
  return <section id="problems" ref={sectionRef} className="section-padding bg-white py-0 my-0">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-ofair-900 scroll-fade">מה הבעיות שאנחנו פותרים עבורך?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto my-[100px]">
          {problems.map((item, index) => <div key={item.id} className={`bg-white rounded-xl p-6 border border-gray-100 shadow-subtle hover:shadow-card transition-all duration-300 scroll-fade ${index >= 3 ? 'md:col-span-3/2' : ''}`} style={{
          transitionDelay: `${index * 100}ms`
        }}>
              <div className="mb-4 rounded-full bg-[#d9dfea]">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ofair-900 text-white text-sm font-medium">
                  {item.id}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-ofair-900 mx-0 px-0">
                {item.problem}
              </h3>
              <p className="text-muted-foreground">
                {item.solution}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default ProblemsSection;