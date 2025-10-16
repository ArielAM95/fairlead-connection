
import { Input } from "@/components/ui/input";

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
  // Handler to allow only numbers in business license field
  const handleBusinessLicenseInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits, spaces, and hyphens
    const value = e.target.value.replace(/[^\d\s-]/g, '');
    e.target.value = value;
    onChange(e);
  };

  return (
    <>
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          שם החברה (אופציונלי)
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
          מספר עוסק מורשה/פטור/ח.פ *
        </label>
        <Input
          id="businessLicenseNumber"
          name="businessLicenseNumber"
          type="text"
          inputMode="numeric"
          pattern="[\d\s-]*"
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
          מספרים בלבד
        </p>
      </div>
    </>
  );
};
