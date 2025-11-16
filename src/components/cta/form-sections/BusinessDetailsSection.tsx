
import { Input } from "@/components/ui/input";
import { T } from "@/components/translation/T";

interface BusinessDetailsSectionProps {
  companyName: string;
  businessLicenseNumber: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  businessLicenseError?: string;
}

export const BusinessDetailsSection = ({
  companyName,
  businessLicenseNumber,
  onChange,
  businessLicenseError
}: BusinessDetailsSectionProps) => {
  // Handler to allow only numbers in business license field (max 9 digits)
  const handleBusinessLicenseInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits, limit to 9 characters
    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 9);
    e.target.value = value;
    onChange(e);
  };

  return (
    <>
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          <T>שם החברה (אופציונלי)</T>
        </label>
        <Input
          id="companyName"
          name="companyName"
          type="text"
          value={companyName}
          onChange={onChange}
          placeholder="הזן שם חברה"
          className="bg-gray-50 border-gray-200"
        />
      </div>

      <div>
        <label htmlFor="businessLicenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
          <T>מספר עוסק מורשה/פטור/ח.פ</T> *
        </label>
        <Input
          id="businessLicenseNumber"
          name="businessLicenseNumber"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={9}
          value={businessLicenseNumber}
          onChange={handleBusinessLicenseInput}
          placeholder="הזן מספר עוסק"
          required
          error={!!businessLicenseError}
          errorMessage={businessLicenseError}
          className="bg-gray-50 border-gray-200"
          dir="ltr"
        />
        <p className="text-xs text-gray-500 mt-1">
          <T>9 ספרות בלבד</T>
        </p>
      </div>
    </>
  );
};
