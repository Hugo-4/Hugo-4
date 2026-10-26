import { cleExercice, type EtatSeance } from './etat';
import type { ExerciceSeance } from './types';

/**
 * Valeurs préremplies d'une série : rien n'est décidé par l'app, on reprend dans l'ordre
 * la charge conseillée par le serveur, la série précédente, puis la prescription.
 */
export type Mesure = 'reps' | 'duree';

/** `rpe` : `null` tant que l'athlète ne l'a pas donné et qu'aucune cible n'est prescrite (l'app n'en invente pas). */
export type Saisie = { charge: number | null; reps: number; duree: number; rpe: number | null };

/** Premier nombre d'une prescription de répétitions (« 8-10 » → 8). */
export function repsCible(reps: ExerciceSeance['reps']): number | null {
  if (typeof reps === 'number') return reps;
  const n = parseInt(String(reps ?? ''), 10);
  return Number.isFinite(n) ? n : null;
}

export function mesureDe(e: ExerciceSeance): Mesure {
  return repsCible(e.reps) === null && e.duree_s ? 'duree' : 'reps';
}

/** Pas des boutons − / + : 1 kg pour les haltères et kettlebells, 2,5 kg sinon. */
export function pasCharge(e: ExerciceSeance): number {
  return /haltere|kettlebell/.test(e.exercice.slug) ? 1 : 2.5;
}

export function saisieInitiale(etat: EtatSeance, e: ExerciceSeance): Saisie {
  const cle = cleExercice(e);
  const precedente = etat.series[cle]?.at(-1);
  const conseillee = etat.suggestions[cle]?.charge_kg;
  const charge = conseillee ?? precedente?.charge_kg ?? e.charge_kg ?? null;
  return {
    charge,
    reps: precedente?.reps ?? repsCible(e.reps) ?? 10,
    duree: precedente?.duree_sec ?? e.duree_s ?? 30,
    rpe: precedente?.rpe ?? (e.rpe_cible != null ? Math.round(e.rpe_cible) : null),
  };
}
