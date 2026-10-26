import type { CodeReponseRapide } from './types';

/**
 * Réponses rapides (FRONTEND.md §4.4). « J'ai mal quelque part » est une donnée de santé :
 * proposée seulement si l'athlète a donné son consentement santé.
 */
export const REPONSES_RAPIDES: { code: CodeReponseRapide; sante: boolean }[] = [
  { code: 'duree_30', sante: false },
  { code: 'fatigue', sante: false },
  { code: 'sans_salle', sante: false },
  { code: 'decaler_demain', sante: false },
  { code: 'douleur', sante: true },
];

/** Sur l'objectif principal, la seule réponse rapide utile : demander des étapes intermédiaires. */
/**
 * Sur l'objectif, la seule réponse rapide utile : demander des étapes intermédiaires. Quand le check-in du jour
 * conseille d'alléger (recommandation calculée par la base), « Adapte ma séance à ma forme » passe en premier.
 */
export function reponsesRapidesVisibles(consentementSante: boolean, surObjectif = false, formeBasse = false): CodeReponseRapide[] {
  if (surObjectif) return ['etapes_objectif'];
  const codes = REPONSES_RAPIDES.filter((r) => consentementSante || !r.sante).map((r) => r.code);
  return formeBasse ? ['forme_du_jour', ...codes] : codes;
}
