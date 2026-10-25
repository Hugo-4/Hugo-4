/**
 * Pastilles orange de la barre d'onglets (FRONTEND.md §3.1) : Coach (une proposition attend une réponse),
 * Profil (un consentement ou un réglage manque). Rempli à l'étape Notifications.
 */
export function useBadges(): { coach: boolean; profil: boolean } {
  return { coach: false, profil: false };
}
