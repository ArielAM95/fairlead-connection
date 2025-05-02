
import { useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import SignupForm, { SignupFormData } from "./SignupForm";
import CtaHeader from "./CtaHeader";
import { workFields, workRegions } from "./data/workFields";
import { useUtmParams } from "@/hooks/useUtmParams";
import { submitSignupForm } from "@/services/formSubmission";

interface CtaSectionProps {
  showNotification?: (title: string, description: string) => void;
}

const CtaSection = ({ showNotification }: CtaSectionProps) => {
  const utmParams = useUtmParams();
  const sectionRef = useRef<HTMLDivElement>(null);

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
      console.log("CtaSection: Starting form submission with data:", formData);
      
      // Validate required fields
      if (!formData.firstName || !formData.lastName) {
        if (showNotification) {
          showNotification("שגיאה בהרשמה", "נא למלא את שדות השם הפרטי ושם המשפחה");
        }
        return Promise.reject(new Error("חסרים שדות חובה"));
      }
      
      if (!formData.email) {
        if (showNotification) {
          showNotification("שגיאה בהרשמה", "נא למלא את שדה האימייל");
        }
        return Promise.reject(new Error("חסר שדה אימייל"));
      }
      
      if (formData.workFields.length === 0) {
        if (showNotification) {
          showNotification("שגיאה בהרשמה", "נא לבחור לפחות תחום עבודה אחד");
        }
        return Promise.reject(new Error("חסרים תחומי עבודה"));
      }
      
      if (formData.workRegions.length === 0) {
        if (showNotification) {
          showNotification("שגיאה בהרשמה", "נא לבחור לפחות אזור עבודה אחד");
        }
        return Promise.reject(new Error("חסרים אזורי עבודה"));
      }
      
      if (!formData.experience) {
        if (showNotification) {
          showNotification("שגיאה בהרשמה", "נא לבחור ותק");
        }
        return Promise.reject(new Error("חסר ותק"));
      }
      
      console.log("CtaSection: Validation passed, submitting form");
      await submitSignupForm(formData, workFields, workRegions, utmParams);
      
      if (showNotification) {
        showNotification(
          "הרשמה בוצעה בהצלחה",
          "ברוכים הבאים ל-oFair! פרטיך התקבלו בהצלחה."
        );
      }
      
      console.log("CtaSection: Form submission successful");
      return Promise.resolve();
    } catch (error) {
      console.error("Error submitting form:", error);
      
      if (showNotification) {
        showNotification(
          "שגיאה בהרשמה",
          "אירעה שגיאה בעת שליחת הטופס. אנא נסו שוב מאוחר יותר."
        );
      }
      
      return Promise.reject(error);
    }
  };

  return (
    <section className="py-16 md:py-24 cta-gradient" id="signup-form" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <CtaHeader />
          
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg scroll-fade max-w-2xl mx-auto">
            <SignupForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
