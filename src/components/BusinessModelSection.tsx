import React from "react";

const BusinessModelSection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            המודל העסקי שלנו
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            שקיפות מלאה. תשלומים הוגנים. הצלחה משותפת.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Price Card */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 text-right">
              <h3 className="text-2xl font-bold mb-4 text-primary">
                💰 דמי הרשמה חד-פעמיים
              </h3>
              <div className="flex items-center justify-end gap-4 mb-3">
                <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold">
                  חיסכון ₪149!
                </span>
                <span className="text-4xl font-bold text-accent">₪350</span>
                <span className="text-3xl font-bold text-muted-foreground line-through">₪499</span>
              </div>
              <p className="text-primary font-medium text-right">
                מחיר מיוחד לתקופה מוגבלת!
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold mb-6 text-foreground text-right">
              🎯 מה הרישום מקנה לכם?
            </h3>
            
            <div className="space-y-4">
              <div className="glass-card p-4">
                <h4 className="font-bold text-accent mb-2 text-right">✅ גישה לכל החיים ל-oFair לצרכנים:</h4>
                <ul className="text-muted-foreground space-y-1 text-right">
                  <li>• הגשת הצעות מחיר לבקשות מצרכנים</li>
                  <li>• נוכחות קבועה באתר</li>
                  <li>• דירוג והצגה לפי איכות השירות</li>
                </ul>
              </div>

              <div className="glass-card p-4">
                <h4 className="font-bold text-primary mb-2 text-right">🚀 גישה לפלטפורמת שיתוף הלידים הראשונה בעולם:</h4>
                <ul className="text-muted-foreground space-y-1 text-right">
                  <li>• תקופת הרצה בחינם</li>
                  <li>• לאחר תקופת הרצה - מנוי חודשי</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-2xl font-bold mb-6 text-center text-primary">
            💼 עמלות - רק על עסקאות סגורות!
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">10%</div>
              <h4 className="font-bold mb-2">בקשות מצרכנים</h4>
              <p className="text-muted-foreground text-sm">
                גם אם זה רק עלות ביקור
              </p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-bold text-accent mb-2">5%</div>
              <h4 className="font-bold mb-2">לידים שהועברו</h4>
              <p className="text-muted-foreground text-sm">
                ממקבלי העבודה
              </p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-lg font-medium text-primary">
              ⭐ אנחנו מרוויחים רק כשאתם מרוויחים!
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="cta-gradient text-white rounded-xl p-6 max-w-2xl mx-auto">
            <h4 className="text-xl font-bold mb-2">🤝 השותפות המושלמת</h4>
            <p className="text-lg">
              אנחנו לא רק פלטפורמה - אנחנו השותפים שלכם להצלחה!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessModelSection;