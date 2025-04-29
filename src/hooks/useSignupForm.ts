
import { useState } from "react";
import { validateEmail, validatePhone, sanitizeEmail } from "@/utils/formValidation";

export interface SignupFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  workFields: string[];
  otherWorkField: string;
  showOtherWorkField: boolean;
  experience: string;
  email: string;
  phone: string;
  city: string;
  workRegions: string[];
}

export interface SignupFormErrors {
  email: string;
  phone: string;
  experience?: string;
}

export const useSignupForm = (onSubmit: (data: SignupFormData) => Promise<void>) => {
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

  const handleWorkFieldToggle = (id: string) => {
    setFormData(prev => {
      const newWorkFields = prev.workFields.includes(id)
        ? prev.workFields.filter(field => field !== id)
        : [...prev.workFields, id];

      const isOtherSelected = id === "other"
        ? !prev.workFields.includes("other")
        : newWorkFields.includes("other");

      return {
        ...prev,
        workFields: newWorkFields,
        showOtherWorkField: isOtherSelected,
        otherWorkField: isOtherSelected ? prev.otherWorkField : ""
      };
    });
  };

  const handleWorkRegionToggle = (id: string) => {
    setFormData(prev => {
      const newWorkRegions = prev.workRegions.includes(id)
        ? prev.workRegions.filter(region => region !== id)
        : [...prev.workRegions, id];
      return {
        ...prev,
        workRegions: newWorkRegions
      };
    });
  };

  const handleExperienceChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: value
    }));
    
    // Clear any experience error when a value is selected
    if (value) {
      setErrors(prev => ({
        ...prev,
        experience: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;

    if (!validateEmail(formData.email)) {
      setErrors(prev => ({
        ...prev,
        email: "נא להזין כתובת אימייל תקינה"
      }));
      hasError = true;
    }

    if (!validatePhone(formData.phone)) {
      setErrors(prev => ({
        ...prev,
        phone: "נא להזין מספר טלפון תקין"
      }));
      hasError = true;
    }
    
    if (!formData.experience) {
      setErrors(prev => ({
        ...prev,
        experience: "נא לבחור ותק"
      }));
      hasError = true;
    }

    if (hasError) {
      console.log("Form has validation errors:", errors);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting form data:", formData);
      await onSubmit(formData);
      
      // Reset form
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
    } catch (error) {
      console.error("Error submitting form:", error);
      // Don't clear the form on error so user can try again
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
    handleSubmit
  };
};
