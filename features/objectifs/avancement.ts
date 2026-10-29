import type { TestAthlete } from '@/features/progres/types';

import type { SousObjectif } from './types';

/** Dernière valeur mesurée de l'indicateur suivi (test du bon type et du bon exercice). */
export function valeurActuelle(etape: SousObjectif, tests: TestAthlete[]): TestAthlete | null {
  if (!etape.indicateur) return null;
  return (
    tests.find((t) => t.types_tests?.slug === etape.indicateur && (!etape.exercice_slug || t.exercices?.slug === etape.exercice_slug)) ?? null
  );
}

/**
 * Part du chemin parcourue entre la valeur de départ et la cible (0 à 1), d'après la dernière mesure.
 * Marche dans les deux sens (temps qui baisse, charge qui monte) ; `null` sans départ, cible ou mesure.
 */
export function partParcourue(etape: SousObjectif, actuelle: number | null): number | null {
  const { valeur_depart: depart, valeur_cible: cible } = etape;
  if (depart === null || cible === null || actuelle === null || depart === cible) return null;
  return Math.min(Math.max((actuelle - depart) / (cible - depart), 0), 1);
}

/** Les étapes proposées par le coach d'abord, puis les actives et les atteintes, par date. */
export function trierEtapes(etapes: SousObjectif[]): { proposees: SousObjectif[]; frise: SousObjectif[] } {
  return {
    proposees: etapes.filter((e) => e.statut === 'propose'),
    frise: etapes.filter((e) => e.statut === 'actif' || e.statut === 'atteint'),
  };
}
