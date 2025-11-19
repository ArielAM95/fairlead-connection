import { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { useProfessions } from '@/hooks/useProfessions';
import { cn } from '@/lib/utils';

interface ProfessionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ProfessionSelector = ({ value, onChange }: ProfessionSelectorProps) => {
  const { data: professions, isLoading } = useProfessions();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get selected profession label
  const selectedProfession = professions?.find(p => p.profession_id === value);
  const displayValue = selectedProfession?.label || '';

  // Filter professions with commission_category
  const filteredProfessions = useMemo(() => {
    if (!professions) return [];
    
    const commissionsEnabled = professions.filter(p => p.commission_category);
    
    if (!searchTerm) return commissionsEnabled;
    
    return commissionsEnabled.filter(profession =>
      profession.label.includes(searchTerm)
    ).sort((a, b) => 
      a.label.localeCompare(b.label, 'he')
    );
  }, [professions, searchTerm]);

  // Update search term when opening/closing
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const handleSelect = (professionId: string) => {
    onChange(professionId);
    setIsOpen(false);
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="h-14 flex items-center justify-center border-2 border-primary/20 rounded-md bg-background">
        <span className="text-muted-foreground">טוען מקצועות...</span>
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full h-14 px-4 text-lg border-2 border-primary/20 hover:border-primary/40 transition-colors rounded-md bg-background text-right flex items-center justify-between"
        >
          <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
          <span className={cn("flex-1 text-right", !displayValue && "text-muted-foreground")}>
            {displayValue || "חפש ובחר מקצוע..."}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0 bg-card border-2 border-primary/20" 
        side="bottom" 
        align="start"
        sideOffset={5}
      >
        <div className="p-3 border-b border-border bg-card">
          <Input
            ref={inputRef}
            type="text"
            placeholder="הקלד לחיפוש מקצוע..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-right border-primary/20"
          />
        </div>

        <ScrollArea className="h-[300px] md:h-[350px]">
          <div className="p-2">
            {filteredProfessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                לא נמצאו מקצועות
              </div>
            ) : (
              filteredProfessions.map(profession => (
                <button
                  key={profession.profession_id}
                  type="button"
                  onClick={() => handleSelect(profession.profession_id)}
                  className={cn(
                    "w-full text-right py-3 px-4 hover:bg-accent/10 rounded-md my-1 flex items-center justify-between transition-colors",
                    value === profession.profession_id && "bg-accent/20"
                  )}
                >
                  <Check 
                    className={cn(
                      "h-4 w-4",
                      value === profession.profession_id ? "opacity-100 text-primary" : "opacity-0"
                    )} 
                  />
                  <span className="flex-1 text-right">{profession.label}</span>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default ProfessionSelector;
