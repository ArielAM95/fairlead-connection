
import { WorkFieldsSection } from './WorkFieldsSection';
import { WorkRegionsSection } from './WorkRegionsSection';
import { ExperienceSection } from './ExperienceSection';

interface OccupationDetailsSectionProps {
  selectedFields: string[];
  onToggleField: (id: string) => void;
  showOtherWorkField: boolean;
  otherWorkField: string;
  selectedRegions: string[];
  onToggleRegion: (id: string) => void;
  experience: string;
  onExperienceChange: (value: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  experienceError?: string;
}

export const OccupationDetailsSection = ({
  selectedFields,
  onToggleField,
  showOtherWorkField,
  otherWorkField,
  selectedRegions,
  onToggleRegion,
  experience,
  onExperienceChange,
  onChange,
  experienceError
}: OccupationDetailsSectionProps) => {
  return (
    <>
      <WorkFieldsSection
        selectedFields={selectedFields}
        onToggleField={onToggleField}
        showOtherWorkField={showOtherWorkField}
        otherWorkField={otherWorkField}
        onChange={onChange}
      />
      
      <WorkRegionsSection
        selectedRegions={selectedRegions}
        onToggleRegion={onToggleRegion}
      />
      
      <ExperienceSection
        value={experience}
        onChange={onExperienceChange}
        error={experienceError}
      />
    </>
  );
};
