
import { useState } from "react";
import { SignupFormData, SignupFormErrors } from "@/types/signupForm";
import { sanitizeEmail, validateEmail, validatePhone } from "@/utils/formValidation";

export const useFormState = () => {
  const [formData, setFormData] = useState<SignupFormData>({
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
    workRegions: []
  });

  const [errors, setErrors] = useState<SignupFormErrors>({
    email: "",
    phone: "",
    experience: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (
    name: keyof SignupFormData, 
    value: string | string[] | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'email') {
      const sanitizedValue = sanitizeEmail(value);
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
      
      if (!validateEmail(sanitizedValue) && sanitizedValue) {
        setErrors(prev => ({
          ...prev,
          email: "נא להזין כתובת אימייל תקינה"
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          email: ""
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      if (name === 'phone') {
        if (!validatePhone(value) && value) {
          setErrors(prev => ({
            ...prev,
            phone: "נא להזין מספר טלפון תקין"
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            phone: ""
          }));
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
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
      workRegions: []
    });
    
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
    updateFormData,
    setErrors,
    setIsSubmitting,
    handleChange,
    resetForm
  };
};
