import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

import { CLES } from './constantes';
import { lireCredits } from './source';
import type { Offre } from './types';

const OFFRES: readonly string[] = ['free', 'premium', 'pro', 'coach'];

/** Offre actuelle (`users.abonnement`, RLS : uniquement la ligne de l'athlète). */
export function useOffre() {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['profil', 'offre', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Offre> => {
      const { data, error } = await supabase.from('users').select('abonnement').eq('id', userId as string).maybeSingle();
      if (error) throw error;
      const offre = data?.abonnement as string | undefined;
      return offre && OFFRES.includes(offre) ? (offre as Offre) : 'free';
    },
  });
}

/** Crédits du mois (route manquante : source fictive tant que `PARAMETRES_FICTIF` vaut true). */
export function useCredits(offre: Offre | undefined) {
  return useQuery({
    queryKey: [...CLES.credits, offre],
    enabled: Boolean(offre),
    queryFn: () => lireCredits(offre as Offre),
  });
}
