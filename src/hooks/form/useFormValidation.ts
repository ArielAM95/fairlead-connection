
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
      professions: ""
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

    if (formData.professions.length === 0) {
      errors.professions = "נא לבחור לפחות מקצוע אחד";
      isValid = false;
    }

    // Validate that professions with available specializations have at least one selected
    for (const profession of formData.professions) {
      const availableSpecs = getSpecializationsByProfession(profession.professionId);
      if (availableSpecs.length > 0 && profession.specializations.length === 0) {
        errors.professions = "נא לבחור לפחות תת התמחות אחת לכל מקצוע שיש לו התמחויות";
        isValid = false;
        break;
      }
    }

    return { isValid, errors };
  };

  return {
    validateForm
  };
};