import { DollarSign, Users, Target, TrendingUp } from "lucide-react";

const BusinessModelSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            המודל העסקי שלנו
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            הצטרפו עכשיו במחיר מיוחד ותיהנו מגישה לכל החיים
          </p>
        </div>

        {/* Registration Fee Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-2xl font-bold text-muted-foreground line-through">₪499</span>
                <span className="text-4xl font-bold text-primary">₪350</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">דמי הרשמה חד-פעמיים</h3>
              <p className="text-muted-foreground">מחיר מיוחד לתקופה מוגבלת</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">גישה לכל החיים עבור oFair לצרכנים</h4>
                    <p className="text-sm text-muted-foreground">
                      יוכלו להגיש תמיד הצעות לבקשות מצרכנים ותמיד יופיעו באתר
                      (בהתאם כמובן לשעות ולדירוגים)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">גישה לפלטפורמת שיתוף הלידים</h4>
                    <p className="text-sm text-muted-foreground">
                      הפלטפורמה הראשונה בעולם למשך תקופת הרצה.
                      לאחר תקופת הרצה הגישה תיהיה מוגבלת לבעלי מנוי חודשי
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-accent/5 rounded-xl p-6">
                <h4 className="font-semibold text-foreground mb-4 text-center">
                  🎯 מה מקבלים תמורת ההרשמה?
                </h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span>חשיפה מקסימלית ללקוחות פוטנציאליים</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span>מערכת דירוגים ומשוב מובנית</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span>פלטפורמת שיתוף לידים ייחודית</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span>ניהול מקצועי של בקשות עבודה</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Structure */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              לאחר ההרשמה - תשלום רק על הצלחות! 🎉
            </h3>
            <p className="text-muted-foreground">
              אנחנו גובים רק על עסקאות סגורות - ללא תשלומים קבועים
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-primary">10%</h4>
                  <p className="text-sm text-muted-foreground">על בקשות מצרכנים</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                גם אם זה רק עלות ביקור - אנחנו מקבלים עמלה רק כשאתם מרוויחים
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-secondary">5%</h4>
                  <p className="text-sm text-muted-foreground">על לידים שהועברו</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                ממקבלי העבודה - רק כשהעסקה נסגרת בהצלחה
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/20">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-foreground mb-2">
                💡 הרעיון שלנו פשוט
              </h4>
              <p className="text-muted-foreground">
                אתם מצליחים - אנחנו מצליחים! אין תשלומים קבועים, רק הצלחות משותפות
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessModelSection;