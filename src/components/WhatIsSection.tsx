
import { useEffect, useRef } from "react";

const WhatIsSection = () => {
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

  return (
    <section id="what-is" className="section-padding bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-ofair-900 scroll-fade">מה זה oFair?</h2>
          <p className="text-lg md:text-xl text-muted-foreground scroll-fade">
            פלטפורמת oFair מחברת בין בעלי מקצוע בתחומי הבנייה, השיפוצים וההנדסה, ומאפשרת לכם לקבל לידים איכותיים, לשתף לידים שלא מתאימים לכם ולהתחבר לפרויקטים רלוונטיים – הכול במקום אחד!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature-card scroll-fade">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-ofair-900">רשת בעלי מקצוע</h3>
            <p className="text-muted-foreground">
              התחברו לקהילה של בעלי מקצוע בתחומי הבנייה, השיפוצים וההנדסה ליצירת רשת עסקית חזקה.
            </p>
          </div>

          <div className="feature-card scroll-fade" style={{ transitionDelay: "150ms" }}>
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-ofair-900">שיתוף לידים</h3>
            <p className="text-muted-foreground">
              העבירו לידים שלא מתאימים לכם לבעלי מקצוע אחרים וקבלו לידים שמתאימים לתחום המומחיות שלכם.
            </p>
          </div>

          <div className="feature-card scroll-fade" style={{ transitionDelay: "300ms" }}>
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-ofair-900">ניהול פרויקטים חכם</h3>
            <p className="text-muted-foreground">
              נהלו את הפרויקטים שלכם, עקבו אחר התקדמות העבודה ומצאו שותפים לפרויקטים גדולים.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsSection;
