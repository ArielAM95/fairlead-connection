
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface FieldSelectorProps {
  fields: { id: string; label: string }[];
  selectedFields: string[];
  onToggleField: (id: string) => void;
  label: string;
  showError: boolean;
}

const FieldSelector = ({ fields, selectedFields, onToggleField, label, showError }: FieldSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-md border border-gray-200">
        {fields.map(field => (
          <div key={field.id} className="flex items-center space-x-2 space-x-reverse">
            <Checkbox 
              id={`field-${field.id}`} 
              checked={selectedFields.includes(field.id)} 
              onCheckedChange={() => onToggleField(field.id)} 
            />
            <label htmlFor={`field-${field.id}`} className="text-sm leading-none cursor-pointer">
              {field.label}
            </label>
          </div>
        ))}
      </div>
      {showError && (
        <p className="text-xs text-red-500 mt-1">יש לבחור לפחות אחד</p>
      )}
    </div>
  );
};

export default FieldSelector;
