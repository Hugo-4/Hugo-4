import { useConsentementsAthlete } from '@/features/profil/useProfil';

import { useDisponibilites } from './useDisponibilites';

export type ReglageManquant = 'cgu' | 'disponibilites';

/**
 * Réglages essentiels manquants (pastille orange de l'onglet Profil, FRONTEND.md §3.1) :
 * conditions d'utilisation jamais acceptées, aucun créneau de disponibilité.
 * Une donnée pas encore chargée ou en erreur ne déclenche rien.
 */
export function useReglagesManquants(): ReglageManquant[] {
  const consentements = useConsentementsAthlete();
  const disponibilites = useDisponibilites();
  const manquants: ReglageManquant[] = [];
  if (consentements.data && consentements.data.cgu?.accorde !== true) manquants.push('cgu');
  if (disponibilites.data && disponibilites.data.length === 0) manquants.push('disponibilites');
  return manquants;
}
