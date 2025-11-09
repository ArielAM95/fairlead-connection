import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Profession {
  id: string;
  profession_id: string;
  label: string;
  display_order: number;
  commission_category?: 'A' | 'B' | 'C' | 'D_contractor' | 'D_hvac';
  client_retention_days?: 30 | 60 | 180;
  commission_explanation?: string;
}

export const useProfessions = () => {
  return useQuery({
    queryKey: ["professions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professions")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data as Profession[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
