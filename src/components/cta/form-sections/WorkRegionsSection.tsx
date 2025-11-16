
import FieldSelector from "../FieldSelector";
import { workRegions } from "../data/workFields";
import { useTranslatedText } from "@/hooks/useTranslatedText";

interface WorkRegionsSectionProps {
  selectedRegions: string[];
  onToggleRegion: (id: string) => void;
}

export const WorkRegionsSection = ({
  selectedRegions,
  onToggleRegion
}: WorkRegionsSectionProps) => {
  const translatedLabel = useTranslatedText("באיזה אזורים אתה מעוניין לעבוד *");

  return (
    <FieldSelector
      fields={workRegions}
      selectedFields={selectedRegions}
      onToggleField={onToggleRegion}
      label={translatedLabel}
      showError={selectedRegions.length === 0}
    />
  );
};
