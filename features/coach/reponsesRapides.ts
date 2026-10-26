import type { CodeReponseRapide } from './types';

/**
 * Réponses rapides (FRONTEND.md §4.4). « J'ai mal quelque part » est une donnée de santé :
 * proposée seulement si l'athlète a donné son consentement santé.
 */
export const REPONSES_RAPIDES: { code: CodeReponseRapide; sante: boolean }[] = [
  { code: 'duree_30', sante: false },
  { code: 'sans_salle', sante: false },
  { code: 'decaler_demain', sante: false },
  { code: 'douleur', sante: true },
];

export function reponsesRapidesVisibles(consentementSante: boolean): CodeReponseRapide[] {
  return REPONSES_RAPIDES.filter((r) => consentementSante || !r.sante).map((r) => r.code);
}
