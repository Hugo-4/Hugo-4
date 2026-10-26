import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import { invaliderSeances } from './cles';

export type ChoixProposition = 'accepter' | 'refuser';

/**
 * Réponse à une adaptation proposée par le coach : `POST /programme/adaptations/:id/accepter` ou `/refuser`
 * (routes/athlete.js). Ensuite, l'historique, le calendrier, Aujourd'hui et Progrès se rafraîchissent.
 */
export function useReponseProposition(adaptationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (choix: ChoixProposition) => api.post(`/programme/adaptations/${adaptationId}/${choix}`),
    // « Déjà traitée » renvoie une erreur : l'historique relu montre alors le vrai statut.
    onSettled: () => invaliderSeances(queryClient),
  });
}
