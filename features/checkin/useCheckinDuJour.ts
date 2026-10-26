import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import type { CheckinDuJour } from '@/features/accueil/types';
import { supabase } from '@/lib/supabase';

import { dateDuJour } from './dateDuJour';

export const cleCheckin = (userId: string | undefined) => ['checkin', userId, dateDuJour()] as const;

/** Check-in du jour de l'athlète (RLS : uniquement le sien), `null` s'il n'est pas encore fait. */
export function useCheckinDuJour() {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: cleCheckin(userId),
    enabled: Boolean(userId),
    queryFn: async (): Promise<CheckinDuJour | null> => {
      const { data, error } = await supabase
        .from('checkins_forme')
        .select(
          'id, score_forme, recommandation, recommandation_raison, energie, sommeil_ressenti, courbatures, motivation, stress_ressenti, douleurs, cause_ponctuelle, duree_disponible_min, lieu_id',
        )
        .eq('user_id', userId as string)
        .eq('date_checkin', dateDuJour())
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}
