
import { Input } from "@/components/ui/input";

interface PersonalInfoSectionProps {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  phoneError?: string;
}

export const PersonalInfoSection = ({
  firstName,
  lastName,
  phone,
  city,
  onChange,
  phoneError
}: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            שם פרטי *
          </label>
          <Input
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={onChange}
            required
            className="bg-gray-50 border-gray-200"
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            שם משפחה *
          </label>
          <Input
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={onChange}
            required
            className="bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          מספר טלפון *
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={onChange}
          required
          className="bg-gray-50 border-gray-200"
          dir="ltr"
          placeholder="05X-XXXXXXX"
          error={!!phoneError}
          errorMessage={phoneError}
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          עיר *
        </label>
        <Input
          id="city"
          name="city"
          value={city}
          onChange={onChange}
          required
          className="bg-gray-50 border-gray-200"
          placeholder="שם העיר"
        />
      </div>
    </div>
  );
};
