
import { validateEmail, validatePhone } from "@/utils/formValidation";
import { SignupFormData, SignupFormErrors } from "@/types/signupForm";

export const useFormValidation = () => {
  const validateForm = (formData: SignupFormData): { 
    isValid: boolean; 
    errors: SignupFormErrors;
  } => {
    const errors: SignupFormErrors = {
      email: "",
      phone: "",
      experience: ""
    };
    
    let isValid = true;

    if (!validateEmail(formData.email)) {
      errors.email = "נא להזין כתובת אימייל תקינה";
      isValid = false;
    }

    if (!validatePhone(formData.phone)) {
      errors.phone = "נא להזין מספר טלפון תקין";
      isValid = false;
    }
    
    if (!formData.experience) {
      errors.experience = "נא לבחור ותק";
      isValid = false;
    }

    return { isValid, errors };
  };

  return {
    validateForm
  };
};
