import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { useProfessions } from '@/hooks/useProfessions';

interface ProfessionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ProfessionSelector = ({ value, onChange }: ProfessionSelectorProps) => {
  const { data: professions, isLoading } = useProfessions();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter and sort professions
  const filteredProfessions = useMemo(() => {
    if (!professions) return [];
    
    // Filter only professions with commission_category defined
    const commissionsEnabled = professions.filter(p => p.commission_category);
    
    if (!searchTerm) return commissionsEnabled;
    
    return commissionsEnabled.filter(profession =>
      profession.label.includes(searchTerm)
    ).sort((a, b) => 
      a.label.localeCompare(b.label, 'he')
    );
  }, [professions, searchTerm]);

  if (isLoading) {
    return (
      <div className="h-14 flex items-center justify-center border-2 border-primary/20 rounded-md">
        <span className="text-muted-foreground">טוען מקצועות...</span>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onChange} open={isOpen} onOpenChange={setIsOpen}>
      <SelectTrigger className="w-full h-14 text-lg border-2 border-primary/20 hover:border-primary/40 transition-colors">
        <SelectValue placeholder="בחר מקצוע..." />
      </SelectTrigger>
      <SelectContent className="max-h-[450px] bg-card z-50">
        {/* Search Input */}
        <div className="p-3 border-b border-border bg-card sticky top-0 z-10">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="חפש מקצוע..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="pr-10 bg-background text-right"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
        </div>

        <ScrollArea className="h-[350px]">
          <div className="p-2">
            {filteredProfessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                לא נמצאו מקצועות
              </div>
            ) : (
              filteredProfessions.map(profession => (
                <SelectItem 
                  key={profession.profession_id} 
                  value={profession.profession_id}
                  className="text-right py-3 px-4 hover:bg-accent/10 cursor-pointer rounded-md my-1 flex justify-end"
                >
                  {profession.label}
                </SelectItem>
              ))
            )}
          </div>
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

export default ProfessionSelector;
