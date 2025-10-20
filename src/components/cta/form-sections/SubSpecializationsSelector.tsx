import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { getSpecializationsByProfession, getProfessionLabel } from '../data/professionsAndSpecializations';
import { ProfessionSelection, SignupFormData } from '@/types/signupForm';

interface SubSpecializationsSelectorProps {
  selectedProfessions: ProfessionSelection[];
  onToggleSpecialization: (professionId: string, specId: string) => void;
  error?: string;
  formData: SignupFormData;
  setFormData: (data: SignupFormData) => void;
}

export const SubSpecializationsSelector = ({
  selectedProfessions,
  onToggleSpecialization,
  error,
  formData,
  setFormData
}: SubSpecializationsSelectorProps) => {
  
  if (selectedProfessions.length === 0) {
    return (
      <div className="bg-muted/30 border-2 border-dashed border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground text-sm">
          ⬆️ קודם בחרו לפחות מקצוע אחד
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <label className="block text-sm font-medium text-foreground mb-2">
        תתי התמחות למקצועות שבחרתם (אופציונלי)
      </label>
      
      {selectedProfessions.map(profession => {
        const specializations = getSpecializationsByProfession(profession.professionId);
        const professionLabel = getProfessionLabel(profession.professionId);
        
        if (specializations.length === 0) {
          return (
            <div key={profession.professionId} className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <p className="text-sm text-foreground">
                ✅ מקצוע <strong>{professionLabel}</strong> - אין תתי התמחות זמינים
              </p>
            </div>
          );
        }
        
        return (
          <div key={profession.professionId} className="space-y-3 p-4 bg-muted/20 rounded-lg border">
            <h4 className="font-semibold text-foreground text-sm mb-3">
              {professionLabel} - בחרו תתי התמחות (ניתן לבחור מספר)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {specializations.map(spec => (
                <div key={spec.id}>
                  <div 
                    className="flex items-center space-x-2 space-x-reverse bg-background p-3 rounded-md border hover:border-primary/50 transition-all"
                  >
                    <Checkbox
                      id={`spec-${profession.professionId}-${spec.id}`}
                      checked={profession.specializations.includes(spec.id)}
                      onCheckedChange={() => onToggleSpecialization(profession.professionId, spec.id)}
                    />
                    <label 
                      htmlFor={`spec-${profession.professionId}-${spec.id}`} 
                      className="flex-1 text-sm leading-none cursor-pointer"
                    >
                      {spec.label}
                    </label>
                  </div>
                  {spec.id === "other" && profession.specializations.includes("other") && (
                    <Input
                      type="text"
                      value={formData.otherSpecializations?.[profession.professionId] || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        otherSpecializations: {
                          ...formData.otherSpecializations,
                          [profession.professionId]: e.target.value
                        }
                      })}
                      placeholder="פרט את התת התמחות..."
                      className="mt-2"
                    />
                  )}
                </div>
              ))}
            </div>
            
            {profession.specializations.length > 0 && (
              <div className="text-xs text-foreground bg-primary/5 p-2 rounded flex items-center gap-2 mt-2">
                <span className="font-bold">✅ נבחרו: {profession.specializations.length}</span>
              </div>
            )}
          </div>
        );
      })}
      
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};
