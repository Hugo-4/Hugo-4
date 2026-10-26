import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useConsentementSante } from '@/features/checkin/useConsentementSante';

import { CLES } from './constantes';
import { lireNutrition, modifierNutrition } from './source';
import type { PreferencesNutrition } from './types';

/**
 * Préférences de nutrition (route manquante : source fictive). Les allergies sont une donnée de santé :
 * sans consentement, elles ne sont ni affichées ni envoyées.
 */
export function useNutrition() {
  const consentement = useConsentementSante();
  const avecSante = consentement.data === true;
  const requete = useQuery({
    queryKey: [...CLES.nutrition, avecSante],
    enabled: !consentement.isPending,
    queryFn: () => lireNutrition(avecSante),
  });
  const donnees = requete.data && !avecSante ? { ...requete.data, allergies: [] } : requete.data;
  return { requete, donnees, avecSante };
}

export function useModifierNutrition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (modification: Partial<PreferencesNutrition>) => modifierNutrition(modification),
    onMutate: async (modification) => {
      await queryClient.cancelQueries({ queryKey: CLES.nutrition });
      const avant = queryClient.getQueriesData<PreferencesNutrition>({ queryKey: CLES.nutrition });
      queryClient.setQueriesData<PreferencesNutrition>({ queryKey: CLES.nutrition }, (actuelles) =>
        actuelles ? { ...actuelles, ...modification } : actuelles,
      );
      return { avant };
    },
    onError: (_erreur, _modification, contexte) => {
      contexte?.avant.forEach(([cle, valeur]) => queryClient.setQueryData(cle, valeur));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CLES.nutrition }),
  });
}
