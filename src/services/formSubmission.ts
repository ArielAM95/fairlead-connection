
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

  // 2. Now also store in Supabase
  try {
    // Extract UTM parameters from the utmParams object
    const { 
      utm_source = null, 
      utm_medium = null, 
      utm_campaign = null, 
      utm_term = null, 
      utm_content = null 
    } = utmParams;

    // Insert into users_signup table
    const { error } = await supabase
      .from('users_signup')
      .insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        company_name: formData.companyName,
        work_fields: formData.workFields,
        other_work_field: formData.showOtherWorkField ? formData.otherWorkField : null,
        experience: formData.experience,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        work_regions: formData.workRegions,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content
      });
      
    if (error) {
      console.error("Error storing signup in Supabase:", error);
      // Don't throw here - we already submitted to webhook, so the signup process
      // should be considered successful even if Supabase storage fails
    }
  } catch (error) {
    console.error("Error saving to Supabase:", error);
    // Again, don't throw - the signup process is still successful
  }
};
