import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import { CLES } from './constantes';
import type { CreneauSaisi, Disponibilite } from './types';

/** GET /disponibilites : créneaux actifs (jour 1-7 × matin / midi / soir). */
export function useDisponibilites() {
  return useQuery({
    queryKey: CLES.disponibilites,
    queryFn: async () => {
      const lignes = await api.get<Disponibilite[]>('/disponibilites');
      return lignes.filter((l) => l.actif !== false);
    },
  });
}

/** Une disponibilité telle que le serveur l'attend (« HH:MM » : la base peut renvoyer les secondes). */
export function versCreneauSaisi(d: Pick<Disponibilite, 'jour' | 'creneau' | 'heure_debut' | 'duree_max_min' | 'lieu_id'>): CreneauSaisi {
  return {
    jour: d.jour,
    creneau: d.creneau,
    duree_max_min: d.duree_max_min,
    ...(d.heure_debut ? { heure_debut: d.heure_debut.slice(0, 5) } : {}),
    ...(d.lieu_id ? { lieu_id: d.lieu_id } : {}),
  };
}

/**
 * PUT /disponibilites : remplace tous les créneaux (un seul par jour et par moment).
 * Le serveur recale ensuite les rappels ; le programme et l'accueil sont rechargés.
 */
export function useEnregistrerDisponibilites() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (creneaux: CreneauSaisi[]) => api.put<{ creneaux: number }>('/disponibilites', { creneaux }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: CLES.disponibilites }),
        queryClient.invalidateQueries({ queryKey: ['accueil'] }),
        queryClient.invalidateQueries({ queryKey: ['notifications'] }),
      ]),
  });
}
