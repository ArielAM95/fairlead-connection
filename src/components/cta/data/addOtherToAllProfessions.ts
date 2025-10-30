// Helper script to add "other" to all professions
// This runs once to update the professionsAndSpecializations array

import { professionsWithSpecializations } from './professionsAndSpecializations';

// Add "other" option to all professions that have specializations
export const updateProfessionsWithOther = () => {
  return professionsWithSpecializations.map(profession => {
    if (profession.specializations.length > 0) {
      const hasOther = profession.specializations.some(spec => spec.id === "other");
      if (!hasOther) {
        return {
          ...profession,
          specializations: [
            ...profession.specializations,
            { id: "other", label: "אחר" }
          ]
        };
      }
    }
    return profession;
  });
};
