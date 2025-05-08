
import React from 'react';

interface FormErrorDisplayProps {
  error: string | null;
}

const FormErrorDisplay = ({ error }: FormErrorDisplayProps) => {
  if (!error) return null;
  
  return (
    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
      {error}
    </div>
  );
};

export default FormErrorDisplay;
