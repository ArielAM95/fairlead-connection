
import { DynamicWorkFieldsSelector } from "../DynamicWorkFieldsSelector";

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
  return (
    <DynamicWorkFieldsSelector
      selectedFields={selectedFields}
      onToggleField={onToggleField}
      showOtherWorkField={showOtherWorkField}
      otherWorkField={otherWorkField}
      onChange={onChange}
    />
  );
};
