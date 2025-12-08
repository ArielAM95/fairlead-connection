import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface AffiliateValidation {
  valid: boolean;
  referrer_id?: string;
  referrer_name?: string;
  affiliate_code?: string; // The actual affiliate code used
  original_price?: number;
  discount_percent?: number;
  discount_amount?: number;
  discounted_price?: number;
  error?: string;
}

interface AffiliateCodeInputProps {
  onValidCode: (data: AffiliateValidation | null) => void;
  initialCode?: string;
}

export default function AffiliateCodeInput({ onValidCode, initialCode }: AffiliateCodeInputProps) {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [validation, setValidation] = useState<AffiliateValidation | null>(null);

  // Read affiliate code from URL on mount
  useEffect(() => {
    const urlCode = searchParams.get('ref') || searchParams.get('affiliate') || initialCode;
    if (urlCode) {
      const formattedCode = urlCode.toUpperCase().replace(/\s/g, '');
      setCode(formattedCode);
    }
  }, [searchParams, initialCode]);

  const validateCode = useCallback(async (affiliateCode: string) => {
    if (!affiliateCode || affiliateCode.length < 5) {
      setStatus('idle');
      setValidation(null);
      onValidCode(null);
      return;
    }

    setStatus('checking');

    try {
      const { data, error } = await supabase.functions.invoke('validate-affiliate-code', {
        body: { affiliate_code: affiliateCode }
      });

      if (error) throw error;

      if (data.valid) {
        setStatus('valid');
        // Include the actual code used in the validation data
        const validationData = { ...data, affiliate_code_used: code };
        setValidation(validationData);
        onValidCode(validationData);
      } else {
        setStatus('invalid');
        setValidation(null);
        onValidCode(null);
      }
    } catch (error) {
      console.error('Error validating affiliate code:', error);
      setStatus('invalid');
      setValidation(null);
      onValidCode(null);
    }
  }, [onValidCode]);

  // Debounced validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateCode(code);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [code, validateCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Uppercase and remove spaces
    const value = e.target.value.toUpperCase().replace(/\s/g, '');
    setCode(value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="affiliate-code" className="text-sm font-medium">
        יש לך קוד הפניה? (אופציונלי)
      </Label>
      <div className="relative">
        <Input
          id="affiliate-code"
          type="text"
          value={code}
          onChange={handleChange}
          placeholder="OFAIR-XXXXXX"
          dir="ltr"
          maxLength={12}
          className="text-center tracking-wider"
        />
        
        {/* Status indicator */}
        {status === 'checking' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <span className="animate-spin text-muted-foreground">⏳</span>
          </div>
        )}
        {status === 'valid' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <span className="text-green-600">✓</span>
          </div>
        )}
        {status === 'invalid' && code.length >= 5 && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <span className="text-red-600">✗</span>
          </div>
        )}
      </div>

      {/* Valid code message with discount info */}
      {status === 'valid' && validation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-1">
          <p className="text-sm text-green-800 font-medium flex items-center gap-2">
            <span>🎉</span>
            קוד הפניה תקין!
          </p>
          <p className="text-sm text-green-700">
            הופנית על ידי: <span className="font-semibold">{validation.referrer_name}</span>
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {validation.discount_percent}% הנחה
            </Badge>
            <span className="text-sm text-green-700">
              <span className="line-through text-muted-foreground">₪{validation.original_price}</span>
              {' → '}
              <span className="font-bold text-green-800">₪{validation.discounted_price?.toFixed(0)}</span>
            </span>
          </div>
        </div>
      )}

      {/* Invalid code message */}
      {status === 'invalid' && code.length >= 5 && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span>✗</span>
          קוד הפניה לא תקין
        </p>
      )}

      {/* Helper text */}
      {status === 'idle' && (
        <p className="text-xs text-muted-foreground">
          אם קיבלת קוד הפניה מחבר, הזן אותו כאן לקבלת 10% הנחה
        </p>
      )}
    </div>
  );
}
