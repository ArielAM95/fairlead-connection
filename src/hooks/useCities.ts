import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface City {
  id: string;
  settlement_name: string;
}

export const useCities = () => {
  return useQuery({
    queryKey: ["israeli_cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("israeli_settlements")
        .select("id, settlement_name")
        .order("settlement_name")
        .range(0, 2000); // Fetch all cities (1275 total)

      if (error) throw error;
      return data as City[];
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours cache
  });
};
