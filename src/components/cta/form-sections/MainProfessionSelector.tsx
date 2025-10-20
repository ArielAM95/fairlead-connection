import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, X } from 'lucide-react';
import { professionsWithSpecializations, getProfessionLabel } from '../data/professionsAndSpecializations';
import { ProfessionSelection, SignupFormData } from '@/types/signupForm';

interface MainProfessionSelectorProps {
  selectedProfessions: ProfessionSelection[];
  onProfessionToggle: (professionId: string) => void;
  error?: string;
  formData: SignupFormData;
  setFormData: (data: SignupFormData) => void;
}

export const MainProfessionSelector = ({
  selectedProfessions,
  onProfessionToggle,
  error,
  formData,
  setFormData
}: MainProfessionSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const filteredProfessions = professionsWithSpecializations.filter(p =>
    p.label.includes(searchTerm)
  );
  
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
  
  const handleSelectProfession = (professionId: string) => {
    onProfessionToggle(professionId);
    setSearchTerm("");
    setIsOpen(false);
  };
  
  const handleRemoveProfession = (professionId: string) => {
    onProfessionToggle(professionId);
  };
  
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground mb-2">
        מה המקצועות שלך? * (ניתן לבחור מספר)
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
                <Input
                  type="text"
                  value={formData.otherProfession || ""}
                  onChange={(e) => setFormData({ ...formData, otherProfession: e.target.value })}
                  placeholder="פרט את המקצוע שלך..."
                  className="mt-2"
                />
              )}
            </div>
          ))}
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
            placeholder="חפש מקצוע להוספה..."
            className="pr-10"
          />
        </div>
        
        {isOpen && searchTerm && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredProfessions.length > 0 ? (
              filteredProfessions.map(profession => {
                const isSelected = selectedProfessions.some(p => p.professionId === profession.id);
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
              <div className="p-4 text-center text-sm text-muted-foreground">
                לא נמצאו תוצאות עבור "{searchTerm}"
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
