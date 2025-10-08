
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
  acceptTerms: boolean;
  acceptMarketing: boolean;
}

export interface SignupFormErrors {
  email: string;
  phone: string;
  experience?: string;
  acceptTerms?: string;
}

export interface SignupFormHandlers {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleWorkFieldToggle: (id: string) => void;
  handleWorkRegionToggle: (id: string) => void;
  handleExperienceChange: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}
