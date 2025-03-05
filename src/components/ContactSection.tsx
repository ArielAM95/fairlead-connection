import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    phone: ""
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
    const { name, value } = e.target;
    
    // For email fields, strip non-Latin characters
    if (name === 'email') {
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
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data for submission
      const dataToSubmit = {
        ...formData,
        post_type: "contact_form" // Hidden field to identify the form type
      };
      
      // Send data to webhook
      const response = await fetch("https://hook.eu2.make.com/ec33yqbomj1l3klhbrc4wtyix0y30pwi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });
      
      if (!response.ok) {
        throw new Error("שגיאה בשליחת הטופס");
      }
      
      // Show success message
      toast({
        title: "ההודעה נשלחה בהצלחה",
        description: "תודה על פנייתך! נחזור אליך בהקדם.",
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "שגיאה בשליחה",
        description: "אירעה שגיאה בעת שליחת הטופס. אנא נסו שוב מאוחר יותר.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50" id="contact">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-ofair-900">
              צור קשר
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              יש לכם שאלות? אנחנו כאן בשבילכם.
            </p>
            <p className="text-muted-foreground">
              מלאו את הטופס ונחזור אליכם בהקדם האפשרי.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
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
              
              <div>
                <Button 
                  type="submit" 
                  className="w-full bg-ofair-900 hover:bg-ofair-800 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "שולח..." : "שלח הודעה"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
