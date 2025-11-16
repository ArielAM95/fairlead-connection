
import React from 'react';
import { T } from "@/components/translation/T";

interface FormErrorDisplayProps {
  error: string | null;
}

const FormErrorDisplay = ({ error }: FormErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
      <T>{error}</T>
    </div>
  );
};

export default FormErrorDisplay;
