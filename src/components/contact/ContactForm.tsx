
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ContactFormProps {
  onSubmit: (formData: ContactFormData) => Promise<void>;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  acceptTerms: boolean;
}

const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
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
    // Israeli phone number validation - 10 digits maximum
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const phoneRegex = /^0[2-9]\d{8}$/;
    return phoneRegex.test(cleanPhone) || /^05\d{8}$/.test(cleanPhone);
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
      await onSubmit(formData);
      
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-firstName" className="block text-sm font-medium text-gray-700 mb-1">
            שם פרטי
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
            שם משפחה
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
            אימייל
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
            מספר טלפון
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
            maxLength={10}
            error={!!errors.phone}
            errorMessage={errors.phone}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
          הודעה
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
          אני מאשר/ת את{" "}
          <a href="/terms" className="text-ofair-900 hover:underline">
            תנאי השימוש
          </a>
          {" "}ואת{" "}
          <a href="/terms" className="text-ofair-900 hover:underline">
            מדיניות הפרטיות
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
          {isSubmitting ? "שולח..." : "שלח הודעה"}
        </Button>
      </div>
      
      <div className="text-center mt-4 text-sm text-muted-foreground">
        <p>* טופס זה אינו מהווה הרשמה לשירות, רק יצירת קשר עם הצוות שלנו</p>
      </div>
    </form>
  );
};

export default ContactForm;
