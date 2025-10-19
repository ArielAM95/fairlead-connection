
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
    handleSubmit
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
      // Send webhook before showing dialog
      toast.info('שולח נתונים...');
      
      const { error } = await supabase.functions.invoke('send-registration-webhook', {
        body: formData
      });
      
      if (error) {
        console.error('Webhook error:', error);
        toast.error('שגיאה בשליחת הנתונים');
        return;
      }
      
      // Open pre-payment dialog after successful webhook
      setShowPrePaymentDialog(true);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('שגיאה בתהליך ההרשמה');
    }
  };

  const handleProceedToPayment = () => {
    setShowPrePaymentDialog(false);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    if (!pendingFormData) return;
    
    // Close dialog
    setShowPaymentDialog(false);
    
    // Combine form data with payment data and submit
    const completeData = {
      ...pendingFormData,
      ...paymentData,
      registration_amount: 413,
    };
    
    await onSubmit(completeData);
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
          selectedRegions={formData.workRegions}
          onToggleRegion={handleWorkRegionToggle}
          experience={formData.experience}
          onExperienceChange={handleExperienceChange}
          experienceError={errors.experience}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          אימייל *
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
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
          אני מאשר/ת קבלת עדכונים לגבי ההרשמה שלי, תוכן שיווקי והטבות באמצעות דוא"ל והודעות Whatsapp (אופציונלי)
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
            !!errors.email ||
            !!errors.phone ||
            !!errors.businessLicenseNumber ||
            !!errors.professions
          }
        >
          {isSubmitting ? "מבצע רישום..." : "הירשמו כעת"}
        </Button>
        
        {(errors.email || errors.phone || errors.experience || errors.acceptTerms || errors.businessLicenseNumber || errors.professions) && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 font-medium mb-2">נא לתקן את השגיאות הבאות:</p>
            <ul className="list-disc list-inside space-y-1 text-red-600 text-sm">
              {errors.email && <li>{errors.email}</li>}
              {errors.phone && <li>{errors.phone}</li>}
              {errors.businessLicenseNumber && <li>{errors.businessLicenseNumber}</li>}
              {errors.professions && <li>{errors.professions}</li>}
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
      }}
    />
    </>
  );
};

export default SignupForm;
