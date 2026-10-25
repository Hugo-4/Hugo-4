import { useQuery } from '@tanstack/react-query';

import { lireSeanceEnCours } from './stockageSeance';

/** Séance commencée puis quittée (app fermée…) : Aujourd'hui propose « Reprendre la séance ». */
export function useSeanceEnCours() {
  return useQuery({ queryKey: ['seanceEnCours'], queryFn: lireSeanceEnCours });
}
