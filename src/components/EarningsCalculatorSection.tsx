import { useState, useEffect, useRef } from "react";
import { TrendingUp, Calculator } from "lucide-react";
import { T } from "@/components/translation/T";

const EarningsCalculatorSection = () => {
  const [leads, setLeads] = useState<string>("10");
  const [avgAmount, setAvgAmount] = useState<string>("5000");
  const [commission, setCommission] = useState<string>("20");
  const sectionRef = useRef<HTMLElement>(null);

  // Calculate monthly earnings
  const monthlyEarnings = (Number(leads) || 0) * (Number(avgAmount) || 0) * ((Number(commission) || 0) / 100);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".scroll-fade");
            elements.forEach((el) => {
              el.classList.add("visible");
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="calculator" 
      className="py-20 px-4 bg-gradient-to-b from-background via-accent/5 to-background relative overflow-hidden"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 scroll-fade">
          <Calculator className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            <T>חשב את הרווח הפוטנציאלי שלך</T>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <T>מלא את הפרטים וגלה כמה תוכל להרוויח רק משיתוף לידים</T>
          </p>
        </div>

        <div className="glass-card p-8 md:p-12 scroll-fade">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Leads Input */}
            <div className="space-y-2">
              <label htmlFor="leads" className="block text-sm font-medium text-foreground">
                <T>כמה לידים תעביר בחודש?</T>
              </label>
              <div className="relative">
                <input
                  id="leads"
                  type="number"
                  min="0"
                  value={leads}
                  onChange={(e) => setLeads(e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                  <T>לידים</T>
                </span>
              </div>
            </div>

            {/* Average Amount Input */}
            <div className="space-y-2">
              <label htmlFor="avgAmount" className="block text-sm font-medium text-foreground">
                <T>סכום עבודה ממוצע?</T>
              </label>
              <div className="relative">
                <input
                  id="avgAmount"
                  type="number"
                  min="0"
                  step="100"
                  value={avgAmount}
                  onChange={(e) => setAvgAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  ₪
                </span>
              </div>
            </div>

            {/* Commission Input */}
            <div className="space-y-2">
              <label htmlFor="commission" className="block text-sm font-medium text-foreground">
                <T>כמה עמלה תיקח?</T>
              </label>
              <div className="relative">
                <input
                  id="commission"
                  type="number"
                  min="0"
                  max="100"
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Result Display */}
          <div className="bg-gradient-to-br from-primary/10 via-primary-glow/10 to-primary/5 border-2 border-primary/20 rounded-2xl p-8 text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">
                <T>הרווח החודשי הפוטנציאלי שלך</T>
              </h3>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-l from-primary via-primary-glow to-primary bg-clip-text text-transparent transition-all duration-300 break-words">
              ₪{monthlyEarnings.toLocaleString('he-IL')}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              <T>לחודש</T>
            </p>
          </div>

          {/* Explanation */}
          <div className="bg-accent/30 border border-accent rounded-lg p-4 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                <strong><T>שים לב:</T></strong> <T>זה רק מהלידים שאתה מעביר!</T>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <T>זה לא כולל את כל הבקשות הישירות שתקבל מצרכנים בפלטפורמה של oFair</T>
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            >
              <T>הירשם עכשיו והתחל להרוויח</T>
            </button>
          </div>
        </div>

        {/* Additional Context */}
        <div className="text-center mt-8 scroll-fade">
          <p className="text-muted-foreground">
            <T>בנוסף לרווח מהלידים, תקבל גישה ללקוחות חדשים שמחפשים אותך ישירות</T> 🚀
          </p>
        </div>
      </div>
    </section>
  );
};

export default EarningsCalculatorSection;