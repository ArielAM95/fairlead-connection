import { CheckCircle, Info, TrendingUp } from 'lucide-react';
import { CommissionResultProps } from '@/types/commission';

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
            תוצאות החישוב
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-primary/10">
            <span className="text-lg font-semibold">סכום העסקה:</span>
            <span className="text-xl font-bold text-primary">
              ₪{amount.toLocaleString('he-IL')}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-primary/10">
            <span className="text-lg font-semibold">אחוז העמלה:</span>
            <span className="text-xl font-bold text-accent">
              {calculation.percentage}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-primary/10">
            <span className="text-lg font-semibold">סכום העמלה:</span>
            <span className="text-xl font-bold text-destructive">
              ₪{calculation.commission.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl px-4">
            <span className="text-lg font-bold">נשאר לבעל המקצוע:</span>
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
            <h4 className="text-xl font-bold text-accent mb-3">הסבר:</h4>
            <p className="text-base leading-relaxed text-foreground/90 mb-4">
              {explanation}
            </p>
            
            {calculation.breakdown && (
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-primary/10">
                <p className="font-semibold mb-3 text-primary">פירוט החישוב:</p>
                <div className="space-y-2 text-sm whitespace-pre-line text-foreground/80">
                  {calculation.breakdown}
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
            <h4 className="text-xl font-bold text-primary mb-4">עוד פרטים חשובים:</h4>
            
            <div className="space-y-3">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-primary/10">
                <p className="font-semibold mb-2 text-primary text-lg">
                  כמה זמן לקוח נחשב "לקוח oFair":
                </p>
                <p className="text-base leading-relaxed text-foreground/90">
                  ב{professionLabel} לקוח נחשב ללקוח מאיתנו למשך <span className="font-bold text-accent">{clientRetentionDays} ימים</span> מיום עדכון העסקה במערכת.
                  כלומר יש עמלה על כל עסקה עם אותו לקוח במשך הזמן הנ"ל.
                </p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-accent/10">
                <p className="text-base leading-relaxed text-foreground/90">
                  כאשר הלקוח פונה לעסק שוב דרך אתר oFair - זה נחשב לפניה חדשה וספירת הימים מתחדשת.
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
