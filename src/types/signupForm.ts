
export interface ProfessionSelection {
  professionId: string;
  specializations: string[];
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  businessLicenseNumber: string;
  professions: ProfessionSelection[];
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
  otherProfession?: string;
  otherSpecializations?: Record<string, string>;
}

export interface SignupFormErrors {
  email: string;
  phone: string;
  experience?: string;
  acceptTerms?: string;
  businessLicenseNumber?: string;
  professions?: string;
}

export interface SignupFormHandlers {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleWorkFieldToggle: (id: string) => void;
  handleWorkRegionToggle: (id: string) => void;
  handleExperienceChange: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}
