import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useConsentementSante } from '@/features/checkin/useConsentementSante';
import { api } from '@/lib/api';

import { CATEGORIES_MEMOIRE, CATEGORIES_SANTE, CLES } from './constantes';
import type { ModificationSouvenir, Souvenir } from './types';

/** GET /memoire : ce que le coach a retenu (actifs d'abord, puis par importance). */
export function useMemoire() {
  return useQuery({ queryKey: CLES.memoire, queryFn: () => api.get<Souvenir[]>('/memoire') });
}

export type GroupeSouvenirs = { categorie: string; souvenirs: Souvenir[] };

/**
 * Souvenirs affichables, rangés par catégorie. Sans consentement santé (ou tant qu'il n'est pas connu),
 * les catégories de santé (douleur, historique) sont retirées avant tout affichage.
 */
export function useSouvenirsVisibles() {
  const memoire = useMemoire();
  const consentement = useConsentementSante();
  const avecSante = consentement.data === true;
  const visibles = (memoire.data ?? []).filter((s) => avecSante || !CATEGORIES_SANTE.includes(s.categorie));
  const ordre = (categorie: string) => {
    const index = (CATEGORIES_MEMOIRE as readonly string[]).indexOf(categorie);
    return index === -1 ? CATEGORIES_MEMOIRE.length : index;
  };
  const groupes: GroupeSouvenirs[] = [];
  for (const souvenir of [...visibles].sort((a, b) => ordre(a.categorie) - ordre(b.categorie))) {
    const groupe = groupes.find((g) => g.categorie === souvenir.categorie);
    if (groupe) groupe.souvenirs.push(souvenir);
    else groupes.push({ categorie: souvenir.categorie, souvenirs: [souvenir] });
  }
  return { memoire, avecSante, visibles, groupes };
}

/** PATCH /memoire/:id : corriger le texte, confirmer, désactiver ou réactiver. */
export function useModifierSouvenir() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, modification }: { id: string; modification: ModificationSouvenir }) =>
      api.patch<Souvenir>(`/memoire/${id}`, modification),
    onMutate: async ({ id, modification }) => {
      await queryClient.cancelQueries({ queryKey: CLES.memoire });
      const avant = queryClient.getQueryData<Souvenir[]>(CLES.memoire);
      if (avant) queryClient.setQueryData(CLES.memoire, avant.map((s) => (s.id === id ? { ...s, ...modification } : s)));
      return { avant };
    },
    onError: (_erreur, _variables, contexte) => {
      if (contexte?.avant) queryClient.setQueryData(CLES.memoire, contexte.avant);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CLES.memoire }),
  });
}

/** DELETE /memoire/:id : suppression définitive (droit à l'effacement). */
export function useSupprimerSouvenir() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ supprime: boolean }>(`/memoire/${id}`),
    onSuccess: (_reponse, id) => {
      queryClient.setQueryData<Souvenir[]>(CLES.memoire, (liste) => liste?.filter((s) => s.id !== id));
      return queryClient.invalidateQueries({ queryKey: CLES.memoire });
    },
  });
}
