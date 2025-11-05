import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Specialization {
  id: string;
  profession_id: string;
  specialization_id: string;
  label: string;
  display_order: number;
}

export const useSpecializations = (professionIds: string[]) => {
  return useQuery({
    queryKey: ["specializations", professionIds],
    queryFn: async () => {
      if (professionIds.length === 0) return [];

      const { data, error } = await supabase
        .from("profession_specializations")
        .select("*")
        .in("profession_id", professionIds)
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data as Specialization[];
    },
    enabled: professionIds.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
