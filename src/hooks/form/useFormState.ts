
import { useState } from "react";
import { SignupFormData, SignupFormErrors } from "@/types/signupForm";

export const useFormState = () => {
  const initialData: SignupFormData = {
    firstName: "",
    lastName: "",
    companyName: "",
    workFields: [],
    otherWorkField: "",
    showOtherWorkField: false,
    experience: "",
    email: "",
    phone: "",
    city: "",
    workRegions: [],
    acceptMarketing: false
  };

  const [formData, setFormData] = useState<SignupFormData>(initialData);
  const [errors, setErrors] = useState<SignupFormErrors>({
    email: "",
    phone: "",
    experience: ""
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "acceptMarketing") {
      // For checkbox values, we need to handle boolean values
      // Note that value might be a string "true"/"false" or a boolean true/false
      const boolValue = value === "true" || Boolean(value);
      setFormData(prev => ({
        ...prev,
        [name]: boolValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({
      email: "",
      phone: "",
      experience: ""
    });
  };

  return {
    formData,
    errors,
    isSubmitting,
    setFormData,
    setErrors,
    setIsSubmitting,
    handleChange,
    resetForm
  };
};
