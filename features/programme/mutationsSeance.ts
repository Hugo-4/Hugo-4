import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import { invaliderSeances } from './cles';
import type { CategorieManque, ReponseAdapter, ReponseManquee } from './types';

/**
 * `POST /programme/adapter` (catégorie « deplacer »). Le serveur peut refuser sans erreur HTTP
 * (`applique: false` + `raison_refus`) : c'est l'écran qui l'affiche.
 */
export function useDeplacerSeance(programmeSeanceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (date: string) =>
      api.post<ReponseAdapter>('/programme/adapter', {
        categorie: 'deplacer',
        programme_seance_id: programmeSeanceId,
        changements: { date },
      }),
    onSuccess: (reponse) => (reponse.applique ? invaliderSeances(queryClient) : undefined),
  });
}

export type SaisieManquee = { categorie: CategorieManque; raison: string; reporter: boolean };

/** `POST /programme/seances/:id/manquee` : pourquoi, et faut-il essayer de la replacer cette semaine. */
export function useSeanceManquee(programmeSeanceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categorie, raison, reporter }: SaisieManquee) =>
      api.post<ReponseManquee>(`/programme/seances/${programmeSeanceId}/manquee`, {
        categorie,
        ...(raison.trim() ? { raison: raison.trim() } : {}),
        reporter,
      }),
    onSuccess: () => invaliderSeances(queryClient),
  });
}
