import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Tranzila SDK Types
declare global {
  interface Window {
    TzlaHostedFields?: {
      create: (options: any) => any;
    };
  }
}

const REGISTRATION_FEE = 1; // ₪ FOR TESTING - Change back to 413 for production

export default function Registration() {
  const navigate = useNavigate();
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [fieldsReady, setFieldsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [handshakeToken, setHandshakeToken] = useState<string>('');
  const [terminalName, setTerminalName] = useState<string>('');

  const [phoneNumber, setPhoneNumber] = useState('');

  // 🔒 Disconnect Supabase realtime (למניעת שגיאת JSON.parse)
  useEffect(() => {
    const channels = supabase.getChannels();
    channels.forEach(channel => channel.unsubscribe());

    return () => {
      console.log('Supabase channels will reconnect naturally');
    };
  }, []);

  // 📦 Load Tranzila SDK
  useEffect(() => {
    loadTranzilaSDK();
  }, []);

  const loadTranzilaSDK = async () => {
    try {
      console.log('Getting handshake token...');

      // Use public handshake (no auth required for registration)
      const { data, error } = await supabase.functions.invoke('tranzila-handshake-public');

      if (error) {
        console.error('Handshake error:', error);
        throw error;
      }

      const { handshakeToken: token, terminal } = data;
      console.log('Handshake token received, terminal:', terminal);

      setHandshakeToken(token);
      setTerminalName(terminal);

      // Load Tranzila SDK script
      const script = document.createElement('script');
      script.src = 'https://hf.tranzila.com/assets/js/thostedf.js';
      script.async = true;
      script.onload = () => {
        console.log('Tranzila SDK loaded');
        setSdkLoaded(true);
        initHostedFields(handshakeToken, terminal);
      };
      script.onerror = () => {
        console.error('Failed to load Tranzila SDK');
        toast.error('שגיאה בטעינת מערכת התשלום');
      };
      document.body.appendChild(script);

    } catch (error: any) {
      console.error('SDK load error:', error);
      toast.error('שגיאה בטעינת מערכת התשלום');
    }
  };

  const initHostedFields = (handshakeToken: string, terminal: string) => {
    if (!window.TzlaHostedFields) {
      toast.error('מערכת התשלום לא זמינה');
      return;
    }

    try {
      const hostedFieldsInstance = window.TzlaHostedFields.create({
        sandbox: false,
        terminal_name: terminal,
        handshake_token: handshakeToken,
        fields: {
          credit_card_number: { selector: '#hosted-card-number' },
          cvv: { selector: '#hosted-cvv' },
          expiry: { selector: '#hosted-expiry' }
        }
      });

      hostedFieldsInstance.onEvent('ready', () => {
        console.log('Tranzila Hosted Fields ready');
        setFieldsReady(true);
      });

      hostedFieldsInstance.onEvent('validityChange', (event: any) => {
        console.log('Field validity changed:', event);
      });

      // Store for charge
      (window as any).tranzilaInstance = hostedFieldsInstance;

    } catch (error) {
      console.error('Hosted fields init error:', error);
      toast.error('שגיאה באתחול שדות תשלום');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number
    if (!phoneNumber || !/^0[2-9]\d{7,8}$/.test(phoneNumber)) {
      toast.error('נא להזין מספר טלפון תקין');
      return;
    }

    if (!fieldsReady) {
      toast.error('שדות התשלום טרם מוכנים');
      return;
    }

    setIsSubmitting(true);

    try {
      const tranzilaInstance = (window as any).tranzilaInstance;

      if (!tranzilaInstance) {
        throw new Error('Tranzila instance not found');
      }

      console.log('Charging registration fee via Tranzila...');

      // Charge with Tranzila (includes tokenization) - Using callback pattern from docs
      const chargeResult = await new Promise<any>((resolve, reject) => {
        tranzilaInstance.charge(
          {
            terminal_name: terminalName,
            thtk: handshakeToken,
            amount: REGISTRATION_FEE.toFixed(2),
            currency_code: 'ILS',
            tran_mode: 'A', // Authorization + Capture
            tokenize: true  // Enable tokenization
          },
          (err: any, response: any) => {
            if (err) {
              console.error('Charge error:', err);
              reject(err);
            } else {
              console.log('Charge response:', response);
              resolve(response);
            }
          }
        );
      });

      console.log('Tranzila charge result:', chargeResult);

      // Send entire Tranzila response to Make.com webhook (non-blocking)
      fetch('https://hook.eu2.make.com/f6ktm70ppeik9wyo7jey5tljf5bcf5xj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tranzila_response: chargeResult,
          phone_number: phoneNumber,
          timestamp: new Date().toISOString(),
          amount: REGISTRATION_FEE,
          source: 'registration_page'
        })
      }).catch(err => {
        console.error('Failed to send Tranzila response to Make.com:', err);
        // Non-blocking - don't throw error
      });

      // Extract token from response according to docs
      const txnResponse = chargeResult.transaction_response;
      if (!txnResponse?.success || txnResponse.processor_response_code !== '000') {
        throw new Error('Charge failed: ' + (txnResponse?.processor_response_message || 'Unknown error'));
      }

      const tranzilaToken = txnResponse.token;
      const last4 = String(txnResponse.credit_card_last_4_digits).padStart(4, '0').slice(-4);

      // Parse expiry from response
      const expiry_month = Number(txnResponse.expiry_month);
      // Tranzila returns 2-digit year (e.g., "31" for 2031), convert to 4-digit
      const twoDigitYear = Number(txnResponse.expiry_year);
      const expiry_year = twoDigitYear < 100 ? 2000 + twoDigitYear : twoDigitYear;

      const paymentData = {
        phone_number: phoneNumber,
        tranzila_token: tranzilaToken,
        card_last4: last4,
        expiry_month,
        expiry_year,
        confirmation_code: txnResponse.confirmation_code || '',
        amount: REGISTRATION_FEE
      };

      console.log('Sending payment data:', paymentData);

      // Call new registration payment function
      const { data: saveData, error: saveError } = await supabase.functions.invoke(
        'tranzila-registration-payment',
        {
          body: paymentData
        }
      );

      console.log('Function response - data:', saveData);
      console.log('Function response - error:', saveError);

      if (saveError) {
        console.error('Save token error:', saveError);
        console.error('Error details:', JSON.stringify(saveError, null, 2));

        // Try to get the actual error message from the response
        let errorMessage = 'Unknown error';
        if (saveData && typeof saveData === 'object') {
          console.error('Error response body:', saveData);
          errorMessage = saveData.error || saveData.message || errorMessage;
        }

        throw new Error(`שגיאה בשמירת פרטי המשתמש: ${errorMessage}`);
      }

      console.log('Registration successful:', saveData);
      toast.success(`ההרשמה הושלמה בהצלחה! ₪${REGISTRATION_FEE} חוייבו`);

      // Navigate to success page or dashboard
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'שגיאה בתהליך ההרשמה');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">דף בדיקה - תשלום הרשמה</h1>
            <p className="text-lg text-muted-foreground">דמי הרשמה: ₪{REGISTRATION_FEE} כולל מע"מ</p>
            <p className="text-sm text-muted-foreground">הזן מספר טלפון של משתמש קיים במערכת</p>
          </div>

          {/* Phone number only */}
          <div className="bg-card p-6 rounded-lg border border-border space-y-4">
            <h2 className="text-xl font-semibold text-card-foreground">מספר טלפון</h2>

            <div className="space-y-2">
              <Label htmlFor="phone">טלפון *</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="050-1234567"
                dir="ltr"
                required
              />
              <p className="text-sm text-muted-foreground">
                המספר חייב להיות קיים בטבלת professionals
              </p>
            </div>
          </div>

          {/* פרטי תשלום - Hosted Fields */}
          <div className="bg-card p-6 rounded-lg border border-border space-y-4">
            <h2 className="text-xl font-semibold text-card-foreground">פרטי תשלום</h2>
            
            <div className="space-y-2">
              <Label>מספר כרטיס *</Label>
              <div 
                id="hosted-card-number" 
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>תוקף (MM/YY) *</Label>
                <div 
                  id="hosted-expiry" 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <Label>CVV *</Label>
                <div 
                  id="hosted-cvv" 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* הודעת אבטחה */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <span className="text-lg">🔒</span>
            <p>פרטי הכרטיס מוצפנים ומאובטחים על ידי Tranzila</p>
          </div>

          {/* כפתור שליחה */}
          <Button
            type="submit"
            disabled={!fieldsReady || isSubmitting}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                מעבד תשלום...
              </span>
            ) : (
              `שלם ₪${REGISTRATION_FEE} והירשם`
            )}
          </Button>

          {/* סטטוס */}
          <div className="text-center text-sm text-muted-foreground">
            {!sdkLoaded && <p>טוען מערכת תשלום...</p>}
            {sdkLoaded && !fieldsReady && <p>מכין שדות תשלום...</p>}
            {fieldsReady && <p className="text-green-600">✓ מערכת התשלום מוכנה</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
