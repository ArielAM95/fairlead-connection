import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";
import { workFields } from "./data/workFields";

interface DynamicWorkFieldsSelectorProps {
  selectedFields: string[];
  onToggleField: (id: string) => void;
  showOtherWorkField: boolean;
  otherWorkField: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DynamicWorkFieldsSelector = ({
  selectedFields,
  onToggleField,
  showOtherWorkField,
  otherWorkField,
  onChange
}: DynamicWorkFieldsSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showOtherOption, setShowOtherOption] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter fields based on search term
  const filteredFields = workFields.filter(field =>
    field.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show "other" option if search term doesn't match any existing fields
  useEffect(() => {
    if (searchTerm.trim() && filteredFields.length === 0) {
      setShowOtherOption(true);
    } else {
      setShowOtherOption(false);
    }
  }, [searchTerm, filteredFields.length]);

  // Get labels for selected fields
  const getSelectedFieldsLabels = () => {
    return selectedFields.map(fieldId => {
      if (fieldId === "other") {
        return otherWorkField || "אחר";
      }
      const field = workFields.find(f => f.id === fieldId);
      return field ? field.label : fieldId;
    });
  };

  // Handle field selection
  const handleFieldSelect = (fieldId: string) => {
    onToggleField(fieldId);
    setSearchTerm("");
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  // Handle "other" option
  const handleOtherSelect = () => {
    onToggleField("other");
    setSearchTerm("");
    setIsDropdownOpen(false);
    setShowOtherOption(false);
  };

  // Handle removing selected field
  const handleRemoveField = (fieldId: string) => {
    onToggleField(fieldId);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        תחומי עבודה *
      </label>
      
      {/* Selected fields display */}
      {selectedFields.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {getSelectedFieldsLabels().map((label, index) => (
            <div
              key={`${selectedFields[index]}-${index}`}
              className="flex items-center gap-1 bg-ofair-100 text-ofair-800 px-3 py-1 rounded-full text-sm"
            >
              <span>{label}</span>
              <button
                type="button"
                onClick={() => handleRemoveField(selectedFields[index])}
                className="text-ofair-600 hover:text-ofair-800"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="חפש תחום עבודה..."
            className="bg-gray-50 border-gray-200 pr-10"
          />
        </div>

        {/* Dropdown with search results */}
        {isDropdownOpen && (searchTerm || filteredFields.length > 0) && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredFields.length > 0 ? (
              filteredFields.map(field => (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => handleFieldSelect(field.id)}
                  disabled={selectedFields.includes(field.id)}
                  className={`w-full text-right px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedFields.includes(field.id) ? 'bg-gray-100' : ''
                  }`}
                >
                  {field.label}
                  {selectedFields.includes(field.id) && (
                    <span className="mr-2 text-green-600">✓</span>
                  )}
                </button>
              ))
            ) : showOtherOption ? (
              <button
                type="button"
                onClick={handleOtherSelect}
                className="w-full text-right px-3 py-2 text-sm hover:bg-gray-50 text-ofair-600"
              >
                אחר: "{searchTerm}"
              </button>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-right">
                לא נמצאו תוצאות
              </div>
            )}
          </div>
        )}
      </div>

      {/* Other work field input */}
      {showOtherWorkField && (
        <div>
          <Input
            id="otherWorkField"
            name="otherWorkField"
            value={otherWorkField}
            onChange={onChange}
            placeholder="נא פרט תחום עבודה אחר"
            className="bg-gray-50 border-gray-200"
          />
        </div>
      )}

      {/* Error message */}
      {selectedFields.length === 0 && (
        <p className="text-xs text-red-500 mt-1">יש לבחור לפחות אחד</p>
      )}
    </div>
  );
};
