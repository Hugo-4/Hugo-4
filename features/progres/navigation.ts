import { router } from 'expo-router';

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
