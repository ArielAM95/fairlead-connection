
import { validateEmail, validatePhone, validateBusinessLicense } from "@/utils/formValidation";
import { SignupFormData, SignupFormErrors } from "@/types/signupForm";
import { getSpecializationsByProfession } from '@/components/cta/data/professionsAndSpecializations';

export const useFormValidation = () => {
  const validateForm = (formData: SignupFormData): { 
    isValid: boolean; 
    errors: SignupFormErrors;
  } => {
    const errors: SignupFormErrors = {
      email: "",
      phone: "",
      experience: "",
      acceptTerms: "",
      businessLicenseNumber: "",
      mainProfession: "",
      subSpecializations: ""
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

    if (!formData.acceptTerms) {
      errors.acceptTerms = "יש לאשר את תנאי השימוש ומדיניות הפרטיות";
      isValid = false;
    }

    if (!validateBusinessLicense(formData.businessLicenseNumber)) {
      errors.businessLicenseNumber = "נא להזין מספר עוסק תקין (ספרות בלבד)";
      isValid = false;
    }

    if (!formData.mainProfession) {
      errors.mainProfession = "נא לבחור מקצוע ראשי";
      isValid = false;
    }

    if (formData.mainProfession) {
      const availableSpecs = getSpecializationsByProfession(formData.mainProfession);
      if (availableSpecs.length > 0 && formData.subSpecializations.length === 0) {
        errors.subSpecializations = "נא לבחור לפחות תת התמחות אחת";
        isValid = false;
      }
    }

    return { isValid, errors };
  };

  return {
    validateForm
  };
};
