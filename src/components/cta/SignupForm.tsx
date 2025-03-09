
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import FieldSelector from "./FieldSelector";
import { workFields, workRegions, experienceOptions } from "./data/workFields";
import { validateEmail, validatePhone, sanitizeEmail } from "@/utils/formValidation";

export interface SignupFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  workFields: string[];
  otherWorkField: string;
  showOtherWorkField: boolean;
  experience: string;
  email: string;
  phone: string;
  city: string;
  workRegions: string[];
}

interface SignupFormProps {
  onSubmit: (formData: SignupFormData) => Promise<void>;
}

const SignupForm = ({ onSubmit }: SignupFormProps) => {
  const [formData, setFormData] = useState<SignupFormData>({
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
    workRegions: [] as string[]
  });
  
  const [errors, setErrors] = useState({
    email: "",
    phone: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'email') {
      const sanitizedValue = sanitizeEmail(value);
      setFormData({
        ...formData,
        [name]: sanitizedValue
      });
      
      if (!validateEmail(sanitizedValue) && sanitizedValue) {
        setErrors(prev => ({
          ...prev,
          email: "נא להזין כתובת אימייל תקינה"
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          email: ""
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      if (name === 'phone') {
        if (!validatePhone(value) && value) {
          setErrors(prev => ({
            ...prev,
            phone: "נא להזין מספר טלפון תקין"
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            phone: ""
          }));
        }
      }
    }
  };

  const handleWorkFieldToggle = (id: string) => {
    setFormData(prev => {
      const newWorkFields = prev.workFields.includes(id) 
        ? prev.workFields.filter(field => field !== id) 
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
    setFormData(prev => {
      const newWorkRegions = prev.workRegions.includes(id) 
        ? prev.workRegions.filter(region => region !== id) 
        : [...prev.workRegions, id];
        
      return {
        ...prev,
        workRegions: newWorkRegions
      };
    });
  };

  const handleExperienceChange = (value: string) => {
    setFormData({
      ...formData,
      experience: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setErrors(prev => ({
        ...prev,
        email: "נא להזין כתובת אימייל תקינה"
      }));
      return;
    }
    
    if (!validatePhone(formData.phone)) {
      setErrors(prev => ({
        ...prev,
        phone: "נא להזין מספר טלפון תקין"
      }));
      return;
    }
    
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      
      // Reset form
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
        workRegions: []
      });
      
      setErrors({
        email: "",
        phone: ""
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
      
      <FieldSelector 
        fields={workFields}
        selectedFields={formData.workFields}
        onToggleField={handleWorkFieldToggle}
        label="תחומי עבודה *"
        showError={formData.workFields.length === 0}
      />
      
      {formData.showOtherWorkField && (
        <div>
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
      
      <FieldSelector 
        fields={workRegions}
        selectedFields={formData.workRegions}
        onToggleField={handleWorkRegionToggle}
        label="באיזה אזורים אתה מעוניין לעבוד *"
        showError={formData.workRegions.length === 0}
      />
      
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
          ותק *
        </label>
        <Select onValueChange={handleExperienceChange} value={formData.experience} required>
          <SelectTrigger className="bg-gray-50 border-gray-200">
            <SelectValue placeholder="בחר ותק" />
          </SelectTrigger>
          <SelectContent>
            {experienceOptions.map(option => (
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
          disabled={
            isSubmitting || 
            formData.workFields.length === 0 || 
            formData.workRegions.length === 0 || 
            !!errors.email || 
            !!errors.phone
          }
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
  );
};

export default SignupForm;
