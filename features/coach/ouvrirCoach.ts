import { router } from 'expo-router';

/**
 * Contexte transmis au Coach quand on l'ouvre depuis une séance (FRONTEND.md §3.3) :
 * « Modifier avec le coach » (séance du jour) ou « Remplacer » (exercice en séance).
 */
export type ContexteCoach =
  | { type: 'seance'; programmeSeanceId: string; titre: string }
  | { type: 'exercice'; programmeSeanceId: string; exerciceSlug: string; nom: string };

/** Paramètres de route : le contexte voyage en JSON dans `contexte`. */
export function ouvrirCoach(contexte?: ContexteCoach) {
  router.navigate({ pathname: '/coach', params: contexte ? { contexte: JSON.stringify(contexte) } : {} });
}

export function lireContexte(brut: string | string[] | undefined): ContexteCoach | null {
  if (typeof brut !== 'string') return null;
  try {
    const c = JSON.parse(brut) as ContexteCoach;
    return c && (c.type === 'seance' || c.type === 'exercice') ? c : null;
  } catch {
    return null;
  }
}
