
import React from 'react';
import { Button } from "@/components/ui/button";
import { T } from "@/components/translation/T";

interface SubmitButtonProps {
  isSubmitting: boolean;
  isDisabled: boolean;
  submitText?: string;
  loadingText?: string;
}

const SubmitButton = ({
  isSubmitting,
  isDisabled,
  submitText = "הירשמו כעת",
  loadingText = "מבצע רישום..."
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full bg-ofair-900 hover:bg-ofair-800 text-white py-6"
      disabled={isSubmitting || isDisabled}
    >
      {isSubmitting ? <T>{loadingText}</T> : <T>{submitText}</T>}
    </Button>
  );
};

export default SubmitButton;
