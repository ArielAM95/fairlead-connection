
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { showNotification, showSuccessNotification } from "@/utils/notification";
import { T } from "@/components/translation/T";

interface ContactSectionProps {
  showNotification?: (title: string, description: string) => void;
}

const ContactSection = ({ showNotification: propsShowNotification }: ContactSectionProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    acceptTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    acceptTerms: ""
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Simple Israeli phone number validation
    const phoneRegex = /^0[2-9]\d{7,8}$/;
    return phoneRegex.test(phone.replace(/-/g, ''));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'email') {
      // For email fields, strip non-Latin characters
      const sanitizedValue = value.replace(/[^\x00-\x7F]/g, "");
      setFormData({ ...formData, [name]: sanitizedValue });
      
      if (!validateEmail(sanitizedValue) && sanitizedValue) {
        setErrors(prev => ({ ...prev, email: "נא להזין כתובת אימייל תקינה" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Validate phone if that field is being updated
      if (name === 'phone') {
        if (!validatePhone(value) && value) {
          setErrors(prev => ({ ...prev, phone: "נא להזין מספר טלפון תקין" }));
        } else {
          setErrors(prev => ({ ...prev, phone: "" }));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: "נא להזין כתובת אימייל תקינה" }));
      return;
    }
    
    // Validate phone before submission
    if (!validatePhone(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: "נא להזין מספר טלפון תקין" }));
      return;
    }
    
    // Validate terms acceptance
    if (!formData.acceptTerms) {
      setErrors(prev => ({ ...prev, acceptTerms: "יש לאשר את תנאי השימוש ומדיניות הפרטיות" }));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data for submission
      const dataToSubmit = {
        ...formData,
        post_type: "contact_form" // Hidden field to identify the form type
      };
      
      // Send data to webhook - UPDATED WEBHOOK URL
      const response = await fetch("https://hook.eu2.make.com/4flq1xywuqf165vnw7v61hjn8ap6airq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });
      
      if (!response.ok) {
        throw new Error("שגיאה בשליחת הטופס");
      }
      
      // Show success notification
      if (propsShowNotification) {
        propsShowNotification(
          "ההודעה נשלחה בהצלחה",
          "תודה על פנייתך! נחזור אליך בהקדם."
        );
      } else {
        showSuccessNotification(
          "ההודעה נשלחה בהצלחה",
          "תודה על פנייתך! נחזור אליך בהקדם."
        );
      }
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        acceptTerms: false
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Show error notification
      if (propsShowNotification) {
        propsShowNotification(
          "שגיאה בשליחה",
          "אירעה שגיאה בעת שליחת הטופס. אנא נסו שוב מאוחר יותר."
        );
      } else {
        showNotification(
          "שגיאה בשליחה",
          "אירעה שגיאה בעת שליחת הטופס. אנא נסו שוב מאוחר יותר."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-gray-50" id="contact">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-ofair-900">
              <T>צור קשר</T>
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              <T>יש לכם שאלות? אנחנו כאן בשבילכם.</T>
            </p>
            <p className="text-muted-foreground mb-4">
              <T>מלאו את הטופס ונחזור אליכם בהקדם האפשרי.</T>
            </p>
            <div className="inline-block bg-ofair-100 text-ofair-900 px-4 py-2 rounded-md font-medium border border-ofair-200 mb-6">
              <T>שימו לב: זהו טופס צור קשר בלבד ואינו מהווה טופס הרשמה לשירות</T>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    <T>שם פרטי</T>
                  </label>
                  <Input
                    id="contact-firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 border-gray-200"
                  />
                </div>

                <div>
                  <label htmlFor="contact-lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    <T>שם משפחה</T>
                  </label>
                  <Input
                    id="contact-lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                    <T>אימייל</T>
                  </label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 border-gray-200"
                    dir="ltr"
                    error={!!errors.email}
                    errorMessage={errors.email}
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">
                    <T>מספר טלפון</T>
                  </label>
                  <Input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 border-gray-200"
                    dir="ltr"
                    placeholder="05X-XXXXXXX"
                    error={!!errors.phone}
                    errorMessage={errors.phone}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                  <T>הודעה</T>
                </label>
                <Textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border-gray-200 min-h-32"
                />
              </div>

              <div className="flex items-start gap-2 rtl:space-x-reverse">
                <Checkbox
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => {
                    handleChange({
                      target: {
                        name: "acceptTerms",
                        type: "checkbox",
                        checked: !!checked
                      }
                    } as React.ChangeEvent<HTMLInputElement>)
                  }}
                />
                <Label
                  htmlFor="acceptTerms"
                  className="text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <T>אני מאשר/ת את</T>{" "}
                  <a href="/terms" className="text-ofair-900 hover:underline">
                    <T>תנאי השימוש</T>
                  </a>
                  {" "}<T>ואת</T>{" "}
                  <a href="/terms" className="text-ofair-900 hover:underline">
                    <T>מדיניות הפרטיות</T>
                  </a>
                  {" *"}
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-500">{errors.acceptTerms}</p>
              )}

              <div>
                <Button
                  type="submit"
                  className="w-full bg-ofair-900 hover:bg-ofair-800 text-white"
                  disabled={isSubmitting || !formData.acceptTerms || !!errors.email || !!errors.phone}
                >
                  {isSubmitting ? <T>שולח...</T> : <T>שלח הודעה</T>}
                </Button>
              </div>

              <div className="text-center mt-4 text-sm text-muted-foreground">
                <p><T>* טופס זה אינו מהווה הרשמה לשירות, רק יצירת קשר עם הצוות שלנו</T></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
