import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, X } from 'lucide-react';
import { ProfessionSelection, SignupFormData } from '@/types/signupForm';
import { useProfessions } from '@/hooks/useProfessions';

interface MainProfessionSelectorProps {
  selectedProfessions: ProfessionSelection[];
  onProfessionToggle: (professionId: string) => void;
  error?: string;
  formData: SignupFormData;
  onOtherProfessionChange: (value: string) => void;
  otherProfessionError?: string;
}

const MAX_PROFESSIONS = 2;

export const MainProfessionSelector = ({
  selectedProfessions,
  onProfessionToggle,
  error,
  formData,
  onOtherProfessionChange,
  otherProfessionError
}: MainProfessionSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const { data: professions = [], isLoading } = useProfessions();
  
  const canAddMore = selectedProfessions.length < MAX_PROFESSIONS;
  
  const filteredProfessions = professions.filter(p =>
    p.label.includes(searchTerm)
  );
  
  const getProfessionLabel = (professionId: string) => {
    const profession = professions.find(p => p.profession_id === professionId);
    return profession?.label || professionId;
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelectProfession = (professionPk: string) => {
    const profession = professions.find(p => p.id === professionPk);
    if (!profession) return;
    
    const isSelected = selectedProfessions.some(p => p.professionId === profession.profession_id);
    
    // Block adding if already at max and not removing
    if (!isSelected && !canAddMore) return;
    
    onProfessionToggle(profession.profession_id);
    setSearchTerm("");
    setIsOpen(false);
  };
  
  const handleRemoveProfession = (professionId: string) => {
    onProfessionToggle(professionId);
  };
  
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground mb-2">
        מה המקצועות שלך? * (ניתן לבחור עד 2)
      </label>
      
      {selectedProfessions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedProfessions.map(prof => (
            <div key={prof.professionId}>
              <div 
                className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-3 py-2 rounded-lg"
              >
                <span className="text-sm font-medium text-foreground">
                  ✅ {prof.professionId === "other-profession" ? formData.otherProfession || "אחר" : getProfessionLabel(prof.professionId)}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveProfession(prof.professionId)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="הסר מקצוע"
                >
                  <X size={16} />
                </button>
              </div>
              {prof.professionId === "other-profession" && (
                <div className="mt-2">
                  <Input
                    type="text"
                    value={formData.otherProfession || ""}
                    onChange={(e) => onOtherProfessionChange(e.target.value)}
                    placeholder="פרט את המקצוע שלך... *"
                    className={otherProfessionError ? "border-destructive" : ""}
                  />
                  {otherProfessionError && (
                    <p className="text-xs text-destructive mt-1">{otherProfessionError}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {!canAddMore && (
        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
          ✅ בחרת {MAX_PROFESSIONS} מקצועות - זה המקסימום
        </div>
      )}
      
      <div className="relative" ref={wrapperRef}>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={canAddMore ? "חפש מקצוע להוספה..." : "הגעת למקסימום מקצועות"}
            className="pr-10"
            disabled={!canAddMore}
          />
        </div>
        
        {isOpen && searchTerm && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
            {isLoading ? (
              <div className="p-3 text-center text-muted-foreground text-sm">
                טוען מקצועות...
              </div>
            ) : filteredProfessions.length > 0 ? (
              filteredProfessions.map(profession => {
                const isSelected = selectedProfessions.some(p => p.professionId === profession.profession_id);
                return (
                  <div
                    key={profession.id}
                    onClick={() => handleSelectProfession(profession.id)}
                    className={`p-3 hover:bg-muted cursor-pointer transition-colors text-sm border-b border-border last:border-b-0 ${
                      isSelected ? 'bg-primary/5 font-medium' : ''
                    }`}
                  >
                    {isSelected && '✅ '}{profession.label}
                  </div>
                );
              })
            ) : (
              <div 
                onClick={() => {
                  const otherProf = professions.find(p => p.profession_id === "other-profession");
                  if (otherProf) handleSelectProfession(otherProf.id);
                }}
                className="p-3 hover:bg-muted cursor-pointer transition-colors text-sm text-center"
              >
                <span className="text-foreground font-medium">🔍 לא מצאתי את המקצוע שלי - הוסף אחר</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};
