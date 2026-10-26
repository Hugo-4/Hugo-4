import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import { CLES } from './constantes';
import type { ModificationPreferences, Preferences } from './types';

/** GET /preferences : variété, moment préféré, style de coaching, notifications. */
export function usePreferences() {
  return useQuery({ queryKey: CLES.preferences, queryFn: () => api.get<Preferences>('/preferences') });
}

/** Fusionne une modification dans les préférences en cache (affichage immédiat). */
function fusionner(actuelles: Preferences, m: ModificationPreferences): Preferences {
  return {
    ...actuelles,
    ...(m.preference_variete !== undefined ? { preference_variete: m.preference_variete } : {}),
    ...(m.moment_prefere !== undefined ? { moment_prefere: m.moment_prefere } : {}),
    ...(m.style_coaching ? { style_coaching: { ...actuelles.style_coaching, ...m.style_coaching } } : {}),
    ...(m.notifications ? { notifications: { ...actuelles.notifications, ...m.notifications } } : {}),
  };
}

/**
 * PATCH /preferences, enregistré dès qu'un réglage change (le serveur fusionne les objets).
 * L'écran se met à jour tout de suite ; en cas d'échec, l'ancienne valeur revient.
 */
export function useModifierPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (m: ModificationPreferences) => api.patch<Preferences>('/preferences', m),
    onMutate: async (m) => {
      await queryClient.cancelQueries({ queryKey: CLES.preferences });
      const avant = queryClient.getQueryData<Preferences>(CLES.preferences);
      if (avant) queryClient.setQueryData(CLES.preferences, fusionner(avant, m));
      return { avant };
    },
    onError: (_erreur, _m, contexte) => {
      if (contexte?.avant) queryClient.setQueryData(CLES.preferences, contexte.avant);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CLES.preferences }),
  });
}
