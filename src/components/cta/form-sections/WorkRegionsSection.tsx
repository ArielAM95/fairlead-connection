
import FieldSelector from "../FieldSelector";
import { workRegions } from "../data/workFields";

interface WorkRegionsSectionProps {
  selectedRegions: string[];
  onToggleRegion: (id: string) => void;
}

export const WorkRegionsSection = ({
  selectedRegions,
  onToggleRegion
}: WorkRegionsSectionProps) => {
  return (
    <FieldSelector
      fields={workRegions}
      selectedFields={selectedRegions}
      onToggleField={onToggleRegion}
      label="באיזה אזורים אתה מעוניין לעבוד *"
      showError={selectedRegions.length === 0}
    />
  );
};
