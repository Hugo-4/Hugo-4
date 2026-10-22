import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

export type LieuAthlete = { id: string; nom: string; par_defaut: boolean };

/** Lieux d'entraînement actifs de l'athlète (table `lieux_athlete`). */
export function useLieux() {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['lieux', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<LieuAthlete[]> => {
      const { data, error } = await supabase
        .from('lieux_athlete')
        .select('id, nom, par_defaut')
        .eq('user_id', userId as string)
        .eq('actif', true)
        .order('par_defaut', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
