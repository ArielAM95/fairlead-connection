import { ContactFormData } from "@/components/contact/ContactForm";
import { SignupFormData } from "@/components/cta/SignupForm";
import { supabase } from "@/integrations/supabase/client";

const WEBHOOK_URL = "https://hook.eu2.make.com/4flq1xywuqf165vnw7v61hjn8ap6airq";

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
  // Transform work fields and regions to Hebrew for the webhook
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

  // 1. First, submit to webhook as before
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

  // 2. Parse experience years from selection
  const experienceYearsMap: Record<string, number> = {
    '0-2': 1,
    '3-5': 4,
    '6-10': 8,
    '10+': 11
  };

  // 3. Now store in Supabase professionals table
  const { error } = await supabase
    .from('professionals')
    .insert({
      name: `${formData.firstName} ${formData.lastName}`,
      profession: formData.workFields[0], // Primary work field
      specialties: formData.workFields, // All selected work fields as array
      location: formData.city,
      areas: workRegionsInHebrew,
      email: formData.email,
      phone_number: formData.phone,
      company_name: formData.companyName || null,
      experience_years: experienceYearsMap[formData.experience] || null,
      is_verified: false,
      status: 'pending'
    });
      
  if (error) {
    console.error("Error storing signup in Supabase:", error);
    throw new Error("שגיאה בשמירת הנתונים");
  }
};
