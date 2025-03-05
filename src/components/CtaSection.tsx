
import { useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const workFields = [
  { id: "construction", label: "בנייה" },
  { id: "plumbing", label: "אינסטלציה" },
  { id: "electricity", label: "חשמל" },
  { id: "inspection", label: "בדק בית" },
  { id: "carpentry", label: "נגרות" },
  { id: "painting", label: "צביעה" },
  { id: "flooring", label: "ריצוף" },
  { id: "renovations", label: "שיפוצים" },
  { id: "architecture", label: "אדריכלות" },
  { id: "landscaping", label: "גינון ונוף" },
  { id: "hvac", label: "מיזוג אוויר" },
  { id: "roofing", label: "גגות" },
  { id: "concrete", label: "עבודות בטון" },
  { id: "locksmith", label: "מנעולן" },
  { id: "glass", label: "זגגות" },
  { id: "welding", label: "עבודות מסגרות" },
  { id: "soundproofing", label: "בידוד אקוסטי" },
  { id: "waterproofing", label: "איטום" },
  { id: "demolition", label: "הריסה" },
  { id: "stonework", label: "עבודות אבן" },
  { id: "security", label: "מערכות אבטחה" },
  { id: "engineering", label: "הנדסה" },
];

const experienceOptions = [
  { id: "0-2", label: "0-2 שנים" },
  { id: "3-5", label: "3-5 שנים" },
  { id: "6-10", label: "6-10 שנים" },
  { id: "10+", label: "מעל 10 שנים" },
];

const workRegions = [
  { id: "north", label: "צפון" },
  { id: "south", label: "דרום" },
  { id: "center", label: "מרכז" },
  { id: "samaria", label: "שומרון" },
  { id: "jerusalem", label: "ירושלים והסביבה" },
  { id: "eilat", label: "אילת" },
  { id: "shfela", label: "שפלה" },
  { id: "sharon", label: "השרון" },
];

const CtaSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    workFields: [] as string[],
    otherWorkField: "",
    showOtherWorkField: false,
    experience: "",
    email: "",
    phone: "",
    city: "",
    workRegions: [] as string[],
  });
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const utmObject: Record<string, string> = {};
    
    for (const [key, value] of queryParams.entries()) {
      if (key.startsWith('utm_')) {
        utmObject[key] = value;
      }
    }
    
    setUtmParams(utmObject);
    
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Simple Israeli phone number validation
    const phoneRegex = /^0[2-9]\d{7,8}$/;
    return phoneRegex.test(phone.replace(/-/g, ''));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate email on change
    if (name === 'email') {
      if (!validateEmail(value) && value) {
        setErrors(prev => ({ ...prev, email: "נא להזין כתובת אימייל תקינה" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
      }
    }
    
    // Validate phone on change
    if (name === 'phone') {
      if (!validatePhone(value) && value) {
        setErrors(prev => ({ ...prev, phone: "נא להזין מספר טלפון תקין" }));
      } else {
        setErrors(prev => ({ ...prev, phone: "" }));
      }
    }
  };

  const handleWorkFieldToggle = (id: string) => {
    setFormData((prev) => {
      const newWorkFields = prev.workFields.includes(id)
        ? prev.workFields.filter((field) => field !== id)
        : [...prev.workFields, id];
      
      const isOtherSelected = id === "other" 
        ? !prev.workFields.includes("other") 
        : newWorkFields.includes("other");
      
      return { 
        ...prev, 
        workFields: newWorkFields,
        showOtherWorkField: isOtherSelected,
        otherWorkField: isOtherSelected ? prev.otherWorkField : ""
      };
    });
  };

  const handleWorkRegionToggle = (id: string) => {
    setFormData((prev) => {
      const newWorkRegions = prev.workRegions.includes(id)
        ? prev.workRegions.filter((region) => region !== id)
        : [...prev.workRegions, id];
      
      return { 
        ...prev, 
        workRegions: newWorkRegions
      };
    });
  };

  const handleExperienceChange = (value: string) => {
    setFormData({ ...formData, experience: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: "נא להזין כתובת אימייל תקינה" }));
      return;
    }
    
    if (!validatePhone(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: "נא להזין מספר טלפון תקין" }));
      return;
    }
    
    setIsSubmitting(true);
    
    const workFieldsInHebrew = formData.workFields.map(fieldId => {
      if (fieldId === "other") return "אחר";
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
    
    try {
      const response = await fetch("https://hook.eu2.make.com/ec33yqbomj1l3klhbrc4wtyix0y30pwi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });
      
      if (!response.ok) {
        throw new Error("שגיאה בשליחת הנתונים");
      }
      
      toast({
        title: "הרשמה בוצעה בהצלחה",
        description: "ברוכים הבאים ל-oFair! פרטיך התקבלו בהצלחה.",
      });
      
      setFormData({
        firstName: "",
        lastName: "",
        companyName: "",
        workFields: [],
        otherWorkField: "",
        showOtherWorkField: false,
        experience: "",
        email: "",
        phone: "",
        city: "",
        workRegions: [],
      });
      
      setErrors({
        email: "",
        phone: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "שגיאה בהרשמה",
        description: "אירעה שגיאה בעת שליחת הטופס. אנא נסו שוב מאוחר יותר.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 cta-gradient" id="signup-form" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white scroll-fade">
              🚀 בלעדי למצטרפים הראשונים – דמי הצטרפות מוזלים! 🚀
            </h2>
            <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto scroll-fade">
              הפלטפורמה תעלה לאוויר בעוד מספר שבועות, וכל מי שנרשם עכשיו מקבל דמי הקמה מוזלים – רק 300 ש"ח במקום 630 ש"ח!
            </p>
            <p className="text-white/80 scroll-fade">📲 השאירו פרטים וקחו את העסק שלכם לשלב הבא!</p>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg scroll-fade max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    שם פרטי *
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    שם משפחה *
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  מספר טלפון *
                </label>
                <Input
                  id="phone"
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
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  עיר *
                </label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border-gray-200"
                  placeholder="שם העיר"
                />
              </div>
              
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  שם חברה (אופציונלי)
                </label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תחומי עבודה *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-md border border-gray-200">
                  {workFields.map((field) => (
                    <div key={field.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox 
                        id={`field-${field.id}`}
                        checked={formData.workFields.includes(field.id)}
                        onCheckedChange={() => handleWorkFieldToggle(field.id)}
                      />
                      <label 
                        htmlFor={`field-${field.id}`}
                        className="text-sm leading-none cursor-pointer"
                      >
                        {field.label}
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox 
                      id="field-other"
                      checked={formData.workFields.includes("other")}
                      onCheckedChange={() => handleWorkFieldToggle("other")}
                    />
                    <label 
                      htmlFor="field-other"
                      className="text-sm leading-none cursor-pointer"
                    >
                      אחר
                    </label>
                  </div>
                </div>
                {formData.showOtherWorkField && (
                  <div className="mt-2">
                    <Input
                      id="otherWorkField"
                      name="otherWorkField"
                      value={formData.otherWorkField}
                      onChange={handleChange}
                      placeholder="נא פרט תחום עבודה אחר"
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                )}
                {formData.workFields.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">יש לבחור לפחות תחום אחד</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  באיזה אזורים אתה מעוניין לעבוד *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-md border border-gray-200">
                  {workRegions.map((region) => (
                    <div key={region.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox 
                        id={`region-${region.id}`}
                        checked={formData.workRegions.includes(region.id)}
                        onCheckedChange={() => handleWorkRegionToggle(region.id)}
                      />
                      <label 
                        htmlFor={`region-${region.id}`}
                        className="text-sm leading-none cursor-pointer"
                      >
                        {region.label}
                      </label>
                    </div>
                  ))}
                </div>
                {formData.workRegions.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">יש לבחור לפחות אזור אחד</p>
                )}
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  ותק *
                </label>
                <Select onValueChange={handleExperienceChange} value={formData.experience} required>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="בחר ותק" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  אימייל *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border-gray-200"
                  dir="ltr"
                  placeholder="your@email.com"
                  error={!!errors.email}
                  errorMessage={errors.email}
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-ofair-900 hover:bg-ofair-800 text-white py-6"
                  disabled={isSubmitting || formData.workFields.length === 0 || formData.workRegions.length === 0 || !!errors.email || !!errors.phone}
                >
                  {isSubmitting ? "מבצע רישום..." : "הירשמו כעת"}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  בלחיצה על הכפתור אני מאשר/ת את 
                  <a href="/terms" className="text-ofair-900 hover:underline mx-1">תנאי השימוש</a>
                  ואת
                  <a href="/terms" className="text-ofair-900 hover:underline mx-1">מדיניות הפרטיות</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
