import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { workRegionsHierarchy, MainRegion } from "./data/workRegionsHierarchy";

interface HierarchicalRegionSelectorProps {
  selectedRegions: string[];
  onToggleRegion: (subAreaId: string) => void;
  onToggleMainRegion: (mainRegionId: string) => void;
  showError?: boolean;
}

export const HierarchicalRegionSelector = ({
  selectedRegions,
  onToggleRegion,
  onToggleMainRegion,
  showError
}: HierarchicalRegionSelectorProps) => {
  
  const isAllSubAreasSelected = (region: MainRegion) => {
    const subAreaIds = region.subAreas.map(sa => sa.id);
    return subAreaIds.every(id => selectedRegions.includes(id));
  };

  const isSomeSubAreasSelected = (region: MainRegion) => {
    const subAreaIds = region.subAreas.map(sa => sa.id);
    const selectedCount = subAreaIds.filter(id => selectedRegions.includes(id)).length;
    return selectedCount > 0 && selectedCount < subAreaIds.length;
  };

  const getCheckboxState = (region: MainRegion): boolean | "indeterminate" => {
    if (isAllSubAreasSelected(region)) return true;
    if (isSomeSubAreasSelected(region)) return "indeterminate";
    return false;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-right mb-2">
        באיזה אזורים אתה מעוניין לעבוד *
      </label>
      
      {showError && selectedRegions.length === 0 && (
        <div className="text-red-500 text-sm text-right mb-2">
          יש לבחור לפחות אזור אחד
        </div>
      )}

      <Accordion type="multiple" className="w-full space-y-2">
        {workRegionsHierarchy.map((region) => (
          <AccordionItem
            key={region.id}
            value={region.id}
            className="border rounded-lg px-4 bg-background"
          >
            <AccordionTrigger className="hover:no-underline py-3">
              <div 
                className="flex items-center gap-3 w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={getCheckboxState(region)}
                  onCheckedChange={() => onToggleMainRegion(region.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="font-semibold text-base">
                  {region.icon} {region.label}
                </span>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-3 pr-8">
                {region.subAreas.map((subArea) => (
                  <div key={subArea.id} className="flex items-start gap-3">
                    <Checkbox
                      id={`${region.id}-${subArea.id}`}
                      checked={selectedRegions.includes(subArea.id)}
                      onCheckedChange={() => onToggleRegion(subArea.id)}
                    />
                    <label
                      htmlFor={`${region.id}-${subArea.id}`}
                      className="flex flex-col gap-0.5 cursor-pointer flex-1 text-right"
                    >
                      <span className="font-medium text-sm">
                        {subArea.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({subArea.examples})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
