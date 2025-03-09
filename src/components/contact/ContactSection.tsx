
import { useState } from "react";
import ContactHeader from "./ContactHeader";
import ContactForm, { ContactFormData } from "./ContactForm";
import { submitContactForm } from "@/services/formSubmission";

interface ContactSectionProps {
  showNotification?: (title: string, description: string) => void;
}

const ContactSection = ({ showNotification }: ContactSectionProps) => {
  const handleSubmit = async (formData: ContactFormData) => {
    try {
      // Send data to webhook
      await submitContactForm(formData);
      
      // Show success notification
      if (showNotification) {
        showNotification(
          "ההודעה נשלחה בהצלחה",
          "תודה על פנייתך! נחזור אליך בהקדם."
        );
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Show error notification
      if (showNotification) {
        showNotification(
          "שגיאה בשליחה",
          "אירעה שגיאה בעת שליחת הטופס. אנא נסו שוב מאוחר יותר."
        );
      }
      
      return Promise.reject(error);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-gray-50" id="contact">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <ContactHeader />
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <ContactForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
