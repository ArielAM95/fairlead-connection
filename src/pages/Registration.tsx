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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    location: '',
    idNumber: '',
  });

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

      const { handshakeToken, terminal } = data;
      console.log('Handshake token received, terminal:', terminal);

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

      hostedFieldsInstance.on('ready', () => {
        console.log('Tranzila Hosted Fields ready');
        setFieldsReady(true);
      });

      hostedFieldsInstance.on('validityChange', (event: any) => {
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

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || 
        !formData.profession || !formData.location || !formData.idNumber) {
      toast.error('נא למלא את כל השדות');
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

      // Validate card fields
      const validation = await tranzilaInstance.validate();
      if (!validation.valid) {
        toast.error('פרטי כרטיס אינם תקינים');
        setIsSubmitting(false);
        return;
      }

      console.log('Charging registration fee via Tranzila...');

      // Charge with Tranzila (includes tokenization)
      const chargeResult = await tranzilaInstance.charge({
        sum: REGISTRATION_FEE.toFixed(2),
        currency: '1', // ILS
        cred_type: '1', // Regular payment
        tranmode: 'A', // Authorization + Capture
        pdesc: `דמי הרשמה - ${formData.name}`,
        id: formData.idNumber,
        createtoken: '1', // טוקניזציה
      });

      console.log('Tranzila charge result:', chargeResult);

      if (!chargeResult || chargeResult.error) {
        throw new Error(chargeResult?.error || 'Charge failed');
      }

      // Parse expiry from Tranzila format (MMYY)
      const expdate = chargeResult.expdate; // e.g., "0431" = April 2031
      const expiry_month = parseInt(expdate.substring(0, 2), 10);
      const expiry_year = 2000 + parseInt(expdate.substring(2, 4), 10);

      // Call new registration payment function
      const { data: saveData, error: saveError } = await supabase.functions.invoke(
        'tranzila-registration-payment',
        {
          body: {
            phone_number: formData.phone,
            tranzila_token: chargeResult.TranzilaToken,
            card_last4: chargeResult.ccno_4,
            expiry_month,
            expiry_year,
            confirmation_code: chargeResult.ConfirmationCode,
            amount: REGISTRATION_FEE
          }
        }
      );

      if (saveError) {
        console.error('Save token error:', saveError);
        throw new Error('שגיאה בשמירת פרטי המשתמש');
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
            <h1 className="text-3xl font-bold text-foreground">הרשמה למערכת</h1>
            <p className="text-lg text-muted-foreground">דמי הרשמה: ₪{REGISTRATION_FEE} כולל מע"מ</p>
          </div>

          {/* פרטים אישיים */}
          <div className="bg-card p-6 rounded-lg border border-border space-y-4">
            <h2 className="text-xl font-semibold text-card-foreground">פרטים אישיים</h2>
            
            <div className="space-y-2">
              <Label htmlFor="name">שם מלא *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="הכנס שם מלא"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">אימייל *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">טלפון *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="050-1234567"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession">מקצוע *</Label>
              <Input
                id="profession"
                type="text"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                placeholder="למשל: אינסטלטור, חשמלאי"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">מיקום *</Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="עיר"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">תעודת זהות *</Label>
              <Input
                id="idNumber"
                type="text"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                placeholder="9 ספרות"
                maxLength={9}
                required
              />
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
