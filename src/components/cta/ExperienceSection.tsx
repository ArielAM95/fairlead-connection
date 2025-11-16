
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { experienceOptions } from "./data/workFields";
import { T } from "@/components/translation/T";
import { useTranslatedText } from "@/hooks/useTranslatedText";

interface ExperienceSectionProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const ExperienceSection = ({ value, onChange, error }: ExperienceSectionProps) => {
  const placeholder = useTranslatedText("בחר ותק");

  return (
    <div>
      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
        <T>ותק</T> *
      </label>
      <Select onValueChange={onChange} value={value} required>
        <SelectTrigger className={`bg-gray-50 border-gray-200 ${error ? 'border-red-500 ring-red-500' : ''}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {experienceOptions.map(option => (
            <SelectItem key={option.id} value={option.id}>
              <T>{option.label}</T>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-red-500 mt-1"><T>{error}</T></p>
      )}
    </div>
  );
};
