
import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useUtmParams } from "@/hooks/useUtmParams";
import { submitSignupForm } from "@/services/formSubmission";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
];

const experienceOptions = [
  { id: "0-2", label: "0-2 שנים" },
  { id: "3-5", label: "3-5 שנים" },
  { id: "6-10", label: "6-10 שנים" },
  { id: "10+", label: "מעל 10 שנים" },
];

// Define work regions that we need for the submitSignupForm function
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

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const utmParams = useUtmParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    workFields: [] as string[],
    otherWorkField: "",
    showOtherWorkField: false,
    experience: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    workRegions: ["center"] // Default to center region
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleWorkFieldToggle = (id: string) => {
    setFormData((prev) => {
      const fields = prev.workFields.includes(id)
        ? prev.workFields.filter((field) => field !== id)
        : [...prev.workFields, id];
      
      const showOther = id === "other" 
        ? !prev.workFields.includes("other") 
        : fields.includes("other");
      
      return { 
        ...prev, 
        workFields: fields,
        showOtherWorkField: showOther,
        otherWorkField: showOther ? prev.otherWorkField : ""
      };
    });
  };

  const handleExperienceChange = (value: string) => {
    setFormData({ ...formData, experience: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (formData.workFields.length === 0) {
      setFormError("יש לבחור לפחות תחום עבודה אחד");
      toast({
        title: "שגיאה",
        description: "יש לבחור לפחות תחום עבודה אחד",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("SignupModal: Submitting form data", formData);
      
      await submitSignupForm(
        {
          ...formData,
          workRegions: formData.workRegions,
          phone: formData.phone || "00-0000000", // Default value if not provided
          city: formData.city || "לא צוין", // Default value if not provided
        }, 
        workFields, 
        workRegions, 
        utmParams
      );
      
      toast({
        title: "הרשמה בוצעה בהצלחה",
        description: "ברוכים הבאים ל-oFair! פרטיך התקבלו בהצלחה.",
      });
      onClose();
    } catch (error) {
      console.error("Error in form submission:", error);
      
      const errorMsg = error instanceof Error 
        ? error.message 
        : "אירעה שגיאה בעת שליחת הטופס. אנא נסו שוב מאוחר יותר.";
      
      setFormError(errorMsg);
      
      toast({
        title: "שגיאה בהרשמה",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className="relative w-full max-w-lg bg-white rounded-lg shadow-xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-0 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-2xl font-bold text-ofair-900">הרשמה ל-oFair</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {formError}
            </div>
          )}
          
          <p className="text-muted-foreground mb-6">
            הצטרפו למהפכת שיתוף הלידים וקבלו גישה ללקוחות איכותיים
          </p>
          
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
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              סיסמא *
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-gray-50 border-gray-200"
              dir="ltr"
              minLength={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              יש להזין סיסמא באורך 6 תווים לפחות
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-ofair-900 hover:bg-ofair-800 text-white py-6"
              disabled={isSubmitting || formData.workFields.length === 0}
            >
              {isSubmitting ? "מבצע רישום..." : "הרשמה"}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              בלחיצה על "הרשמה" אני מאשר/ת את 
              <a href="#" className="text-ofair-900 hover:underline mx-1">תנאי השימוש</a>
              ואת
              <a href="#" className="text-ofair-900 hover:underline mx-1">מדיניות הפרטיות</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
