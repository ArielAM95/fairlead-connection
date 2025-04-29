
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
  try {
    console.log("Starting form submission process with data:", formData);
    
    // Transform work fields and regions to Hebrew for the webhook
    const workFieldsInHebrew = formData.workFields.map(fieldId => {
      if (fieldId === "other") return formData.otherWorkField || "אחר";
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

    console.log("Submitting to webhook:", dataToSubmit);

    // 1. First, submit to webhook
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSubmit)
      });
      
      if (!response.ok) {
        console.error("Error submitting to webhook:", response.status, response.statusText);
        throw new Error("שגיאה בשליחת הנתונים לווב-הוק");
      }

      console.log("Webhook submission successful");
    } catch (webhookError) {
      console.error("Webhook submission failed:", webhookError);
      // Continue with Supabase insertion even if webhook fails
    }

    // 2. Parse experience years from selection
    const experienceYearsMap: Record<string, number> = {
      '0-2': 1,
      '3-5': 4,
      '6-10': 8,
      '10+': 11
    };

    // Check for required fields
    if (!formData.firstName || !formData.lastName) {
      console.error("Missing required name fields");
      throw new Error("שגיאה: שדות שם פרטי ושם משפחה חסרים");
    }

    if (!formData.email) {
      console.error("Missing required email field");
      throw new Error("שגיאה: שדה אימייל חסר");
    }

    if (!formData.experience) {
      console.error("Missing required experience field");
      throw new Error("שגיאה: שדה ותק חסר");
    }

    if (formData.workFields.length === 0) {
      console.error("No work fields selected");
      throw new Error("שגיאה: לא נבחרו תחומי עבודה");
    }

    // 3. Now store in Supabase professionals table
    const professionalData = {
      name: `${formData.firstName} ${formData.lastName}`,
      profession: formData.workFields[0] || "לא צוין", // Ensure primary work field is never null
      specialties: formData.workFields.length > 0 ? formData.workFields : ["לא צוין"], // Ensure specialties is never empty
      location: formData.city || "לא צוין", // Ensure location is never null
      areas: formData.workRegions.length > 0 ? formData.workRegions.join(", ") : "לא צוין",
      email: formData.email,
      phone_number: formData.phone,
      company_name: formData.companyName || null,
      experience_years: experienceYearsMap[formData.experience] || 1,
      city: formData.city || "לא צוין",
      is_verified: false,
      status: 'pending'
    };
    
    console.log("Inserting into professionals table with data:", professionalData);

    // First check if email already exists in professionals table
    const { data: existingPro, error: searchError } = await supabase
      .from('professionals')
      .select('id, email')
      .eq('email', formData.email)
      .maybeSingle();

    if (searchError) {
      console.error("Error searching for existing professional:", searchError);
      throw new Error(`שגיאה בחיפוש במסד הנתונים: ${searchError.message}`);
    }

    let result;
    
    if (existingPro?.id) {
      console.log("Professional with this email already exists, updating:", existingPro.id);
      result = await supabase
        .from('professionals')
        .update(professionalData)
        .eq('id', existingPro.id)
        .select();
    } else {
      console.log("Creating new professional record");
      result = await supabase
        .from('professionals')
        .insert(professionalData)
        .select();
    }
      
    if (result.error) {
      console.error("Error storing signup in Supabase:", result.error);
      console.error("Failed with data:", professionalData);
      throw new Error(`שגיאה בשמירת הנתונים בדטה-בייס: ${result.error.message}`);
    }

    console.log("Successfully stored in Supabase:", result.data);
    return Promise.resolve();
  } catch (err) {
    console.error("Exception during form submission process:", err);
    // Still throw the error to be handled by the caller
    throw err;
  }
};
