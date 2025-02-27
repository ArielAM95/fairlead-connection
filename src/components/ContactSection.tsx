
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".scroll-fade");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "טופס נשלח בהצלחה",
        description: "נחזור אליך בהקדם",
      });
      
      // Clear form
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1000);
  };

  return (
    <section id="contact" className="section-padding bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-ofair-900 scroll-fade">שאלות? אנחנו כאן לעזור!</h2>
          <p className="text-muted-foreground scroll-fade">
            📩 השאירו פרטים ונחזור אליכם בהקדם
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 scroll-fade">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
                <Input 
                  id="name"
                  type="text"
                  placeholder="הכנס את שמך"
                  required
                  className="bg-gray-50 border-gray-200 focus:border-ofair-300 focus:ring-ofair-300"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                <Input 
                  id="phone"
                  type="tel"
                  placeholder="הכנס את מספר הטלפון שלך"
                  required
                  className="bg-gray-50 border-gray-200 focus:border-ofair-300 focus:ring-ofair-300"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
              <Input 
                id="email"
                type="email"
                placeholder="הכנס את האימייל שלך"
                required
                className="bg-gray-50 border-gray-200 focus:border-ofair-300 focus:ring-ofair-300"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">הודעה (אופציונלי)</label>
              <Textarea 
                id="message"
                placeholder="איך נוכל לעזור לך?"
                className="bg-gray-50 border-gray-200 focus:border-ofair-300 focus:ring-ofair-300 min-h-[120px]"
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-ofair-900 hover:bg-ofair-800 text-white py-6 text-lg button-pulse"
              disabled={isSubmitting}
            >
              {isSubmitting ? "שולח..." : "שלח פרטים"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
