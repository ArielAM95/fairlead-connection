
import { SignupFormData } from "@/types/signupForm";

export const useFieldHandlers = (
  formData: SignupFormData,
  setFormData: (data: SignupFormData) => void,
) => {
  const handleWorkFieldToggle = (id: string) => {
    setFormData({
      ...formData,
      workFields: formData.workFields.includes(id)
        ? formData.workFields.filter(field => field !== id)
        : [...formData.workFields, id],
      showOtherWorkField: id === "other"
        ? !formData.workFields.includes("other")
        : formData.workFields.includes("other") || id === "other",
      otherWorkField: id === "other" && !formData.workFields.includes("other") 
        ? formData.otherWorkField 
        : id === "other" ? "" : formData.otherWorkField
    });
  };

  const handleWorkRegionToggle = (id: string) => {
    setFormData({
      ...formData,
      workRegions: formData.workRegions.includes(id)
        ? formData.workRegions.filter(region => region !== id)
        : [...formData.workRegions, id]
    });
  };

  const handleExperienceChange = (value: string) => {
    setFormData({
      ...formData,
      experience: value
    });
  };

  return {
    handleWorkFieldToggle,
    handleWorkRegionToggle,
    handleExperienceChange
  };
};
