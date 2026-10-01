import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type StatutCompte = {
  prenom: string | null;
  /** `false` tant que le questionnaire d'inscription n'est pas terminé. */
  onboardingComplete: boolean;
};

/**
 * Lit la ligne de l'athlète dans `users` (RLS : uniquement la sienne).
 * La ligne est créée automatiquement par un déclencheur à la création du compte.
 */
async function chargerStatut(userId: string): Promise<StatutCompte> {
  const { data, error } = await supabase
    .from('users')
    .select('prenom, onboarding_complete')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return { prenom: data?.prenom ?? null, onboardingComplete: data?.onboarding_complete ?? false };
}

export function useStatutCompte(userId: string | undefined) {
  return useQuery({
    queryKey: ['statutCompte', userId],
    queryFn: () => chargerStatut(userId as string),
    enabled: Boolean(userId),
  });
}
