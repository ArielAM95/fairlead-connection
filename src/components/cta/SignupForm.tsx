
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { WorkFieldsSection } from "./form-sections/WorkFieldsSection";
import { WorkRegionsSection } from "./form-sections/WorkRegionsSection";
import { ExperienceSection } from "./form-sections/ExperienceSection";
import { useSignupForm } from "@/hooks/useSignupForm";
import { SignupFormData } from "@/types/signupForm";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SignupFormProps {
  onSubmit: (formData: SignupFormData) => Promise<void>;
}

const SignupForm = ({ onSubmit }: SignupFormProps) => {
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleWorkFieldToggle,
    handleWorkRegionToggle,
    handleExperienceChange,
    handleSubmit
  } = useSignupForm(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PersonalInfoSection
        firstName={formData.firstName}
        lastName={formData.lastName}
        phone={formData.phone}
        city={formData.city}
        companyName={formData.companyName}
        onChange={handleChange}
        phoneError={errors.phone}
      />

      <WorkFieldsSection
        selectedFields={formData.workFields}
        onToggleField={handleWorkFieldToggle}
        showOtherWorkField={formData.showOtherWorkField}
        otherWorkField={formData.otherWorkField}
        onChange={handleChange}
      />

      <WorkRegionsSection
        selectedRegions={formData.workRegions}
        onToggleRegion={handleWorkRegionToggle}
      />

      <ExperienceSection
        value={formData.experience}
        onChange={handleExperienceChange}
        error={errors.experience}
      />

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
          id="acceptMarketing"
          name="acceptMarketing"
          checked={formData.acceptMarketing}
          onCheckedChange={(checked) => {
            // Create a synthetic event that mimics an input change event
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
          אני מאשר/ת קבלת עדכונים לגבי ההרשמה שלי, תוכן שיווקי והטבות באמצעות דוא"ל והודעות Whatsapp *
        </Label>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-ofair-900 hover:bg-ofair-800 text-white py-6"
          disabled={
            isSubmitting ||
            formData.workFields.length === 0 ||
            formData.workRegions.length === 0 ||
            !formData.experience ||
            !formData.acceptMarketing ||
            !!errors.email ||
            !!errors.phone
          }
        >
          {isSubmitting ? "מבצע רישום..." : "הירשמו כעת"}
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-4">
          בלחיצה על הכפתור אני מאשר/ת את
          <a href="/terms" className="text-ofair-900 hover:underline mx-1">
            תנאי השימוש
          </a>
          ואת
          <a href="/terms" className="text-ofair-900 hover:underline mx-1">
            מדיניות הפרטיות
          </a>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;
