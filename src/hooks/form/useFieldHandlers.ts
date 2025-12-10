
import { SignupFormData, SignupFormErrors } from "@/types/signupForm";
import { workRegionsHierarchy } from "@/components/cta/data/workRegionsHierarchy";

export const useFieldHandlers = (
  formData: SignupFormData,
  setFormData: (data: SignupFormData) => void,
  setErrors: React.Dispatch<React.SetStateAction<SignupFormErrors>>
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

  const handleMainRegionToggle = (mainRegionId: string) => {
    const region = workRegionsHierarchy.find(r => r.id === mainRegionId);
    if (!region) return;
    
    const subAreaIds = region.subAreas.map(sa => sa.id);
    const allSelected = subAreaIds.every(id => formData.workRegions.includes(id));
    
    if (allSelected) {
      // הסר את כל התתי-אזורים
      setFormData({
        ...formData,
        workRegions: formData.workRegions.filter(id => !subAreaIds.includes(id))
      });
    } else {
      // הוסף את כל התתי-אזורים
      const existingOtherRegions = formData.workRegions.filter(id => !subAreaIds.includes(id));
      setFormData({
        ...formData,
        workRegions: [...existingOtherRegions, ...subAreaIds]
      });
    }
  };

  const handleExperienceChange = (value: string) => {
    // Clear experience error when changed
    setErrors(prev => ({
      ...prev,
      experience: ""
    }));
    
    setFormData({
      ...formData,
      experience: value
    });
  };

  const MAX_PROFESSIONS = 2;
  
  const handleProfessionToggle = (professionId: string) => {
    // Clear professions and otherProfession errors when changed
    setErrors(prev => ({
      ...prev,
      professions: "",
      otherProfession: ""
    }));
    
    const existingIndex = formData.professions.findIndex(p => p.professionId === professionId);
    
    if (existingIndex >= 0) {
      // Remove profession - also clear otherProfession if removing "other-profession"
      const updatedFormData = {
        ...formData,
        professions: formData.professions.filter(p => p.professionId !== professionId)
      };
      
      if (professionId === "other-profession") {
        updatedFormData.otherProfession = "";
      }
      
      setFormData(updatedFormData);
    } else {
      // Add profession with empty specializations - only if under max
      if (formData.professions.length >= MAX_PROFESSIONS) {
        return; // Don't add more than MAX_PROFESSIONS
      }
      
      setFormData({
        ...formData,
        professions: [...formData.professions, { professionId, specializations: [] }]
      });
    }
  };

  const handleSubSpecializationToggle = (professionId: string, specId: string) => {
    // Clear professions error when changed
    setErrors(prev => ({
      ...prev,
      professions: ""
    }));
    
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

  const handleOtherProfessionChange = (value: string) => {
    // Clear otherProfession error when typing
    setErrors(prev => ({
      ...prev,
      otherProfession: ""
    }));
    
    setFormData({
      ...formData,
      otherProfession: value
    });
  };

  return {
    handleWorkFieldToggle,
    handleWorkRegionToggle,
    handleMainRegionToggle,
    handleExperienceChange,
    handleProfessionToggle,
    handleSubSpecializationToggle,
    handleOtherProfessionChange
  };
};
