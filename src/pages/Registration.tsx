import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import TranzilaPaymentDialog from '@/components/cta/TranzilaPaymentDialog';

const REGISTRATION_FEE = 413; // ₪ Production registration fee

interface ProfessionalData {
  name: string;
  email?: string;
  company_name?: string;
  business_license_number?: string;
  city?: string;
}

export default function Registration() {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPaymentLink, setIsPaymentLink] = useState(false);
  const [professionalData, setProfessionalData] = useState<ProfessionalData | null>(null);
  const [phoneCheckStatus, setPhoneCheckStatus] = useState<'idle' | 'checking' | 'found' | 'not_found'>('idle');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // 📱 Check for phone URL parameter (payment link feature)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const phoneParam = urlParams.get('phone');

    if (phoneParam) {
      console.log('Payment link detected for phone:', phoneParam);
      setPhoneNumber(phoneParam);
      setIsPaymentLink(true);

      // Fetch full professional details
      fetchProfessionalData(phoneParam);
    }
  }, []);

  // 🔍 Check if phone number exists in database (with debounce)
  useEffect(() => {
    if (isPaymentLink) return; // Skip check for payment links

    if (!phoneNumber || phoneNumber.length < 9) {
      setPhoneCheckStatus('idle');
      setProfessionalData(null);
      return;
    }

    setPhoneCheckStatus('checking');

    const timeoutId = setTimeout(() => {
      fetchProfessionalData(phoneNumber);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [phoneNumber, isPaymentLink]);

  // 📞 Fetch professional data from database
  const fetchProfessionalData = async (phone: string) => {
    try {
      console.log('Fetching professional data for phone:', phone);

      // Use Edge Function to search for professional (bypasses RLS)
      const { data, error } = await supabase.functions.invoke('find-professional', {
        body: { phoneNumber: phone }
      });

      if (error) throw error;

      console.log('Professional data received:', data);

      if (data && data.name) {
        // Store full professional data for invoice generation
        setProfessionalData({
          name: data.name,
          email: data.email || '',
          company_name: data.company_name || data.name,
          business_license_number: data.business_license_number || '',
          city: data.city || data.location || ''
        });
        setPhoneCheckStatus('found');
        console.log('✓ Professional found:', data.name);
      } else {
        setProfessionalData(null);
        setPhoneCheckStatus('not_found');
        console.log('✗ Professional not found');
      }
    } catch (error) {
      console.error('Error fetching professional data:', error);
      setPhoneCheckStatus('idle');
      setProfessionalData(null);
    }
  };

  // 💳 Open payment dialog
  const handleOpenPayment = () => {
    // Validate phone number
    if (!phoneNumber || !/^0[2-9]\d{7,8}$/.test(phoneNumber)) {
      toast.error('נא להזין מספר טלפון תקין');
      return;
    }

    // Verify professional found
    if (phoneCheckStatus !== 'found' || !professionalData) {
      toast.error('לא נמצא משתמש עם מספר טלפון זה');
      return;
    }

    setShowPaymentDialog(true);
  };

  // ✅ Handle payment success
  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      console.log('Payment successful, saving token...');

      // Parse expiry from Tranzila format (MMYY)
      const expdate = paymentData.card_expiry; // e.g., "0431" = April 2031
      const expiry_month = parseInt(expdate.substring(0, 2), 10);
      const expiry_year = 2000 + parseInt(expdate.substring(2, 4), 10);

      if (paymentData.save_card) {
        // Save payment token
        const { data, error } = await supabase.functions.invoke(
          'tranzila-registration-payment',
          {
            body: {
              phone_number: phoneNumber,
              tranzila_token: paymentData.tranzila_token,
              card_last4: paymentData.card_last4,
              expiry_month,
              expiry_year,
              confirmation_code: paymentData.confirmation_code,
              amount: 413 // Production registration fee
            }
          }
        );

        if (error) {
          console.error('Save token error:', error);
          toast.error('שגיאה בשמירת פרטי התשלום');
          return;
        }

        console.log('Registration successful with saved card:', data);
        toast.success(`ההרשמה הושלמה בהצלחה! ₪${REGISTRATION_FEE} חוייבו`, {
          duration: 4000 // Show for 4 seconds
        });
      } else {
        // User chose NOT to save card - just update payment status
        console.log('User chose not to save card, updating payment status only');

        // First get the professional_id
        const { data: prof, error: profError } = await supabase
          .from('professionals')
          .select('id')
          .eq('phone_number', phoneNumber)
          .single();

        if (profError || !prof) {
          console.error('Error finding professional:', profError);
          toast.error('שגיאה בעדכון סטטוס התשלום');
          return;
        }

        const { error } = await supabase
          .from('professionals')
          .update({
            registration_payment_status: 'completed',
            registration_paid_at: new Date().toISOString(),
            registration_amount: REGISTRATION_FEE
          })
          .eq('phone_number', phoneNumber);

        if (error) {
          console.error('Error updating payment status:', error);
          toast.error('שגיאה בעדכון סטטוס התשלום');
          return;
        }

        // Update professional_leads_crm paid status
        const { error: crmError } = await supabase
          .from('professional_leads_crm')
          .update({
            paid: true,
            paid_at: new Date().toISOString(),
            payment_amount: REGISTRATION_FEE
          })
          .eq('professional_id', prof.id);

        if (crmError) {
          console.error('Error updating CRM paid status:', crmError);
          // Non-critical - don't fail
        }

        // Log transaction (card not saved)
        await supabase.from('transaction_logs').insert({
          professional_id: prof.id,
          action: 'charge',
          request: {
            source: 'registration',
            amount: REGISTRATION_FEE,
            card_last4: paymentData.card_last4,
            phone_number: phoneNumber,
            save_card: false
          },
          response: {
            success: true,
            code: '000',
            confirmation_code: paymentData.confirmation_code || null,
            message: 'Payment completed without saving card'
          }
        });

        console.log('Registration successful without saving card');
        toast.success(`ההרשמה הושלמה בהצלחה! ₪${REGISTRATION_FEE} חוייבו`, {
          duration: 4000 // Show for 4 seconds
        });
      }

      setShowPaymentDialog(false);

      // Redirect to thank-you page after payment success
      setTimeout(() => {
        window.location.href = 'https://biz.ofair.co.il/thank-you';
      }, 4000);
    } catch (error: any) {
      console.error('Post-payment error:', error);
      toast.error(error.message || 'שגיאה בשמירת הנתונים');
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          {isPaymentLink ? (
            <>
              <h1 className="text-3xl font-bold text-foreground">השלמת תשלום הרשמה</h1>
              {professionalData && (
                <p className="text-xl text-foreground">שלום {professionalData.name}!</p>
              )}
              <p className="text-lg text-muted-foreground">
                נא להשלים את תשלום דמי ההרשמה בסך ₪{REGISTRATION_FEE}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  📱 קישור תשלום עבור: <span className="font-semibold" dir="ltr">{phoneNumber}</span>
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-foreground">תשלום הרשמה</h1>
              <p className="text-lg text-muted-foreground">דמי הרשמה: ₪{REGISTRATION_FEE} כולל מע"מ</p>
              <p className="text-sm text-muted-foreground">הזן מספר טלפון של משתמש קיים במערכת</p>
            </>
          )}
        </div>

        {/* Phone number input - Hidden if payment link */}
        {!isPaymentLink && (
          <div className="bg-card p-6 rounded-lg border border-border space-y-4 mb-8">
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
                maxLength={10}
              />

              {/* Phone check status indicator */}
              {phoneCheckStatus === 'checking' && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  בודק מספר טלפון...
                </p>
              )}
              {phoneCheckStatus === 'found' && professionalData && (
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <span>✓</span>
                  נמצא משתמש: {professionalData.name}
                </p>
              )}
              {phoneCheckStatus === 'not_found' && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <span>✗</span>
                  מספר הטלפון לא נמצא במערכת
                </p>
              )}
            </div>
          </div>
        )}

        {/* Payment Button */}
        <Button
          onClick={handleOpenPayment}
          disabled={phoneCheckStatus !== 'found' || !professionalData}
          className="w-full h-12 text-lg"
          size="lg"
        >
          {phoneCheckStatus === 'found'
            ? `המשך לתשלום ₪${REGISTRATION_FEE}`
            : 'הזן מספר טלפון תקין'}
        </Button>

        {/* Payment Dialog - Opens when button clicked */}
        {professionalData && (
          <TranzilaPaymentDialog
            open={showPaymentDialog}
            onClose={() => setShowPaymentDialog(false)}
            onSuccess={handlePaymentSuccess}
            userDetails={{
              name: professionalData.name,
              idNumber: professionalData.business_license_number || '000000000',
              phone: phoneNumber,
              email: professionalData.email,
              city: professionalData.city,
              companyName: professionalData.company_name
            }}
          />
        )}
      </div>
    </div>
  );
}
