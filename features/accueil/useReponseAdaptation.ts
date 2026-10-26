import { useMutation, useQueryClient } from '@tanstack/react-query';

import { invaliderSeances } from '@/features/programme/cles';
import { api } from '@/lib/api';

type Reponse = { id: string; choix: 'accepter' | 'refuser' };

/** Accepte ou refuse l'adaptation proposée par le coach (ex. semaine allégée), puis recharge l'accueil et le programme. */
export function useReponseAdaptation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, choix }: Reponse) => api.post(`/programme/adaptations/${id}/${choix}`),
    // Même rafraîchissement que depuis l'historique : accueil, calendrier, programme (et ses adaptations), Progrès.
    onSuccess: () => invaliderSeances(queryClient),
  });
}
