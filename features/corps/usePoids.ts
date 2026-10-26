import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CLE_QUESTIONNAIRE } from '@/features/questionnaire/useQuestionnaire';
import { api } from '@/lib/api';

import type { HistoriquePoids, MomentPesee } from './types';

export const CLE_POIDS = ['corps', 'poids'] as const;

/** Historique du poids (60 jours) et tendance calculée par la base. */
export function usePoids(actif: boolean) {
  return useQuery({ queryKey: CLE_POIDS, enabled: actif, queryFn: () => api.get<HistoriquePoids>('/poids') });
}

/**
 * Nouvelle pesée : `POST /poids` l'ajoute à l'historique et met à jour `user_profiles.poids_kg`.
 * Le plan nutrition du jour (qui a besoin du poids) est relu ensuite.
 */
export function useEnregistrerPoids() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pesee: { poids_kg: number; moment?: MomentPesee }) => api.post('/poids', pesee),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: CLE_POIDS }),
        queryClient.invalidateQueries({ queryKey: CLE_QUESTIONNAIRE }),
        queryClient.invalidateQueries({ queryKey: ['nutrition'] }),
        queryClient.invalidateQueries({ queryKey: ['profil'] }),
      ]),
  });
}
