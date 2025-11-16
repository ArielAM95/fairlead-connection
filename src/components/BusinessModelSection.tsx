import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import { Calculator, ArrowLeft } from 'lucide-react';
import { ScrollFade } from "@/utils/ScrollObserver";
import { T } from "@/components/translation/T";
const BusinessModelSection = () => {
  const [animatedValue, setAnimatedValue] = useState(350);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
        // Animate counter
        let start = 0;
        const end = 350;
        const duration = 2000;
        const increment = end / (duration / 16);
        const counter = setInterval(() => {
          start += increment;
          if (start >= end) {
            setAnimatedValue(end);
            clearInterval(counter);
          } else {
            setAnimatedValue(Math.floor(start));
          }
        }, 16);
      }
    }, {
      threshold: 0.3
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [isVisible]);
  const features = [{
    icon: "🎯",
    title: "גישה לכל החיים ל-oFair לצרכנים",
    items: ["הגשת הצעות מחיר לבקשות מצרכנים", "נוכחות קבועה באתר", "דירוג והצגה לפי איכות השירות"]
  }, {
    icon: "🚀",
    title: "פלטפורמת שיתוף הלידים הראשונה בעולם",
    items: ["תקופת הרצה בחינם", "לאחר תקופת הרצה - מנוי חודשי"]
  }];
  return <section ref={sectionRef} className="section-padding bg-gradient-to-br from-background via-primary/5 to-accent/10 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <ScrollFade delay={0}>
          <div className="text-center mb-16">
            <div className="inline-block relative">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-l from-ofair-900 to-ofair-600 bg-clip-text text-transparent">
                <T>המודל העסקי שלנו</T>
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-8">
              <T>שקיפות מלאה • תשלומים הוגנים • הצלחה משותפת</T>
            </p>
          </div>
        </ScrollFade>

        {/* Hero Price Card */}
        <ScrollFade delay={200}>
          <div className="relative mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-2xl">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                  <T>🔥 חיסכון ₪149!</T>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
                  <T>💰 דמי הרשמה חד-פעמיים</T>
                </h3>

                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-5xl md:text-7xl font-bold text-accent animate-pulse">
                      ₪{animatedValue}
                    </div>
                    <div className="text-lg text-muted-foreground"><T>מחיר מיוחד</T></div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-muted-foreground/40 line-through">₪650</div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4">
                  <p className="text-lg font-medium text-primary">
                    <T>⏰ מחיר מיוחד לתקופה מוגבלת!</T>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollFade>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => <ScrollFade key={index} delay={300 + index * 100}>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-primary/20 rounded-2xl p-8 hover:border-primary/40 transition-all duration-500 hover:scale-[1.02]">
                  <div className="text-4xl mb-4 animate-bounce">{feature.icon}</div>
                  <h4 className="text-xl font-bold text-primary mb-6 text-right">
                    <T>{feature.title}</T>
                  </h4>
                  <div className="space-y-3">
                    {feature.items.map((item, itemIndex) => <div key={itemIndex} className="flex items-center justify-start gap-3 group/item">
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full group-hover/item:scale-125 transition-transform"></div>
                        <span className="text-muted-foreground text-right hover:text-foreground transition-colors">
                          <T>{item}</T>
                        </span>
                      </div>)}
                  </div>
                </div>
              </div>
            </ScrollFade>)}
        </div>

        {/* Commission Cards */}
        <ScrollFade delay={500}>
          <div className="relative mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
                <T>💼 עמלות - רק על עסקאות סגורות!</T>
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[{
              percent: "5-10%",
              title: "בקשות מצרכנים",
              subtitle: "גם אם זה רק עלות ביקור",
              extraText: "תלוי בסכום העסקה ובמקצוע",
              color: "primary",
              delay: 0
            }, {
              percent: "3-5%",
              title: "לידים שהועברו",
              subtitle: "ממקבלי העבודה",
              extraText: "תלוי בסכום",
              color: "accent",
              delay: 200
            }].map((commission, index) => <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-br from-${commission.color}/20 to-${commission.color}/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
                  <div className="relative bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl border border-primary/20 rounded-2xl p-8 text-center hover:border-primary/40 transition-all duration-500 hover:scale-105">
                    <div className={`text-6xl md:text-7xl font-bold text-${commission.color} mb-4 group-hover:scale-110 transition-transform duration-500`}>
                      {commission.percent}
                    </div>
                    <h4 className="text-xl font-bold mb-3"><T>{commission.title}</T></h4>
                    <p className="text-muted-foreground">
                      <T>{commission.subtitle}</T>
                    </p>
                    {commission.extraText && (
                      <p className="text-xs text-muted-foreground/70 italic mt-2">
                        <T>{commission.extraText}</T>
                      </p>
                    )}
                    <div className={`mt-4 h-1 w-full bg-gradient-to-r from-${commission.color}/20 to-${commission.color}/60 rounded-full`}>
                      <div className={`h-full bg-gradient-to-r from-${commission.color} to-${commission.color}/80 rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out`}></div>
                    </div>
                  </div>
                </div>)}
            </div>

            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-8 py-4 backdrop-blur-sm border border-primary/20 mb-8">
                <div className="text-2xl animate-spin">⭐</div>
                <p className="text-xl font-medium text-primary">
                  <T>אנחנו מרוויחים רק כשאתם מרוויחים!</T>
                </p>
              </div>

              <Link
                to="/commission-calculator"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 via-emerald-600 to-green-500 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                <Calculator className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span><T>💡 לחצו למחשבון העמלות שלנו</T></span>
                <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </ScrollFade>

        {/* CTA Section */}
        <ScrollFade delay={700}>
          <div className="text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              <div className="relative bg-gradient-to-r from-primary via-accent to-secondary text-white rounded-3xl p-8 md:p-12 max-w-3xl mx-auto shadow-2xl hover:scale-[1.02] transition-all duration-500">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-3xl animate-bounce">🤝</div>
                  <h4 className="text-2xl md:text-3xl font-bold"><T>השותפות המושלמת</T></h4>
                </div>
                <p className="text-lg md:text-xl mb-6 opacity-90">
                  <T>אנחנו לא רק פלטפורמה - אנחנו השותפים שלכם להצלחה!</T>
                </p>
                <div className="flex justify-center gap-6 text-sm opacity-75">
                  <span><T>🚀 טכנולוגיה מתקדמת</T></span>
                  <span><T>💪 תמיכה מלאה</T></span>
                  <span><T>📈 צמיחה משותפת</T></span>
                </div>
              </div>
            </div>
          </div>
        </ScrollFade>
      </div>
    </section>;
};
export default BusinessModelSection;