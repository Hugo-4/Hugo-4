import { useQuery } from '@tanstack/react-query';

import { api, ApiError } from '@/lib/api';

import type { NutritionJour } from './types';

/**
 * `GET /nutrition/jour` : plan du jour selon la séance prévue.
 * Le serveur répond 400 tant que le poids n'est pas renseigné : on renvoie alors `null` (état vide).
 */
export function useNutritionJour() {
  return useQuery({
    queryKey: ['nutrition', 'jour'],
    queryFn: async (): Promise<NutritionJour | null> => {
      try {
        return await api.get<NutritionJour>('/nutrition/jour');
      } catch (erreur) {
        if (erreur instanceof ApiError && erreur.status === 400) return null;
        throw erreur;
      }
    },
  });
}
