import { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { useCities } from '@/hooks/useCities';
import { cn } from '@/lib/utils';

interface CitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const CitySelector = ({ value, onChange, required }: CitySelectorProps) => {
  const { data: cities, isLoading } = useCities();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter cities by settlement_name only
  const filteredCities = useMemo(() => {
    if (!cities) return [];
    
    if (!searchTerm.trim()) return cities.slice(0, 50);
    
    // Normalize search: remove extra spaces for flexible matching
    const normalizedSearch = searchTerm.trim().replace(/\s+/g, ' ');
    
    return cities
      .filter(city => {
        const normalizedCity = city.settlement_name.replace(/\s+/g, ' ');
        return normalizedCity.includes(normalizedSearch);
      })
      .slice(0, 50);
  }, [cities, searchTerm]);

  // Update search term when opening/closing
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const handleSelect = (cityName: string) => {
    onChange(cityName);
    setIsOpen(false);
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="h-10 flex items-center justify-center border border-input rounded-md bg-background">
        <span className="text-sm text-muted-foreground">טוען ערים...</span>
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="חפש ובחר עיר..."
            value={isOpen ? searchTerm : value}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="text-right bg-gray-50 border-gray-200 pr-10"
            required={required}
          />
          <ChevronDown 
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-transform pointer-events-none",
              isOpen && "rotate-180"
            )} 
          />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        side="bottom" 
        align="start"
        sideOffset={5}
        avoidCollisions={false}
      >
        <ScrollArea className="h-[280px]">
          <div className="p-2">
            {filteredCities.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                לא נמצאו ערים
              </div>
            ) : (
              filteredCities.map(city => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleSelect(city.settlement_name)}
                  className={cn(
                    "w-full text-right py-2.5 px-3 hover:bg-accent rounded-md my-0.5 flex items-center justify-between transition-colors text-sm",
                    value === city.settlement_name && "bg-accent"
                  )}
                >
                  <Check 
                    className={cn(
                      "h-4 w-4",
                      value === city.settlement_name ? "opacity-100" : "opacity-0"
                    )} 
                  />
                  <span className="flex-1 text-right">{city.settlement_name}</span>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default CitySelector;
