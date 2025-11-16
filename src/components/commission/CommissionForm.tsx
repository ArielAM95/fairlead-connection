import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProfessionSelector from './ProfessionSelector';
import { useProfessions } from '@/hooks/useProfessions';
import { calculateCommission } from '@/utils/commissionCalculations';
import { CommissionCalculation } from '@/types/commission';
import { T } from '@/components/translation/T';
import { useTranslatedText } from '@/hooks/useTranslatedText';

interface CommissionFormProps {
  onCalculate: (result: {
    professionLabel: string;
    amount: number;
    calculation: CommissionCalculation;
    explanation: string;
    clientRetentionDays: number;
  }) => void;
}

const CommissionForm = ({ onCalculate }: CommissionFormProps) => {
  const { data: professions } = useProfessions();
  const [professionId, setProfessionId] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ profession?: string; amount?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { profession?: string; amount?: string } = {};
    
    if (!professionId) {
      newErrors.profession = 'יש לבחור מקצוע';
    }
    
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'יש להזין סכום תקין מעל 0';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const profession = professions?.find(p => p.profession_id === professionId);
    if (!profession || !profession.commission_category) {
      setErrors({ profession: 'מקצוע לא נמצא או אין לו הגדרת עמלה' });
      return;
    }
    
    const calculation = calculateCommission(profession.commission_category, numAmount);
    
    onCalculate({
      professionLabel: profession.label,
      amount: numAmount,
      calculation,
      explanation: profession.commission_explanation || '',
      clientRetentionDays: profession.client_retention_days || 30
    });
    
    setErrors({});
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
    if (errors.amount) {
      setErrors({ ...errors, amount: undefined });
    }
  };

  const formatNumber = (num: string) => {
    if (!num) return '';
    return parseFloat(num).toLocaleString('he-IL');
  };

  const amountPlaceholder = useTranslatedText("הזן סכום העסקה");

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl border-2 border-primary/20 rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="space-y-6">
          {/* Profession Selector */}
          <div className="space-y-2">
            <Label htmlFor="profession" className="text-lg font-semibold text-right block">
              <T>בחר מקצוע</T>
            </Label>
            <ProfessionSelector
              value={professionId}
              onChange={(value) => {
                setProfessionId(value);
                if (errors.profession) {
                  setErrors({ ...errors, profession: undefined });
                }
              }}
            />
            {errors.profession && (
              <p className="text-sm text-destructive text-right"><T>{errors.profession}</T></p>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-lg font-semibold text-right block">
              <T>סכום העסקה (₪)</T>
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder={amountPlaceholder}
                className="h-14 text-lg border-2 border-primary/20 hover:border-primary/40 focus:border-primary transition-colors text-right pr-4"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                <T>לא כולל מע״מ</T>
              </div>
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive text-right"><T>{errors.amount}</T></p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-[1.02] group"
          >
            <Calculator className="w-6 h-6 ml-2 group-hover:rotate-12 transition-transform" />
            <T>חשב עמלה</T>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommissionForm;
