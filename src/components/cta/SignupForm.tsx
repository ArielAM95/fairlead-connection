
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { BusinessDetailsSection } from "./form-sections/BusinessDetailsSection";
import { OccupationDetailsSection } from "./form-sections/OccupationDetailsSection";
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
    handleMainProfessionChange,
    handleSubSpecializationToggle,
    handleSubmit
  } = useSignupForm(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
          mainProfession={formData.mainProfession}
          onMainProfessionChange={handleMainProfessionChange}
          subSpecializations={formData.subSpecializations}
          onSubSpecializationToggle={handleSubSpecializationToggle}
          mainProfessionError={errors.mainProfession}
          subSpecializationsError={errors.subSpecializations}
          selectedFields={formData.workFields}
          onToggleField={handleWorkFieldToggle}
          showOtherWorkField={formData.showOtherWorkField}
          otherWorkField={formData.otherWorkField}
          selectedRegions={formData.workRegions}
          onToggleRegion={handleWorkRegionToggle}
          experience={formData.experience}
          onExperienceChange={handleExperienceChange}
          onChange={handleChange}
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
            !formData.mainProfession ||
            formData.workRegions.length === 0 ||
            !formData.experience ||
            !formData.acceptTerms ||
            !!errors.email ||
            !!errors.phone ||
            !!errors.businessLicenseNumber ||
            !!errors.mainProfession ||
            !!errors.subSpecializations
          }
        >
          {isSubmitting ? "מבצע רישום..." : "הירשמו כעת"}
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
