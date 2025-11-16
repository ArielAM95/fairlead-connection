import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { ProfessionSelection, SignupFormData } from '@/types/signupForm';
import { useProfessions } from '@/hooks/useProfessions';
import { useSpecializations } from '@/hooks/useSpecializations';
import { T } from "@/components/translation/T";
import { useTranslatedText } from "@/hooks/useTranslatedText";

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
  const { data: professions = [] } = useProfessions();
  const professionPks = selectedProfessions
    .map(sp => professions.find(p => p.profession_id === sp.professionId)?.id)
    .filter(Boolean) as string[];
  
  const { data: allSpecializations = [], isLoading } = useSpecializations(professionPks);
  
  const getProfessionLabel = (professionId: string) => {
    const profession = professions.find(p => p.profession_id === professionId);
    return profession?.label || professionId;
  };
  
  const addSpecializationText = useTranslatedText("הוספת תת התמחות נוספת");

  if (selectedProfessions.length === 0) {
    return (
      <div className="bg-muted/30 border-2 border-dashed border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground text-sm">
          ⬆️ <T>קודם בחרו לפחות מקצוע אחד</T>
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          <T>תתי התמחות למקצועות שבחרתם (אופציונלי)</T>
        </label>
        <p className="text-sm text-muted-foreground"><T>טוען תתי התמחויות...</T></p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <label className="block text-sm font-medium text-foreground mb-2">
        <T>תתי התמחות למקצועות שבחרתם (אופציונלי)</T>
      </label>
      
      {selectedProfessions.map(profession => {
        const professionPk = professions.find(p => p.profession_id === profession.professionId)?.id;
        const specializations = allSpecializations.filter(spec => spec.profession_id === professionPk);
        const professionLabel = getProfessionLabel(profession.professionId);
        
        if (specializations.length === 0) {
          return (
            <div key={profession.professionId} className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <p className="text-sm text-foreground">
                ✅ <T>מקצוע</T> <strong><T>{professionLabel}</T></strong> - <T>אין תתי התמחות זמינים</T>
              </p>
            </div>
          );
        }
        
        return (
          <div key={profession.professionId} className="space-y-3 p-4 bg-muted/20 rounded-lg border">
            <h4 className="font-semibold text-foreground text-sm mb-3">
              <T>{professionLabel}</T> - <T>בחרו תתי התמחות (ניתן לבחור מספר)</T>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {specializations.map(spec => (
                <div key={spec.id}>
                  <div 
                    className="flex items-center space-x-2 space-x-reverse bg-background p-3 rounded-md border hover:border-primary/50 transition-all"
                  >
                    <Checkbox
                      id={`spec-${profession.professionId}-${spec.specialization_id}`}
                      checked={profession.specializations.includes(spec.specialization_id)}
                      onCheckedChange={() => onToggleSpecialization(profession.professionId, spec.specialization_id)}
                    />
                    <label
                      htmlFor={`spec-${profession.professionId}-${spec.specialization_id}`}
                      className="flex-1 text-sm leading-none cursor-pointer"
                    >
                      <T>{spec.label}</T>
                    </label>
                  </div>
                  {spec.specialization_id === "other" && profession.specializations.includes("other") && (
                    <div className="mt-2 space-y-2">
                      {(formData.otherSpecializations?.[profession.professionId] || ['']).map((value, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="text"
                            value={value}
                            onChange={(e) => {
                              const currentValues = formData.otherSpecializations?.[profession.professionId] || [''];
                              const newValues = [...currentValues];
                              newValues[index] = e.target.value;
                              setFormData({ 
                                ...formData, 
                                otherSpecializations: {
                                  ...formData.otherSpecializations,
                                  [profession.professionId]: newValues
                                }
                              });
                            }}
                            placeholder={`תת התמחות ${index + 1}...`}
                            className="flex-1"
                          />
                          {(formData.otherSpecializations?.[profession.professionId]?.length || 0) > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const currentValues = formData.otherSpecializations?.[profession.professionId] || [];
                                const newValues = currentValues.filter((_, i) => i !== index);
                                setFormData({ 
                                  ...formData, 
                                  otherSpecializations: {
                                    ...formData.otherSpecializations,
                                    [profession.professionId]: newValues.length > 0 ? newValues : ['']
                                  }
                                });
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentValues = formData.otherSpecializations?.[profession.professionId] || [''];
                          setFormData({
                            ...formData,
                            otherSpecializations: {
                              ...formData.otherSpecializations,
                              [profession.professionId]: [...currentValues, '']
                            }
                          });
                        }}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 ml-2" />
                        {addSpecializationText}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {profession.specializations.length > 0 && (
              <div className="text-xs text-foreground bg-primary/5 p-2 rounded flex items-center gap-2 mt-2">
                <span className="font-bold">✅ <T>נבחרו</T>: {profession.specializations.length}</span>
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
