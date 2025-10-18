import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, X } from 'lucide-react';
import { professionsWithSpecializations, getProfessionLabel } from '../data/professionsAndSpecializations';

interface MainProfessionSelectorProps {
  selectedProfession: string;
  onProfessionChange: (professionId: string) => void;
  error?: string;
}

export const MainProfessionSelector = ({
  selectedProfession,
  onProfessionChange,
  error
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
    onProfessionChange(professionId);
    setSearchTerm("");
    setIsOpen(false);
  };
  
  const handleRemoveProfession = () => {
    onProfessionChange("");
  };
  
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground mb-2">
        מה המקצוע הראשי שלך? *
      </label>
      
      {selectedProfession && (
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 p-3 rounded-lg">
          <span className="flex-1 text-sm font-medium text-foreground">
            ✅ {getProfessionLabel(selectedProfession)}
          </span>
          <button
            type="button"
            onClick={handleRemoveProfession}
            className="text-muted-foreground hover:text-destructive transition-colors"
            aria-label="הסר מקצוע"
          >
            <X size={18} />
          </button>
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
            placeholder={selectedProfession ? "שנה מקצוע..." : "חפש מקצוע..."}
            className="pr-10"
          />
        </div>
        
        {isOpen && searchTerm && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredProfessions.length > 0 ? (
              filteredProfessions.map(profession => (
                <div
                  key={profession.id}
                  onClick={() => handleSelectProfession(profession.id)}
                  className="p-3 hover:bg-muted cursor-pointer transition-colors text-sm border-b border-border last:border-b-0"
                >
                  {profession.label}
                </div>
              ))
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
