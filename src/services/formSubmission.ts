
import { ContactFormData } from "@/components/contact/ContactForm";
import { SignupFormData } from "@/components/cta/SignupForm";

const WEBHOOK_URL = "https://hook.eu2.make.com/ec33yqbomj1l3klhbrc4wtyix0y30pwi";

export const submitContactForm = async (formData: ContactFormData): Promise<void> => {
  const dataToSubmit = {
    ...formData,
    post_type: "contact_form" // Hidden field to identify the form type
  };
  
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSubmit),
  });
  
  if (!response.ok) {
    throw new Error("שגיאה בשליחת הטופס");
  }
};

export const submitSignupForm = async (
  formData: SignupFormData, 
  workFields: { id: string; label: string }[],
  workRegions: { id: string; label: string }[],
  utmParams: Record<string, string>
): Promise<void> => {
  const workFieldsInHebrew = formData.workFields.map(fieldId => {
    if (fieldId === "other") return "אחר";
    const field = workFields.find(f => f.id === fieldId);
    return field ? field.label : fieldId;
  }).join(", ");
  
  const workRegionsInHebrew = formData.workRegions.map(regionId => {
    const region = workRegions.find(r => r.id === regionId);
    return region ? region.label : regionId;
  }).join(", ");
  
  const dataToSubmit = {
    ...formData,
    post_type: "main_signup_form",
    workFields: workFieldsInHebrew,
    workRegions: workRegionsInHebrew,
    otherWorkField: formData.showOtherWorkField ? formData.otherWorkField : "",
    ...utmParams
  };

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dataToSubmit)
  });
  
  if (!response.ok) {
    throw new Error("שגיאה בשליחת הנתונים");
  }
};
