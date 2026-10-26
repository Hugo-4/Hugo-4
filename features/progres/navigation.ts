import { router } from 'expo-router';

import { PREFIXE_FICTIF } from './mockProgres';
import type { RecordJalon, TestAthlete } from './types';

/** Vues de détail de Progrès (`app/progres/[vue].tsx`). */
export const VUES_PROGRES = ['tests', 'charge', 'records', 'niveaux', 'regularite', 'ligues'] as const;
export type VueProgres = (typeof VUES_PROGRES)[number];

export function estVueProgres(valeur: unknown): valeur is VueProgres {
  return VUES_PROGRES.some((v) => v === valeur);
}

/**
 * Ouvre une vue (niveau 2 : la tendance) ou un détail précis (niveau 3, en paramètres de requête) :
 * `/progres/tests?type=vma`, `/progres/niveaux?qualite=vma`, `/progres/tests?ajouter=1`.
 */
export function ouvrirVue(vue: VueProgres, parametres: Record<string, string> = {}) {
  router.push({ pathname: '/progres/[vue]', params: { vue, ...parametres } });
}

/**
 * Niveau 3 d'un record ou d'un jalon : son origine, quand elle est connue. Test → détail du test (retrouvé dans
 * `GET /tests` par son id), séance → détail de la séance. Autre origine, test absent de l'historique ou données
 * d'exemple : `null` (la carte n'est pas tactile).
 */
export function ouvertureOrigine(record: RecordJalon, tests: TestAthlete[] | undefined): (() => void) | null {
  const origine = record.origine;
  if (!origine || origine.id.startsWith(PREFIXE_FICTIF)) return null;
  if (origine.type === 'seance') {
    return () => router.push({ pathname: '/programme/seance/[id]', params: { id: origine.id } });
  }
  const test = origine.type === 'test' ? tests?.find((t) => t.id === origine.id) : undefined;
  if (!test?.types_tests) return null;
  const filtre = {
    type: test.types_tests.slug,
    ...(test.exercices ? { exercice: test.exercices.slug } : {}),
    ...(test.cote ? { cote: test.cote } : {}),
  };
  return () => ouvrirVue('tests', filtre);
}
