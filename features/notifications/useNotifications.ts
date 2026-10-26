import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { lireCentre, marquerLue, marquerToutLu } from './source';
import type { CentreNotifications } from './types';

export const CLE_CENTRE = ['notifications', 'centre'] as const;

/** Centre de notifications (plus récentes en premier). */
export function useCentreNotifications() {
  return useQuery({ queryKey: CLE_CENTRE, queryFn: lireCentre });
}

/** Marque des notifications comme lues dans le cache (affichage immédiat, compteur compris). */
function marquer(centre: CentreNotifications, estConcernee: (id: string) => boolean): CentreNotifications {
  const notifications = centre.notifications.map((n) => (estConcernee(n.id) ? { ...n, lue: true } : n));
  return { notifications, non_lues: notifications.filter((n) => !n.lue).length };
}

function useMarquer<T>(envoyer: (variables: T) => Promise<void>, estConcernee: (variables: T) => (id: string) => boolean) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: envoyer,
    onMutate: async (variables: T) => {
      await queryClient.cancelQueries({ queryKey: CLE_CENTRE });
      const avant = queryClient.getQueryData<CentreNotifications>(CLE_CENTRE);
      if (avant) queryClient.setQueryData(CLE_CENTRE, marquer(avant, estConcernee(variables)));
      return { avant };
    },
    onError: (_erreur, _variables, contexte) => {
      if (contexte?.avant) queryClient.setQueryData(CLE_CENTRE, contexte.avant);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CLE_CENTRE }),
  });
}

export function useMarquerLue() {
  return useMarquer<string>(marquerLue, (cible) => (id) => id === cible);
}

export function useMarquerToutLu() {
  return useMarquer<void>(marquerToutLu, () => () => true);
}
