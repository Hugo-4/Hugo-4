import type { QueryClient } from '@tanstack/react-query';

import { CLE_ACCUEIL } from '@/features/accueil/useAccueil';

/**
 * Clés TanStack Query du domaine Programme. `['programme', 'actif']` est partagée avec Aujourd'hui
 * (features/accueil/useProgrammeActif.ts) : même route, même cache.
 */
export const cles = {
  programme: ['programme', 'actif'] as const,
  seance: (id: string) => ['programme', 'seance', id] as const,
  adaptations: ['programme', 'adaptations'] as const,
  calendrier: (mois: string) => ['calendrier', mois] as const,
  legende: ['legende'] as const,
  evenements: ['evenements'] as const,
  exercice: (slug: string) => ['exercice', slug] as const,
};

/**
 * Après un déplacement, une séance manquée ou une proposition acceptée / refusée : tout ce qui montre des séances
 * se rafraîchit, dont l'historique des adaptations (sous `['programme']`) et Progrès (assiduité, régularité…).
 */
export function invaliderSeances(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ['calendrier'] }),
    queryClient.invalidateQueries({ queryKey: ['programme'] }),
    queryClient.invalidateQueries({ queryKey: CLE_ACCUEIL }),
    queryClient.invalidateQueries({ queryKey: ['nutrition'] }),
    queryClient.invalidateQueries({ queryKey: ['progres'] }),
  ]);
}

/** Après une compétition créée, modifiée ou supprimée. */
export function invaliderEvenements(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: cles.evenements }),
    queryClient.invalidateQueries({ queryKey: ['calendrier'] }),
    queryClient.invalidateQueries({ queryKey: cles.programme }),
    queryClient.invalidateQueries({ queryKey: CLE_ACCUEIL }),
  ]);
}
