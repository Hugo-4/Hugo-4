import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import { CLE_ACCUEIL } from './useAccueil';

type Reponse = { id: string; choix: 'accepter' | 'refuser' };

/** Accepte ou refuse l'adaptation proposée par le coach (ex. semaine allégée), puis recharge l'accueil. */
export function useReponseAdaptation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, choix }: Reponse) => api.post(`/programme/adaptations/${id}/${choix}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLE_ACCUEIL }),
  });
}
