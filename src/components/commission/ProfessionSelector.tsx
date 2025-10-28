import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { commissionsData } from '@/data/commissionData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Briefcase, TrendingUp, BarChart, Zap } from 'lucide-react';

interface ProfessionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const categoryIcons = {
  A: Briefcase,
  B: TrendingUp,
  C: BarChart,
  D: Zap
};

const categoryLabels = {
  A: 'קטגוריה A - עמלה קבועה 10%',
  B: 'קטגוריה B - עמלה מדורגת (5-10%)',
  C: 'קטגוריה C - עמלה מדורגת (5-10%)',
  D: 'קטגוריה D - עמלות ייחודיות'
};

const ProfessionSelector = ({ value, onChange }: ProfessionSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Group professions by category
  const professionsByCategory = commissionsData.reduce((acc, profession) => {
    if (!acc[profession.category]) {
      acc[profession.category] = [];
    }
    acc[profession.category].push(profession);
    return acc;
  }, {} as Record<string, typeof commissionsData>);

  // Sort professions within each category
  Object.keys(professionsByCategory).forEach(category => {
    professionsByCategory[category].sort((a, b) => 
      a.professionLabel.localeCompare(b.professionLabel, 'he')
    );
  });

  const filteredProfessions = commissionsData.filter(p =>
    p.professionLabel.includes(searchTerm)
  );

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-14 text-lg border-2 border-primary/20 hover:border-primary/40 transition-colors">
        <SelectValue placeholder="בחר מקצוע..." />
      </SelectTrigger>
      <SelectContent className="max-h-[400px]">
        <ScrollArea className="h-[350px]">
          {(['A', 'B', 'C', 'D'] as const).map(category => {
            const Icon = categoryIcons[category];
            const professions = professionsByCategory[category] || [];
            
            if (professions.length === 0) return null;
            
            return (
              <SelectGroup key={category}>
                <SelectLabel className="flex items-center gap-2 text-base font-bold py-3 px-2 bg-primary/5">
                  <Icon className="w-5 h-5 text-primary" />
                  {categoryLabels[category]}
                </SelectLabel>
                {professions.map(profession => (
                  <SelectItem 
                    key={profession.professionId} 
                    value={profession.professionId}
                    className="text-right py-3 px-4 hover:bg-accent/10 cursor-pointer"
                  >
                    {profession.professionLabel}
                  </SelectItem>
                ))}
              </SelectGroup>
            );
          })}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

export default ProfessionSelector;
