import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import TranzilaPaymentDialog from '@/components/cta/TranzilaPaymentDialog';
import SignupForm from '@/components/cta/SignupForm';
import AffiliateCodeInput from '@/components/cta/AffiliateCodeInput';
import { SignupFormData } from '@/types/signupForm';
import { submitSignupForm } from '@/services/formSubmission';
import { useUtmParams } from '@/hooks/useUtmParams';
import { workFields } from '@/components/cta/data/workFields';
import { workRegionsHierarchy } from '@/components/cta/data/workRegionsHierarchy';

const REGISTRATION_FEE = 413; // ₪ Production registration fee

interface ProfessionalData {
  name: string;
  email?: string;
  company_name?: string;
  business_license_number?: string;
  city?: string;
}

// AffiliateData type is imported from TranzilaPaymentDialog via props
interface AffiliateData {
  valid: boolean;
  referrer_id?: string;
  referrer_name?: string;
  original_price?: number;
  discount_percent?: number;
  discount_amount?: number;
  discounted_price?: number;
}

export default function Registration() {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPaymentLink, setIsPaymentLink] = useState(false);
  const [professionalData, setProfessionalData] = useState<ProfessionalData | null>(null);
  const [phoneCheckStatus, setPhoneCheckStatus] = useState<'idle' | 'checking' | 'found' | 'not_found'>('idle');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  
  const utmParams = useUtmParams();
  
  // Calculate actual price based on affiliate discount
  const actualPrice = affiliateData?.discounted_price || REGISTRATION_FEE;

  // Flatten work regions for submitSignupForm
  const workRegions = workRegionsHierarchy.flatMap(region => 
    region.subAreas.map(area => ({ id: area.id, label: area.label }))
  );

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

      // ALWAYS call edge function (handles both save_card=true and save_card=false)
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
            amount: actualPrice, // Use discounted price if affiliate code applied
            save_card: paymentData.save_card,
            affiliate_code: paymentData.affiliate_code // Pass affiliate code if used
          }
        }
      );

      if (error) {
        console.error('Payment completion error:', error);
        toast.error('שגיאה בשמירת פרטי התשלום');
        return;
      }

      console.log('Registration successful:', data);
      const chargedAmount = data.final_amount || actualPrice;
      toast.success(`ההרשמה הושלמה בהצלחה! ₪${chargedAmount.toFixed(0)} חוייבו`, {
        duration: 4000 // Show for 4 seconds
      });

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

  // Handle signup form submission (for new users)
  const handleSignupSubmit = async (formData: SignupFormData) => {
    try {
      // Submit to webhook and Supabase
      await submitSignupForm(formData, workFields, workRegions, utmParams);
      
      // After successful submission, professional is created, continue to payment dialogs
      // (payment dialogs are handled by SignupForm internally)
    } catch (error: any) {
      console.error('Signup submission error:', error);
      toast.error(error.message || 'שגיאה ברישום');
      throw error;
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
                נא להשלים את תשלום דמי ההרשמה בסך ₪{actualPrice.toFixed(0)}
                {affiliateData && (
                  <span className="text-green-600 mr-2">(כולל הנחת הפניה!)</span>
                )}
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
              <p className="text-lg text-muted-foreground">
                דמי הרשמה: ₪{REGISTRATION_FEE} כולל מע"מ
                {affiliateData && (
                  <span className="text-green-600 mr-2"> → ₪{actualPrice.toFixed(0)} עם הנחה!</span>
                )}
              </p>
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

            {/* Show registration button when phone not found */}
            {phoneCheckStatus === 'not_found' && !showSignupForm && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium mb-3">
                  מספר הטלפון לא נמצא במערכת. רוצים להירשם?
                </p>
                <Button
                  onClick={() => setShowSignupForm(true)}
                  className="w-full"
                  variant="default"
                >
                  הירשמו כמשתמש חדש
                </Button>
              </div>
            )}

            {/* Affiliate Code Input - Show when phone not found but not showing signup form yet */}
            {phoneCheckStatus !== 'not_found' && (
              <div className="mt-4 pt-4 border-t border-border">
                <AffiliateCodeInput onValidCode={setAffiliateData} />
              </div>
            )}
          </div>
        )}

        {/* Show full signup form when user clicks "Register as new user" */}
        {!isPaymentLink && showSignupForm && phoneCheckStatus === 'not_found' && (
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">טופס הרשמה</h2>
            <SignupForm 
              onSubmit={handleSignupSubmit}
              initialPhone={phoneNumber}
              submitButtonText="בצע הרשמה והמשך לתשלום"
              disablePhoneInput={true}
            />
          </div>
        )}

        {/* Payment Button - Only show for existing users */}
        {!showSignupForm && (
          <Button
            onClick={handleOpenPayment}
            disabled={phoneCheckStatus !== 'found' || !professionalData}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {phoneCheckStatus === 'found'
              ? affiliateData 
                ? `המשך לתשלום ₪${actualPrice.toFixed(0)} (כולל הנחה!)`
                : `המשך לתשלום ₪${REGISTRATION_FEE}`
              : 'הזן מספר טלפון תקין'}
          </Button>
        )}

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
            affiliateData={affiliateData}
          />
        )}
      </div>
    </div>
  );
}
