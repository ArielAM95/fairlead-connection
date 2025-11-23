
import { MainProfessionSelector } from './MainProfessionSelector';
import { SubSpecializationsSelector } from './SubSpecializationsSelector';
import { WorkRegionsSection } from './WorkRegionsSection';
import { ExperienceSection } from './ExperienceSection';
import { ProfessionSelection } from '@/types/signupForm';

interface OccupationDetailsSectionProps {
  selectedProfessions: ProfessionSelection[];
  onProfessionToggle: (professionId: string) => void;
  onSubSpecializationToggle: (professionId: string, specId: string) => void;
  professionsError?: string;
  otherProfessionError?: string;
  selectedRegions: string[];
  onToggleRegion: (id: string) => void;
  onToggleMainRegion: (mainRegionId: string) => void;
  experience: string;
  onExperienceChange: (value: string) => void;
  experienceError?: string;
  formData: any;
  onOtherProfessionChange: (value: string) => void;
  setFormData: (data: any) => void;
}

export const OccupationDetailsSection = ({
  selectedProfessions,
  onProfessionToggle,
  onSubSpecializationToggle,
  professionsError,
  otherProfessionError,
  selectedRegions,
  onToggleRegion,
  onToggleMainRegion,
  experience,
  onExperienceChange,
  experienceError,
  formData,
  onOtherProfessionChange,
  setFormData
}: OccupationDetailsSectionProps) => {
  return (
    <div className="space-y-6">
      <MainProfessionSelector
        selectedProfessions={selectedProfessions}
        onProfessionToggle={onProfessionToggle}
        error={professionsError}
        otherProfessionError={otherProfessionError}
        formData={formData}
        onOtherProfessionChange={onOtherProfessionChange}
      />
      
      <SubSpecializationsSelector
        selectedProfessions={selectedProfessions}
        onToggleSpecialization={onSubSpecializationToggle}
        error={professionsError}
        formData={formData}
        setFormData={setFormData}
      />
      
      <WorkRegionsSection
        selectedRegions={selectedRegions}
        onToggleRegion={onToggleRegion}
        onToggleMainRegion={onToggleMainRegion}
      />
      
      <ExperienceSection
        value={experience}
        onChange={onExperienceChange}
        error={experienceError}
      />
    </div>
  );
};
