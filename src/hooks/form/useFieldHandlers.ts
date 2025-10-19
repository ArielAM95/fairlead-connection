
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

  const handleProfessionToggle = (professionId: string) => {
    const existingIndex = formData.professions.findIndex(p => p.professionId === professionId);
    
    if (existingIndex >= 0) {
      // Remove profession
      setFormData({
        ...formData,
        professions: formData.professions.filter(p => p.professionId !== professionId)
      });
    } else {
      // Add profession with empty specializations
      setFormData({
        ...formData,
        professions: [...formData.professions, { professionId, specializations: [] }]
      });
    }
  };

  const handleSubSpecializationToggle = (professionId: string, specId: string) => {
    setFormData({
      ...formData,
      professions: formData.professions.map(prof => {
        if (prof.professionId === professionId) {
          const hasSpec = prof.specializations.includes(specId);
          return {
            ...prof,
            specializations: hasSpec
              ? prof.specializations.filter(s => s !== specId)
              : [...prof.specializations, specId]
          };
        }
        return prof;
      })
    });
  };

  return {
    handleWorkFieldToggle,
    handleWorkRegionToggle,
    handleExperienceChange,
    handleProfessionToggle,
    handleSubSpecializationToggle
  };
};
