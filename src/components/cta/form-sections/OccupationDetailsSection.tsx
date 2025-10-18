
import { MainProfessionSelector } from './MainProfessionSelector';
import { SubSpecializationsSelector } from './SubSpecializationsSelector';
import { WorkRegionsSection } from './WorkRegionsSection';
import { ExperienceSection } from './ExperienceSection';

interface OccupationDetailsSectionProps {
  mainProfession: string;
  onMainProfessionChange: (id: string) => void;
  subSpecializations: string[];
  onSubSpecializationToggle: (id: string) => void;
  mainProfessionError?: string;
  subSpecializationsError?: string;
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
  mainProfession,
  onMainProfessionChange,
  subSpecializations,
  onSubSpecializationToggle,
  mainProfessionError,
  subSpecializationsError,
  selectedRegions,
  onToggleRegion,
  experience,
  onExperienceChange,
  experienceError
}: OccupationDetailsSectionProps) => {
  return (
    <div className="space-y-6">
      <MainProfessionSelector
        selectedProfession={mainProfession}
        onProfessionChange={onMainProfessionChange}
        error={mainProfessionError}
      />
      
      <SubSpecializationsSelector
        mainProfession={mainProfession}
        selectedSpecializations={subSpecializations}
        onToggleSpecialization={onSubSpecializationToggle}
        error={subSpecializationsError}
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
    </div>
  );
};
