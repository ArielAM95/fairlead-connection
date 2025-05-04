
import { ContactFormData } from "@/components/contact/ContactForm";
import { SignupFormData } from "@/types/signupForm"; // Fixed import
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
        console.error("Response body:", await response.text());
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

    // 3. Prepare data for Supabase professionals table - with modified approach and improved logging
    const professionalData = {
      // Combine firstName and lastName into a single name field
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      profession: formData.workFields[0] || "לא צוין",
      specialties: formData.workFields,
      location: formData.city || "לא צוין",
      areas: formData.workRegions.join(", "),
      email: formData.email,
      phone_number: formData.phone || null,
      company_name: formData.companyName || null,
      experience_years: experienceYearsMap[formData.experience] || 1,
      city: formData.city || "לא צוין",
      // Ensure these don't overwrite the defaults in the database
      is_verified: false,
      status: 'pending'
    };
    
    console.log("Prepared professional data for Supabase:", professionalData);
    
    // 4. Direct insert approach - skip checking for existing email to simplify the process
    console.log("Attempting direct insert to professionals table");
    
    const { data: insertedData, error: insertError } = await supabase
      .from('professionals')
      .insert(professionalData)
      .select('id');
      
    if (insertError) {
      console.error("CRITICAL ERROR: Failed to insert professional data:", insertError);
      console.error("Error code:", insertError.code);
      console.error("Error details:", insertError.message, insertError.details);
      
      // More detailed error reporting for debugging
      if (insertError.message.includes("permission denied")) {
        throw new Error("שגיאת הרשאות: אין אפשרות לשמור את הנתונים (קוד RLS)");
      }
      
      if (insertError.message.includes("violates not-null constraint")) {
        const missingField = insertError.message.match(/column "(.*?)"/)?.[1] || "unknown";
        throw new Error(`שגיאה: שדה חובה חסר - ${missingField}`);
      }
      
      if (insertError.message.includes("duplicate key")) {
        // Try update instead
        console.log("Email already exists, trying to update the record instead");
        
        const { error: updateError } = await supabase
          .from('professionals')
          .update(professionalData)
          .eq('email', formData.email);
          
        if (updateError) {
          console.error("Update failed after duplicate key error:", updateError);
          throw new Error(`שגיאה בעדכון הנתונים: ${updateError.message}`);
        } else {
          console.log("Successfully updated existing professional record");
          return Promise.resolve();
        }
      }
      
      // Generic error if no specific case matched
      throw new Error(`שגיאה בשמירת הנתונים: ${insertError.message}`);
    }

    console.log("Successfully stored in Supabase:", insertedData);
    return Promise.resolve();
  } catch (err) {
    console.error("Exception during form submission process:", err);
    // Still throw the error to be handled by the caller
    throw err;
  }
};
