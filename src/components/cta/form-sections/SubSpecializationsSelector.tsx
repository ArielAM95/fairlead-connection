import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { getSpecializationsByProfession, getProfessionLabel } from '../data/professionsAndSpecializations';

interface SubSpecializationsSelectorProps {
  mainProfession: string;
  selectedSpecializations: string[];
  onToggleSpecialization: (id: string) => void;
  error?: string;
}

export const SubSpecializationsSelector = ({
  mainProfession,
  selectedSpecializations,
  onToggleSpecialization,
  error
}: SubSpecializationsSelectorProps) => {
  
  if (!mainProfession) {
    return (
      <div className="bg-muted/30 border-2 border-dashed border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground text-sm">
          ⬆️ קודם בחרו מקצוע ראשי
        </p>
      </div>
    );
  }
  
  const specializations = getSpecializationsByProfession(mainProfession);
  const professionLabel = getProfessionLabel(mainProfession);
  
  if (specializations.length === 0) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <p className="text-sm text-foreground">
          ✅ מקצוע <strong>{professionLabel}</strong> נבחר. מקצוע זה אינו מחייב תתי התמחות.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground mb-2">
        מה תתי ההתמחות שלך ב{professionLabel}? * (ניתן לבחור מספר)
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-muted/30 p-4 rounded-lg border">
        {specializations.map(spec => (
          <div 
            key={spec.id} 
            className="flex items-center space-x-2 space-x-reverse bg-background p-3 rounded-md border hover:border-primary/50 transition-all"
          >
            <Checkbox
              id={`spec-${spec.id}`}
              checked={selectedSpecializations.includes(spec.id)}
              onCheckedChange={() => onToggleSpecialization(spec.id)}
            />
            <label 
              htmlFor={`spec-${spec.id}`} 
              className="flex-1 text-sm leading-none cursor-pointer"
            >
              {spec.label}
            </label>
          </div>
        ))}
      </div>
      
      {selectedSpecializations.length > 0 && (
        <div className="text-xs text-foreground bg-primary/5 p-2 rounded flex items-center gap-2">
          <span className="font-bold">✅ נבחרו: {selectedSpecializations.length}</span>
          <span className="text-muted-foreground">
            ({selectedSpecializations.length === 1 ? 'התמחות אחת' : `${selectedSpecializations.length} התמחויות`})
          </span>
        </div>
      )}
      
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};
