
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
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (type === "checkbox") {
      // For checkbox inputs, use the checked property
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      // For other input types, use the value property
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
