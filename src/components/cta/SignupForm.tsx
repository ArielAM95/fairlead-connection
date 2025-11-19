
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { BusinessDetailsSection } from "./form-sections/BusinessDetailsSection";
import { OccupationDetailsSection } from "./form-sections/OccupationDetailsSection";
import { useSignupForm } from "@/hooks/useSignupForm";
import { SignupFormData } from "@/types/signupForm";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import TranzilaPaymentDialog from "./TranzilaPaymentDialog";
import PrePaymentDialog from "./PrePaymentDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SignupFormProps {
  onSubmit: (formData: SignupFormData) => Promise<void>;
}

const SignupForm = ({ onSubmit }: SignupFormProps) => {
  const [showPrePaymentDialog, setShowPrePaymentDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<SignupFormData | null>(null);
  
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleWorkFieldToggle,
    handleWorkRegionToggle,
    handleExperienceChange,
    handleProfessionToggle,
    handleSubSpecializationToggle,
    handleOtherProfessionChange,
    handleSubmit,
    setFormData
  } = useSignupForm(onSubmit);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before opening payment dialog
    const validationErrors: any = {};

    if (!formData.acceptTerms) {
      validationErrors.acceptTerms = "חובה לאשר את תנאי השימוש";
    }

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Store form data
    setPendingFormData(formData);

    try {
      toast.info('שומר פרטים...');

      // Create professional record in DB + send webhook (handled by onSubmit)
      await onSubmit(formData);

      // Open pre-payment dialog after professional is created
      toast.success('הפרטים נשמרו! עבור לתשלום');
      setShowPrePaymentDialog(true);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('שגיאה בשמירת הפרטים');
    }
  };

  const handleProceedToPayment = () => {
    setShowPrePaymentDialog(false);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    if (!pendingFormData) {
      toast.error('נתוני טופס לא נמצאו');
      return;
    }

    try {
      // Check if user wants to save the card
      if (paymentData.save_card) {
        // Parse expiry from Tranzila format (MMYY)
        const expdate = paymentData.card_expiry; // e.g., "0431" = April 2031
        const expiry_month = parseInt(expdate.substring(0, 2), 10);
        const expiry_year = 2000 + parseInt(expdate.substring(2, 4), 10);

        // Save payment token (professional already exists in DB)
        const { data, error } = await supabase.functions.invoke(
          'tranzila-registration-payment',
          {
            body: {
              phone_number: pendingFormData.phone,
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
          setShowPaymentDialog(false);
          return;
        }

        console.log('Payment method saved successfully:', data);
        toast.success('ההרשמה והתשלום הושלמו בהצלחה!', {
          duration: 5000 // Show for 5 seconds
        });
      } else {
        // User chose NOT to save card - just update payment status
        console.log('User chose not to save card, updating payment status only');

        // First get the professional_id
        const { data: prof, error: profError } = await supabase
          .from('professionals')
          .select('id')
          .eq('phone_number', pendingFormData.phone)
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
            registration_amount: 413 // Production registration fee
          })
          .eq('phone_number', pendingFormData.phone);

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
            payment_amount: 413
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
            source: 'signup_form',
            amount: 413,
            card_last4: paymentData.card_last4,
            phone_number: pendingFormData.phone,
            save_card: false
          },
          response: {
            success: true,
            code: '000',
            confirmation_code: paymentData.confirmation_code || null,
            message: 'Payment completed without saving card'
          }
        });

        toast.success('ההרשמה והתשלום הושלמו בהצלחה!', {
          duration: 5000 // Show for 5 seconds
        });
        console.log('Payment completed without saving card');
      }

      // Close dialog after all async operations complete
      setShowPaymentDialog(false);

      // Redirect to thank-you page after payment success
      setTimeout(() => {
        window.location.href = 'https://biz.ofair.co.il/thank-you';
      }, 4000);

      // Payment complete - no need to call onSubmit again (already created)

    } catch (error) {
      console.error('Payment completion error:', error);
      toast.error('שגיאה בסיום התהליך');
      setShowPaymentDialog(false);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-8">
      {/* פרטים אישיים */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-ofair-900 border-b-2 border-ofair-300 pb-2">
          פרטים אישיים
        </h3>
        <PersonalInfoSection
          firstName={formData.firstName}
          lastName={formData.lastName}
          phone={formData.phone}
          city={formData.city}
          onChange={handleChange}
          phoneError={errors.phone}
        />
      </div>

      {/* פרטי העסק */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-ofair-900 border-b-2 border-ofair-300 pb-2">
          פרטי העסק
        </h3>
        <BusinessDetailsSection
          companyName={formData.companyName}
          businessLicenseNumber={formData.businessLicenseNumber}
          onChange={handleChange}
          businessLicenseError={errors.businessLicenseNumber}
        />
      </div>

      {/* פרטי עיסוק */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-ofair-900 border-b-2 border-ofair-300 pb-2">
          פרטי עיסוק
        </h3>
        <OccupationDetailsSection
          selectedProfessions={formData.professions}
          onProfessionToggle={handleProfessionToggle}
          onSubSpecializationToggle={handleSubSpecializationToggle}
          professionsError={errors.professions}
          otherProfessionError={errors.otherProfession}
          selectedRegions={formData.workRegions}
          onToggleRegion={handleWorkRegionToggle}
          experience={formData.experience}
          onExperienceChange={handleExperienceChange}
          experienceError={errors.experience}
          formData={formData}
          onOtherProfessionChange={handleOtherProfessionChange}
          setFormData={setFormData}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          אימייל (אופציונלי)
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="bg-gray-50 border-gray-200"
          dir="ltr"
          placeholder="your@email.com"
          error={!!errors.email}
          errorMessage={errors.email}
        />
      </div>

      <div className="flex items-start gap-2 rtl:space-x-reverse">
        <Checkbox
          id="acceptTerms"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onCheckedChange={(checked) => {
            handleChange({
              target: {
                name: "acceptTerms",
                type: "checkbox",
                checked: !!checked
              }
            } as React.ChangeEvent<HTMLInputElement>)
          }}
        />
        <Label
          htmlFor="acceptTerms"
          className="text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          אני מאשר/ת את{" "}
          <a href="/terms" className="text-ofair-900 hover:underline">
            תנאי השימוש
          </a>
          {" "}ואת{" "}
          <a href="/terms" className="text-ofair-900 hover:underline">
            מדיניות הפרטיות
          </a>
          {" *"}
        </Label>
      </div>

      <div className="flex items-start gap-2 rtl:space-x-reverse">
        <Checkbox
          id="acceptMarketing"
          name="acceptMarketing"
          checked={formData.acceptMarketing}
          onCheckedChange={(checked) => {
            handleChange({
              target: {
                name: "acceptMarketing",
                type: "checkbox",
                checked: !!checked
              }
            } as React.ChangeEvent<HTMLInputElement>)
          }}
        />
        <Label
          htmlFor="acceptMarketing"
          className="text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          אני מאשר/ת קבלת עדכונים לגבי ההרשמה שלי, תוכן שיווקי והטבות באמצעות דוא"ל והודעות Whatsapp (חובה)
        </Label>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-ofair-900 hover:bg-ofair-800 text-white py-6"
          disabled={
            isSubmitting ||
            formData.professions.length === 0 ||
            formData.workRegions.length === 0 ||
            !formData.experience ||
            !formData.acceptTerms ||
            !!errors.phone ||
            !!errors.businessLicenseNumber ||
            !!errors.professions ||
            !!errors.otherProfession
          }
        >
          {isSubmitting ? "מבצע רישום..." : "הירשמו כעת"}
        </Button>
        
        {(errors.email || errors.phone || errors.experience || errors.acceptTerms || errors.businessLicenseNumber || errors.professions || errors.otherProfession) && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 font-medium mb-2">נא לתקן את השגיאות הבאות:</p>
            <ul className="list-disc list-inside space-y-1 text-red-600 text-sm">
              {errors.email && <li>{errors.email}</li>}
              {errors.phone && <li>{errors.phone}</li>}
              {errors.businessLicenseNumber && <li>{errors.businessLicenseNumber}</li>}
              {errors.professions && <li>{errors.professions}</li>}
              {errors.otherProfession && <li>{errors.otherProfession}</li>}
              {errors.experience && <li>{errors.experience}</li>}
              {errors.acceptTerms && <li>{errors.acceptTerms}</li>}
            </ul>
          </div>
        )}
      </div>
    </form>

    <PrePaymentDialog
      open={showPrePaymentDialog}
      onClose={() => setShowPrePaymentDialog(false)}
      onProceedToPayment={handleProceedToPayment}
    />

    <TranzilaPaymentDialog
      open={showPaymentDialog}
      onClose={() => setShowPaymentDialog(false)}
      onSuccess={handlePaymentSuccess}
      userDetails={{
        name: `${formData.firstName} ${formData.lastName}`,
        idNumber: formData.businessLicenseNumber || '000000000',
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        companyName: formData.companyName,
      }}
    />
    </>
  );
};

export default SignupForm;
