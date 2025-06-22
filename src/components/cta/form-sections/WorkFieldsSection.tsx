
import FieldSelector from "../FieldSelector";
import { Input } from "@/components/ui/input";
import { workFields } from "../data/workFields";

interface WorkFieldsSectionProps {
  selectedFields: string[];
  onToggleField: (id: string) => void;
  showOtherWorkField: boolean;
  otherWorkField: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const WorkFieldsSection = ({
  selectedFields,
  onToggleField,
  showOtherWorkField,
  otherWorkField,
  onChange
}: WorkFieldsSectionProps) => {
  // הוסף את האופציה "אחר" לרשימת התחומים
  const fieldsWithOther = [
    ...workFields,
    { id: "other", label: "אחר" }
  ];

  return (
    <div className="space-y-4">
      <FieldSelector
        fields={fieldsWithOther}
        selectedFields={selectedFields}
        onToggleField={onToggleField}
        label="תחומי עבודה *"
        showError={selectedFields.length === 0}
      />
      
      {showOtherWorkField && (
        <div>
          <Input
            id="otherWorkField"
            name="otherWorkField"
            value={otherWorkField}
            onChange={onChange}
            placeholder="נא פרט תחום עבודה אחר"
            className="bg-gray-50 border-gray-200"
          />
        </div>
      )}
    </div>
  );
};
