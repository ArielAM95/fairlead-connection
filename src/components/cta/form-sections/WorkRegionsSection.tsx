import { HierarchicalRegionSelector } from "../HierarchicalRegionSelector";

interface WorkRegionsSectionProps {
  selectedRegions: string[];
  onToggleRegion: (id: string) => void;
  onToggleMainRegion: (mainRegionId: string) => void;
}

export const WorkRegionsSection = ({
  selectedRegions,
  onToggleRegion,
  onToggleMainRegion
}: WorkRegionsSectionProps) => {
  return (
    <HierarchicalRegionSelector
      selectedRegions={selectedRegions}
      onToggleRegion={onToggleRegion}
      onToggleMainRegion={onToggleMainRegion}
      showError={selectedRegions.length === 0}
    />
  );
};
