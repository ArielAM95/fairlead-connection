
import { useState } from "react";
import { SignupFormData, SignupFormErrors, SignupFormHandlers } from "@/types/signupForm";
import { useFormState } from "./form/useFormState";
import { useFormValidation } from "./form/useFormValidation";
import { useFieldHandlers } from "./form/useFieldHandlers";

export const useSignupForm = (onSubmit: (formData: SignupFormData) => Promise<void>) => {
  const { 
    formData, 
    errors, 
    isSubmitting, 
    setFormData,
    setErrors,
    setIsSubmitting,
    handleChange,
    resetForm
  } = useFormState();

  const { validateForm } = useFormValidation();
  
  const { 
    handleWorkFieldToggle,
    handleWorkRegionToggle,
    handleExperienceChange,
    handleProfessionToggle,
    handleSubSpecializationToggle,
    handleOtherProfessionChange
  } = useFieldHandlers(formData, setFormData, setErrors);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors: validationErrors } = validateForm(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      resetForm();
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleWorkFieldToggle,
    handleWorkRegionToggle,
    handleExperienceChange,
    handleProfessionToggle,
    handleSubSpecializationToggle,
    handleOtherProfessionChange,
    handleSubmit,
    setFormData
  };
};
