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
      // Fetch in two batches to bypass Supabase 1000-row limit per query
      const firstPromise = supabase
        .from("israeli_settlements")
        .select("id, settlement_name")
        .order("settlement_name")
        .range(0, 999);

      const secondPromise = supabase
        .from("israeli_settlements")
        .select("id, settlement_name")
        .order("settlement_name")
        .range(1000, 1999);

      const [firstRes, secondRes] = await Promise.all([firstPromise, secondPromise]);

      if (firstRes.error) throw firstRes.error;
      if (secondRes.error) throw secondRes.error;

      const first = (firstRes.data ?? []) as City[];
      const second = (secondRes.data ?? []) as City[];

      // Combine all cities (~1275 total)
      const all = [...first, ...second];

      // Remove duplicates by id (safety measure)
      const uniqueById = new Map<string, City>();
      for (const city of all) {
        uniqueById.set(city.id, city);
      }

      return Array.from(uniqueById.values());
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours cache
  });
};
