import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from 'lucide-react';
import { professionsWithSpecializations } from '../data/professionsAndSpecializations';

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
  
  const filteredProfessions = professionsWithSpecializations.filter(p =>
    p.label.includes(searchTerm) || 
    p.number.includes(searchTerm)
  );
  
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground mb-2">
        מה המקצוע הראשי שלך? *
      </label>
      
      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="חפש מקצוע..."
          className="pr-10"
        />
      </div>
      
      <ScrollArea className="h-96 rounded-lg border bg-muted/30 p-4">
        <RadioGroup 
          value={selectedProfession} 
          onValueChange={onProfessionChange}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
        >
          {filteredProfessions.map(profession => (
            <div 
              key={profession.id}
              className={`
                relative flex items-center space-x-2 space-x-reverse
                rounded-md border-2 p-3 cursor-pointer transition-all
                ${selectedProfession === profession.id 
                  ? 'border-primary bg-background shadow-sm' 
                  : 'border-border bg-background hover:border-primary/50'
                }
              `}
            >
              <RadioGroupItem 
                value={profession.id} 
                id={`profession-${profession.id}`}
              />
              <Label 
                htmlFor={`profession-${profession.id}`}
                className="flex-1 cursor-pointer text-sm font-medium flex items-center gap-2"
              >
                <span className="text-muted-foreground text-xs">{profession.number}.</span>
                {profession.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {filteredProfessions.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            לא נמצאו תוצאות עבור "{searchTerm}"
          </p>
        )}
      </ScrollArea>
      
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};
