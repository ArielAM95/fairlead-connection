
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
  selectedRegions: string[];
  onToggleRegion: (id: string) => void;
  experience: string;
  onExperienceChange: (value: string) => void;
  experienceError?: string;
  formData: any;
  setFormData: (data: any) => void;
}

export const OccupationDetailsSection = ({
  selectedProfessions,
  onProfessionToggle,
  onSubSpecializationToggle,
  professionsError,
  selectedRegions,
  onToggleRegion,
  experience,
  onExperienceChange,
  experienceError,
  formData,
  setFormData
}: OccupationDetailsSectionProps) => {
  return (
    <div className="space-y-6">
      <MainProfessionSelector
        selectedProfessions={selectedProfessions}
        onProfessionToggle={onProfessionToggle}
        error={professionsError}
        formData={formData}
        setFormData={setFormData}
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
      />
      
      <ExperienceSection
        value={experience}
        onChange={onExperienceChange}
        error={experienceError}
      />
    </div>
  );
};
