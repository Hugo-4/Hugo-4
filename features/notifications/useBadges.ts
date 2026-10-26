import { usePropositionEnAttente } from '@/features/coach/usePropositionEnAttente';
import { useReglagesManquants } from '@/features/parametres/useReglagesManquants';

import { useCentreNotifications } from './useNotifications';

/**
 * Pastilles orange de la barre d'onglets (FRONTEND.md §3.1) :
 * - Coach : une proposition du coach attend une réponse (dans la conversation en cache, ou notification non lue
 *   de type `proposition_coach`) ;
 * - Profil : un consentement obligatoire (CGU) ou un réglage essentiel (aucune disponibilité) manque.
 * Rien ne s'affiche tant que les données ne sont pas chargées (ni en cas d'erreur).
 */
export function useBadges(): { coach: boolean; profil: boolean } {
  const centre = useCentreNotifications();
  const manquants = useReglagesManquants();
  const propositionCoach = usePropositionEnAttente();
  const notifie = centre.data?.notifications.some((n) => n.type === 'proposition_coach' && !n.lue) ?? false;
  const coach = propositionCoach || notifie;
  return { coach, profil: manquants.length > 0 };
}
