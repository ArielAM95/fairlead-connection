
import { ContactFormData } from "@/components/contact/ContactForm";
import { SignupFormData } from "@/types/signupForm";
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
    const experienceYearsMap: Record<string, string> = {
      '0-2': '1',
      '3-5': '4',
      '6-10': '8',
      '10+': '11'
    };

    // Improved professional data preparation - ensuring required fields are provided
    // Convert experience_years to string to match the database schema
    const professionalData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      profession: formData.workFields[0] ? (() => {
        const field = workFields.find(f => f.id === formData.workFields[0]);
        return field ? field.label : formData.workFields[0];
      })() : "לא צוין",
      specialties: formData.workFields,
      email: formData.email.toLowerCase().trim(),
      phone_number: formData.phone ? formData.phone.trim() : null,
      company_name: formData.companyName || null,
      experience_years: experienceYearsMap[formData.experience] || '1',
      city: formData.city || "לא צוין",
      location: formData.city || "לא צוין",
      areas: formData.workRegions.join(", "),
      marketing_consent: formData.acceptMarketing
    };
    
    console.log("Prepared professional data for Supabase:", professionalData);
    
    // First check if the professional already exists with this email or phone
    const { data: existingByEmail, error: checkEmailError } = await supabase
      .from('professionals')
      .select('id, email, phone_number')
      .eq('email', professionalData.email)
      .maybeSingle();
      
    if (checkEmailError) {
      console.error("Error checking existing professional by email:", checkEmailError);
    }

    const { data: existingByPhone, error: checkPhoneError } = await supabase
      .from('professionals')
      .select('id, email, phone_number')
      .eq('phone_number', professionalData.phone_number)
      .maybeSingle();
      
    if (checkPhoneError) {
      console.error("Error checking existing professional by phone:", checkPhoneError);
    }
    
    // Check if user already exists
    if (existingByEmail?.id || existingByPhone?.id) {
      throw new Error("היי! נראה שנרשמתם כבר בעבר 😊 המספר טלפון או המייל הזה כבר מופיע במערכת שלנו. בדקו את המייל שלכם (גם בספאם) או צרו איתנו קשר בוואטסאפ אם אתם זקוקים לעזרה נוספת.");
    }
    
    let result;
    
    // Insert new professional
    console.log("No existing professional found - inserting new record");
    
    result = await supabase
      .from('professionals')
      .insert(professionalData);
    
    if (result.error) {
      console.error("Error with Supabase operation:", result.error);
      console.error("Error code:", result.error.code);
      console.error("Error details:", result.error.message, result.error.details);
      
      // Handle specific database constraint errors with user-friendly messages
      if (result.error.code === '23505') { // unique constraint violation
        if (result.error.message.includes('phone')) {
          throw new Error("היי! נראה שנרשמתם כבר בעבר 😊 המספר טלפון הזה כבר מופיע במערכת שלנו. בדקו את המייל שלכם (גם בספאם) או צרו איתנו קשר בוואטסאפ אם אתם זקוקים לעזרה נוספת.");
        } else if (result.error.message.includes('email')) {
          throw new Error("היי! נראה שנרשמתם כבר בעבר 😊 המייל הזה כבר מופיע במערכת שלנו. בדקו את המייל שלכם (גם בספאם) או צרו איתנו קשר בוואטסאפ אם אתם זקוקים לעזרה נוספת.");
        } else {
          throw new Error("היי! נראה שנרשמתם כבר בעבר 😊 הפרטים שלכם כבר מופיעים במערכת שלנו. בדקו את המייל שלכם (גם בספאם) או צרו איתנו קשר בוואטסאפ אם אתם זקוקים לעזרה נוספת.");
        }
      }
      
      throw new Error(`שגיאה בשמירת הנתונים: ${result.error.message}`);
    }

    console.log("Successfully stored in Supabase:", result.data);
    return Promise.resolve();
  } catch (err) {
    console.error("Exception during form submission process:", err);
    // Still throw the error to be handled by the caller
    throw err;
  }
};
