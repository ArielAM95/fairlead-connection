import { useEffect, useRef } from "react";
import { UserPlus } from "lucide-react";
const WhatIsSection = () => {
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
  return <section id="what-is" className="section-padding bg-gradient-to-br from-background via-primary/5 to-accent/10 relative" ref={sectionRef}>
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 left-20 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-primary scroll-fade">מה זה oFair?</h2>
          <p className="text-xl md:text-2xl text-muted-foreground scroll-fade leading-relaxed">פלטפורמת oFair מחברת בין בעלי מקצוע מכל התחומים, ומאפשרת לכם לקבל לידים איכותיים, לשתף לידים שלא מתאימים לכם ולהרוויח – הכול במקום אחד!</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center scroll-fade">
            <div className="text-center md:text-right">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6 mx-auto md:mx-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">צרכנים שולחים פניות מדויקות</h3>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">קבלו פניות מדוייקות מצרכנים - כל הפרטים כדי שתוכלו להציע מחיר/זמינות - ולהבין אם *באמת* הלקוח רלוונטי לכם !</p>
            </div>

            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 text-accent mb-6 mx-auto md:mx-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">שיתוף לידים</h3>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">העבירו לידים שלא מתאימים לכם לבעלי מקצוע אחרים והרוויחו מהם עמלה.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center scroll-fade">
            <div className="text-center md:text-right">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6 mx-auto md:mx-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">לוח מודעות חכם</h3>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">כל העבודות הפניות שצרכנים/בעלי מקצוע העלו - נכנסים ללוח מודעות חכם אתם רואים,מציעים, עובדים !</p>
            </div>
            
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 text-accent mb-6 mx-auto md:mx-0">
                <UserPlus className="w-10 h-10" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">מציאת עובדים בקלות</h3>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                אתרו עובדים מקצועיים לפרויקטים שלכם בקלות וביעילות, נהלו את צוות העבודה ובנו רשת מקצועית איכותית.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default WhatIsSection;