
import { useState, useRef, useEffect } from "react";
import SignupForm from "./SignupForm";
import { SignupFormData } from "@/types/signupForm"; 
import CtaHeader from "./CtaHeader";
import { workFields, workRegions } from "./data/workFields";
import { useUtmParams } from "@/hooks/useUtmParams";
import { submitSignupForm } from "@/services/formSubmission";
import { toast } from "sonner";

interface MainCtaSectionProps {
  showNotification?: (title: string, description: string, userName?: string, userPhone?: string, showWelcomeMessage?: boolean) => void;
}

const MainCtaSection = ({ showNotification }: MainCtaSectionProps) => {
  const utmParams = useUtmParams();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, {
      threshold: 0.1
    });
    
    const elements = sectionRef.current?.querySelectorAll(".scroll-fade");
    elements?.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (formData: SignupFormData): Promise<void> => {
    try {
      console.log("MainCtaSection: Starting form submission with data:", formData);
      setFormError(null);
      
      // Client-side validation for required fields
      if (!formData.firstName || !formData.lastName) {
        const errorMsg = "נא למלא את שדות השם הפרטי ושם המשפחה";
        if (showNotification) {
          showNotification("שגיאה בהרשמה", errorMsg);
        } else {
          toast.error(errorMsg);
        }
        setFormError(errorMsg);
        return Promise.reject(new Error("חסרים שדות חובה"));
      }
      
      if (!formData.email) {
        const errorMsg = "נא למלא את שדה האימייל";
        if (showNotification) {
          showNotification("שגיאה בהרשמה", errorMsg);
        } else {
          toast.error(errorMsg);
        }
        setFormError(errorMsg);
        return Promise.reject(new Error("חסר שדה אימייל"));
      }
      
      if (formData.workFields.length === 0) {
        const errorMsg = "נא לבחור לפחות תחום עבודה אחד";
        if (showNotification) {
          showNotification("שגיאה בהרשמה", errorMsg);
        } else {
          toast.error(errorMsg);
        }
        setFormError(errorMsg);
        return Promise.reject(new Error("חסרים תחומי עבודה"));
      }
      
      if (formData.workRegions.length === 0) {
        const errorMsg = "נא לבחור לפחות אזור עבודה אחד";
        if (showNotification) {
          showNotification("שגיאה בהרשמה", errorMsg);
        } else {
          toast.error(errorMsg);
        }
        setFormError(errorMsg);
        return Promise.reject(new Error("חסרים אזורי עבודה"));
      }
      
      if (!formData.experience) {
        const errorMsg = "נא לבחור ותק";
        if (showNotification) {
          showNotification("שגיאה בהרשמה", errorMsg);
        } else {
          toast.error(errorMsg);
        }
        setFormError(errorMsg);
        return Promise.reject(new Error("חסר ותק"));
      }
      
      if (!formData.acceptMarketing) {
        const errorMsg = "נא לאשר קבלת עדכונים ותוכן שיווקי";
        if (showNotification) {
          showNotification("שגיאה בהרשמה", errorMsg);
        } else {
          toast.error(errorMsg);
        }
        setFormError(errorMsg);
        return Promise.reject(new Error("חסר אישור קבלת עדכונים"));
      }
      
      console.log("MainCtaSection: Validation passed, submitting form with UTM params:", utmParams);
      
      try {
        await submitSignupForm(formData, workFields, workRegions, utmParams);
        
        const successMsg = "ברוכים הבאים ל-oFair! פרטיך התקבלו בהצלחה.";
        
        // Get the user's full name and phone for the personalized message
        const userName = `${formData.firstName} ${formData.lastName}`.trim();
        const userPhone = formData.phone || "";
        
        if (showNotification) {
          showNotification(
            "הרשמה בוצעה בהצלחה",
            successMsg,
            userName,
            userPhone,
            true // Show the welcome message
          );
        } else {
          toast.success(successMsg);
        }
        
        console.log("MainCtaSection: Form submission successful");
        return Promise.resolve();
      } catch (submitError) {
        console.error("Error in submitSignupForm:", submitError);
        
        const errorMsg = submitError instanceof Error 
          ? submitError.message 
          : "אירעה שגיאה בעת שליחת הטופס. אנא נסו שוב מאוחר יותר.";
          
        if (showNotification) {
          showNotification(
            "שגיאה בהרשמה",
            errorMsg
          );
        } else {
          toast.error(errorMsg);
        }
        
        setFormError(errorMsg);
        throw submitError; // Re-throw for outer catch block
      }
      
    } catch (error) {
      console.error("Error submitting form:", error);
      
      const errorMsg = error instanceof Error 
        ? error.message 
        : "אירעה שגיאה בעת שליחת הטופס. אנא נסו שוב מאוחר יותר.";
      
      if (showNotification) {
        showNotification(
          "שגיאה בהרשמה",
          errorMsg
        );
      } else {
        toast.error(errorMsg);
      }
      
      setFormError(errorMsg);
      return Promise.reject(error);
    }
  };

  return (
    <section className="py-16 md:py-24 cta-gradient" id="cta" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <CtaHeader />
          
          <div className="glass-card md:p-8 scroll-fade max-w-2xl mx-auto">
            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {formError}
              </div>
            )}
            <SignupForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainCtaSection;
