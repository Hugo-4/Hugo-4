import { router } from 'expo-router';

/**
 * Contexte transmis au Coach quand on l'ouvre depuis une séance (FRONTEND.md §3.3) :
 * « Modifier avec le coach » (séance du jour), « Remplacer » (exercice en séance) ou les étapes de l'objectif.
 */
export type ContexteCoach =
  | { type: 'seance'; programmeSeanceId: string; titre: string }
  | { type: 'exercice'; programmeSeanceId: string; exerciceSlug: string; nom: string }
  /** « Construire avec le coach » les étapes vers l'objectif principal (Programme, étape 12). */
  | { type: 'objectif'; titre: string; evenementId: string | null };

/** Paramètres de route : le contexte voyage en JSON dans `contexte`. */
export function ouvrirCoach(contexte?: ContexteCoach) {
  router.navigate({ pathname: '/coach', params: contexte ? { contexte: JSON.stringify(contexte) } : {} });
}

/** Depuis une séance en cours : le Coach s'ouvre en modale par-dessus la séance, le retour y ramène. */
export function ouvrirCoachEnSeance(contexte?: ContexteCoach) {
  router.push({ pathname: '/coach-seance', params: contexte ? { contexte: JSON.stringify(contexte) } : {} });
}

export function lireContexte(brut: string | string[] | undefined): ContexteCoach | null {
  if (typeof brut !== 'string') return null;
  try {
    const c = JSON.parse(brut) as ContexteCoach;
    return c && (c.type === 'seance' || c.type === 'exercice' || c.type === 'objectif') ? c : null;
  } catch {
    return null;
  }
}
