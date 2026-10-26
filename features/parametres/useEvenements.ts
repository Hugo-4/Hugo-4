import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import { CLES } from './constantes';
import type { Evenement } from './types';

/** Date du jour « AAAA-MM-JJ » en heure locale. */
export function aujourdhuiIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** GET /evenements, sans les annulés. */
export function useEvenements() {
  return useQuery({
    queryKey: CLES.evenements,
    // Même clé que l'onglet Programme : le cache garde la liste brute du serveur, le filtre se fait à la lecture.
    queryFn: () => api.get<Evenement[]>('/evenements'),
    select: (liste) => liste.filter((e) => e.statut !== 'annule'),
  });
}

/** Compétitions à venir (la plus proche en premier) et passées (la plus récente en premier). */
export function trierEvenements(evenements: Evenement[]) {
  const jour = aujourdhuiIso();
  const fin = (e: Evenement) => e.date_fin ?? e.date_evenement;
  return {
    aVenir: evenements
      .filter((e) => fin(e) >= jour && e.statut !== 'termine')
      .sort((a, b) => a.date_evenement.localeCompare(b.date_evenement)),
    passes: evenements
      .filter((e) => fin(e) < jour || e.statut === 'termine')
      .sort((a, b) => b.date_evenement.localeCompare(a.date_evenement)),
  };
}
