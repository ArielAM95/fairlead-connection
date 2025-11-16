import { CheckCircle, Info, TrendingUp } from 'lucide-react';
import { CommissionResultProps } from '@/types/commission';
import { T } from '@/components/translation/T';

const CommissionResult = ({
  professionLabel,
  amount,
  calculation,
  explanation,
  clientRetentionDays
}: CommissionResultProps) => {
  return (
    <div className="max-w-3xl mx-auto mt-12 animate-fade-in">
      {/* Results Card */}
      <div className="bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl border-2 border-primary/20 rounded-3xl p-8 md:p-10 shadow-2xl mb-6">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h3 className="text-2xl md:text-3xl font-bold text-primary">
            <T>תוצאות החישוב</T>
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-primary/10">
            <span className="text-lg font-semibold"><T>סכום העסקה:</T></span>
            <span className="text-xl font-bold text-primary">
              ₪{amount.toLocaleString('he-IL')}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-primary/10">
            <span className="text-lg font-semibold"><T>אחוז העמלה:</T></span>
            <span className="text-xl font-bold text-accent">
              {calculation.percentage}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-primary/10">
            <span className="text-lg font-semibold"><T>סכום העמלה:</T></span>
            <span className="text-xl font-bold text-destructive">
              ₪{calculation.commission.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl px-4">
            <span className="text-lg font-bold"><T>נשאר לבעל המקצוע:</T></span>
            <span className="text-2xl font-bold text-primary">
              ₪{calculation.netAmount.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Explanation Card */}
      <div className="bg-gradient-to-br from-accent/10 to-primary/5 backdrop-blur-xl border border-accent/20 rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
          <div className="text-right flex-1">
            <h4 className="text-xl font-bold text-accent mb-3"><T>הסבר:</T></h4>
            <p className="text-base leading-relaxed text-foreground/90 mb-4">
              <T>{explanation}</T>
            </p>

            {calculation.breakdown && (
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-primary/10">
                <p className="font-semibold mb-3 text-primary"><T>פירוט החישוב:</T></p>
                <div className="space-y-2 text-sm whitespace-pre-line text-foreground/80">
                  <T>{calculation.breakdown}</T>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Important Details Card */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
          <div className="text-right flex-1">
            <h4 className="text-xl font-bold text-primary mb-4"><T>עוד פרטים חשובים:</T></h4>

            <div className="space-y-3">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-primary/10">
                <p className="font-semibold mb-2 text-primary text-lg">
                  <T>כמה זמן לקוח נחשב "לקוח oFair":</T>
                </p>
                <p className="text-base leading-relaxed text-foreground/90">
                  <T>ב</T><T>{professionLabel}</T> <T>לקוח נחשב ללקוח מאיתנו למשך</T> <span className="font-bold text-accent">{clientRetentionDays} <T>ימים</T></span> <T>מיום עדכון העסקה במערכת. כלומר יש עמלה על כל עסקה עם אותו לקוח במשך הזמן הנ"ל.</T>
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-accent/10">
                <p className="text-base leading-relaxed text-foreground/90">
                  <T>כאשר הלקוח פונה לעסק שוב דרך אתר oFair - זה נחשב לפניה חדשה וספירת הימים מתחדשת.</T>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionResult;
