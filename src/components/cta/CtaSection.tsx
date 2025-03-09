
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
      await submitSignupForm(formData, workFields, workRegions, utmParams);
      
      if (showNotification) {
        showNotification(
          "הרשמה בוצעה בהצלחה",
          "ברוכים הבאים ל-oFair! פרטיך התקבלו בהצלחה."
        );
      }
      
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
