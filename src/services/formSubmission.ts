
import { ContactFormData } from "@/components/contact/ContactForm";
import { SignupFormData } from "@/types/signupForm";
import { supabase } from "@/integrations/supabase/client";

const WEBHOOK_URL = "https://hook.eu2.make.com/4flq1xywuqf165vnw7v61hjn8ap6airq";

export const submitContactForm = async (formData: ContactFormData): Promise<void> => {
  const dataToSubmit = {
    ...formData,
    post_type: "contact_form" // Hidden field to identify the form type
  };
  
  // 1. שליחה ל-webhook
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

  // 2. שמירה ב-Supabase
  try {
    // Import getUtmParams at the top of the file
    const { getUtmParams } = await import('@/utils/utmUtils');
    
    const { error: dbError } = await supabase
      .from('contact_inquiries' as any)
      .insert({
        first_name: formData.firstName,
        last_name: formData.lastName || "-",
        email: formData.email,
        phone_number: formData.phone,
        message: formData.message || "",
        source: 'website',
        utm_params: getUtmParams()
      });

    if (dbError) {
      console.error('Error saving contact inquiry to database:', dbError);
      // לא זורק שגיאה כי ה-webhook הצליח
    }
  } catch (dbException) {
    console.error('Exception saving to database:', dbException);
    // לא זורק שגיאה כי ה-webhook הצליח
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
    
    // Build mapping from DB for professions and specializations (Hebrew labels)
    const selectedProfessionIds = formData.professions.map(p => p.professionId);

    const { data: profRows, error: profFetchError } = await supabase
      .from('professions')
      .select('id, profession_id, label')
      .in('profession_id', selectedProfessionIds);
    if (profFetchError) throw profFetchError;

    const profIdToLabel = new Map<string, string>();
    const profIdToPk = new Map<string, string>();
    (profRows || []).forEach((p: any) => {
      profIdToLabel.set(p.profession_id, p.label);
      profIdToPk.set(p.profession_id, p.id);
    });

    const professionPks = Array.from(profIdToPk.values());
    const { data: specRows, error: specFetchError } = professionPks.length
      ? await supabase
          .from('profession_specializations')
          .select('profession_id, specialization_id, label')
          .in('profession_id', professionPks)
          .eq('is_active', true)
      : ({ data: [], error: null } as any);
    if (specFetchError) throw specFetchError as any;

    const specsMap = new Map<string, Map<string, string>>();
    (specRows as any[]).forEach((s: any) => {
      if (!specsMap.has(s.profession_id)) specsMap.set(s.profession_id, new Map());
      specsMap.get(s.profession_id)!.set(s.specialization_id, s.label);
    });

    const getProfessionLabelDb = (professionId: string) =>
      professionId === 'other-profession' && formData.otherProfession
        ? formData.otherProfession
        : (profIdToLabel.get(professionId) || professionId);

    const getSpecLabelDb = (professionId: string, specId: string) => {
      const pk = profIdToPk.get(professionId);
      if (!pk) return specId;
      const label = specsMap.get(pk)?.get(specId);
      return label || specId;
    };
    
    // Work fields in Hebrew
    const workFieldsInHebrew = formData.workFields.map(fieldId => {
      if (fieldId === "other") return formData.otherWorkField || "אחר";
      const field = workFields.find(f => f.id === fieldId);
      return field ? field.label : fieldId;
    }).join(", ");
    
    const workRegionsInHebrew = formData.workRegions
      .map(regionId => workRegions.find(r => r.id === regionId)?.label || regionId)
      .join(", ");
    
    // Format professions and specializations for webhook (Hebrew)
    const professionsFormatted = formData.professions.map(prof => {
      const profLabel = getProfessionLabelDb(prof.professionId);
      const specLabels: string[] = [];
      prof.specializations.forEach(specId => {
        if (specId === 'other' && formData.otherSpecializations?.[prof.professionId]?.length) {
          specLabels.push(...formData.otherSpecializations[prof.professionId].filter(v => v.trim()));
        } else {
          specLabels.push(getSpecLabelDb(prof.professionId, specId));
        }
      });
      const specs = specLabels.filter(Boolean).join(", ");
      return specs ? `${profLabel} (${specs})` : profLabel;
    }).join(" | ");
    
    const dataToSubmit = {
      ...formData,
      post_type: "main_signup_form",
      professions: professionsFormatted,
      workFields: workFieldsInHebrew,
      workRegions: workRegionsInHebrew,
      otherWorkField: formData.showOtherWorkField ? formData.otherWorkField : "",
      acceptTerms: formData.acceptTerms,
      acceptMarketing: formData.acceptMarketing,
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

    // Build all specialization labels (Hebrew) from DB mapping and user input
    const allSpecLabels = formData.professions.flatMap(prof => {
      const labels: string[] = [];
      prof.specializations.forEach(specId => {
        if (specId === 'other' && formData.otherSpecializations?.[prof.professionId]?.length) {
          labels.push(...(formData.otherSpecializations[prof.professionId] || []).filter(v => v.trim()));
        } else {
          labels.push(getSpecLabelDb(prof.professionId, specId));
        }
      });
      return labels;
    });
    
    const primaryProfessionLabel = formData.professions.length > 0
      ? getProfessionLabelDb(formData.professions[0].professionId)
      : null;
    
    const specialtiesFallback = formData.workFields.map(fieldId => {
      if (fieldId === "other") return formData.otherWorkField || "אחר";
      const field = workFields.find(f => f.id === fieldId);
      return field ? field.label : fieldId;
    });

    const professionalData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      main_profession: primaryProfessionLabel,
      sub_specializations: allSpecLabels,
      profession: primaryProfessionLabel ?? (specialtiesFallback[0] || "לא צוין"),
      specialties: allSpecLabels.length > 0 ? allSpecLabels : specialtiesFallback,
      email: formData.email.toLowerCase().trim(),
      phone_number: formData.phone ? formData.phone.trim() : null,
      company_name: formData.companyName || null,
      business_license_number: formData.businessLicenseNumber || null,
      experience_years: experienceYearsMap[formData.experience] || '1',
      utm_params: utmParams,
      city: formData.city || "לא צוין",
      location: formData.city || "לא צוין",
      areas: workRegionsInHebrew, // now in Hebrew
      terms_accepted: formData.acceptTerms,
      marketing_consent: formData.acceptMarketing,
      registration_payment_status: 'pending',
      registration_paid_at: null,
      registration_amount: null
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
